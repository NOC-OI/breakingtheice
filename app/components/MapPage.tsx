'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import maplibregl from 'maplibre-gl';
import { ZarrLayer, type Selector } from '@carbonplan/zarr-layer';
import { allColorScales, colormapBuilder } from 'zarr-cesium';
import { ASSETS } from './assets';
import { TimeSlider } from './TimeSlider';

const START_YEAR = 1984;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ZARR_LAYER_ID = 'arctic-ice-age-layer';

const ICE_COLORMAP = ['#4E5F6C', '#687582', '#83929B', '#A8B6BE', '#C7D7DE'];
const DEFAULT_CLIM: [number, number] = [0, 5];
const LEGEND_BINS = 5;
const QUERY_COLORMAP_STEPS = 255;
const MAX_SHADER_COLOR_STOPS = 24;
const COLORMAP_NAME_LOOKUP = new Map(allColorScales.map(name => [name.toLowerCase(), name]));

const ICE_AGE_CUSTOM_FRAG = `
  float age = age_of_sea_ice;

  if (age >= 20.5 || age <= 0.0 || age != age) {
    discard;
  }

  float bucket = clamp(floor(age), 0.0, 4.0);

  vec3 c0 = vec3(0.3059, 0.3725, 0.4235);
  vec3 c1 = vec3(0.4078, 0.4588, 0.5098);
  vec3 c2 = vec3(0.5137, 0.5725, 0.6078);
  vec3 c3 = vec3(0.6588, 0.7137, 0.7451);
  vec3 c4 = vec3(0.7804, 0.8431, 0.8706);

  vec3 baseColor;

  if (bucket < 0.5) {
    baseColor = c0;
  } else if (bucket < 1.5) {
    baseColor = c1;
  } else if (bucket < 2.5) {
    baseColor = c2;
  } else if (bucket < 3.5) {
    baseColor = c3;
  } else {
    baseColor = c4;
  }

  float x = clamp(bucket / 4.0, 0.0, 1.0);
  vec3 color = baseColor;

  vec3 iceWhite = vec3(0.91, 0.97, 1.0);
  float oldness = smoothstep(0.35, 1.0, x);
  color = mix(color, iceWhite, oldness * 0.20);

  float youngness = 1.0 - smoothstep(0.15, 0.55, x);
  color *= mix(vec3(0.82, 0.88, 0.94), vec3(1.0), 1.0 - youngness);
  color *= mix(vec3(1.0), vec3(0.86, 0.97, 1.14), oldness * 0.30);
  color = mix(color, vec3(0.82, 0.91, 0.97), youngness * 0.08);

  float tonal = mix(0.88, 1.08, smoothstep(0.0, 1.0, x));
  color *= tonal;
  color = pow(clamp(color, 0.0, 1.0), vec3(0.90));

  float alpha = opacity * mix(0.72, 0.96, smoothstep(0.0, 0.45, x));
  fragColor = vec4(clamp(color, 0.0, 1.0), alpha);
`;

function toGlslFloat(value: number): string {
  return Number.isInteger(value) ? `${value.toFixed(1)}` : `${value}`;
}

function hexToRgb(color: string): [number, number, number] | null {
  const normalized = color.trim();
  const match = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(normalized);

  if (!match) {
    return null;
  }

  const [, rHex, gHex, bHex] = match;
  const r = Number.parseInt(rHex, 16) / 255;
  const g = Number.parseInt(gHex, 16) / 255;
  const b = Number.parseInt(bHex, 16) / 255;
  return [r, g, b];
}

function sampleShaderColormap(colormap: string[]): string[] {
  if (colormap.length <= MAX_SHADER_COLOR_STOPS) {
    return colormap;
  }

  return Array.from({ length: MAX_SHADER_COLOR_STOPS }, (_, index) => {
    const position = index / (MAX_SHADER_COLOR_STOPS - 1);
    const colorIndex = Math.round(position * (colormap.length - 1));
    return colormap[colorIndex];
  });
}

function buildCustomFragFromColormap(colormap: string[], clim: [number, number]): string {
  const [climMin, climMax] = clim;
  const parsedColors = sampleShaderColormap(colormap)
    .map(hexToRgb)
    .filter((value): value is [number, number, number] => value !== null);

  if (parsedColors.length === 0) {
    return ICE_AGE_CUSTOM_FRAG;
  }

  const shaderColors =
    parsedColors.length === 1 ? [parsedColors[0], parsedColors[0]] : parsedColors;
  const colorDefinitions = shaderColors
    .map(
      ([r, g, b], index) =>
        `  vec3 c${index} = vec3(${toGlslFloat(r)}, ${toGlslFloat(g)}, ${toGlslFloat(b)});`
    )
    .join('\n');

  const segmentCount = shaderColors.length - 1;
  const interpolationRules = Array.from({ length: segmentCount }, (_, index) => {
    const start = index / segmentCount;
    const end = (index + 1) / segmentCount;
    const prefix = index === 0 ? 'if' : 'else if';

    return `  ${prefix} (x <= ${toGlslFloat(end)}) {
    float t = smoothstep(${toGlslFloat(start)}, ${toGlslFloat(end)}, x);
    color = mix(c${index}, c${index + 1}, t);
  }`;
  }).join(' ');

  return `
  float age = age_of_sea_ice;

  if (age >= 20.5 || age <= 0.0 || age != age) {
    discard;
  }

  float x = clamp((age - ${toGlslFloat(climMin)}) / (${toGlslFloat(climMax)} - ${toGlslFloat(climMin)}), 0.0, 1.0);

${colorDefinitions}

  vec3 color = c0;
${interpolationRules} else {
    color = c${segmentCount};
  }

  float alpha = opacity * mix(0.72, 0.96, smoothstep(0.0, 0.45, x));
  fragColor = vec4(clamp(color, 0.0, 1.0), alpha);
`;
}

type MapPageProps = {
  hasQuestStarted: boolean;
  yearIndex: number;
  timelineVisible: boolean;
  onToggleTimeline: () => void;
  onChangeYear: (index: number) => void;
  onStartOrResume: () => void;
};

export function MapPage({
  hasQuestStarted,
  yearIndex,
  timelineVisible,
  onToggleTimeline,
  onChangeYear,
  onStartOrResume
}: MapPageProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const zarrLayerRef = useRef<ZarrLayer | null>(null);
  const yearIndexRef = useRef(yearIndex);
  const startButtonTimerRef = useRef<number | null>(null);
  const [isStartButtonPressing, setIsStartButtonPressing] = useState(false);
  const [queryColormapParam, setQueryColormapParam] = useState<string | null>(null);
  const [queryClimParam, setQueryClimParam] = useState<string | null>(null);
  const [queryParamsInitialized, setQueryParamsInitialized] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Query params are browser-only; we intentionally initialize local state once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQueryColormapParam(params.get('colormap'));
    setQueryClimParam(params.get('clim'));
    setQueryParamsInitialized(true);
  }, []);

  const queryColormapName = useMemo(() => {
    const value = queryColormapParam?.trim();
    if (!value) {
      return null;
    }

    return COLORMAP_NAME_LOOKUP.get(value.toLowerCase()) ?? null;
  }, [queryColormapParam]);

  const layerColormap = useMemo(() => {
    if (!queryColormapName) {
      return ICE_COLORMAP;
    }

    try {
      return colormapBuilder(queryColormapName, 'hex', QUERY_COLORMAP_STEPS) as string[];
    } catch (error) {
      console.warn(
        `[MapPage] Unable to build colormap from query param: ${queryColormapName}. Falling back to default.`,
        error
      );
      return ICE_COLORMAP;
    }
  }, [queryColormapName]);

  const layerClim = useMemo<[number, number]>(() => {
    const value = queryClimParam?.trim();
    if (!value) {
      return DEFAULT_CLIM;
    }

    const [startRaw, endRaw] = value.split(',');
    const start = Number.parseFloat(startRaw ?? '');
    const end = Number.parseFloat(endRaw ?? '');

    if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) {
      console.warn(`[MapPage] Invalid clim query param: ${value}. Falling back to default 0,5.`);
      return DEFAULT_CLIM;
    }

    return [start, end];
  }, [queryClimParam]);

  const legendColormap = useMemo(() => {
    if (layerColormap.length <= LEGEND_BINS) {
      return layerColormap;
    }

    return Array.from({ length: LEGEND_BINS }, (_, index) => {
      const position = index / (LEGEND_BINS - 1);
      const colorIndex = Math.round(position * (layerColormap.length - 1));
      return layerColormap[colorIndex];
    });
  }, [layerColormap]);

  const legendLabels = useMemo(() => {
    const [min, max] = layerClim;
    const binWidth = (max - min) / LEGEND_BINS;

    const format = (value: number) => {
      if (Number.isInteger(value)) {
        return `${value}`;
      }
      return value
        .toFixed(2)
        .replace(/\.0+$/, '')
        .replace(/(\.\d*[1-9])0+$/, '$1');
    };

    return Array.from({ length: LEGEND_BINS }, (_, index) => {
      const start = min + binWidth * index;
      const end = min + binWidth * (index + 1);
      return `${format(start)}-${format(end)}`;
    });
  }, [layerClim]);

  const layerCustomFrag = useMemo(() => {
    if (queryColormapName === null) {
      return ICE_AGE_CUSTOM_FRAG;
    }

    return buildCustomFragFromColormap(layerColormap, layerClim);
  }, [layerClim, layerColormap, queryColormapName]);

  useEffect(() => {
    return () => {
      if (startButtonTimerRef.current) {
        window.clearTimeout(startButtonTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    yearIndexRef.current = yearIndex;
  }, [yearIndex]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    if (!queryParamsInitialized) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/fiord',
      center: [-90, 73],
      zoom: 2,
      pitch: 10,
      bearing: -8,
      attributionControl: false
    });

    map.on('load', () => {
      map.setProjection({ type: 'globe' });

      const selector: Selector = {
        time: { selected: yearIndexRef.current, type: 'index' }
      };

      const zarrLayer = new ZarrLayer({
        id: ZARR_LAYER_ID,
        source: 'https://atlantis-vis-o.s3-ext.jc.rl.ac.uk/openday/age_of_sea_ice.zarr',
        variable: 'age_of_sea_ice',
        clim: layerClim,
        fillValue: 21,
        colormap: ICE_COLORMAP,
        zarrVersion: 3,
        bounds: [-4518421.5, -4518421.5, 4518421.5, 4518421.5],
        proj4:
          '+proj=laea +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +a=6371228 +b=6371228 +units=m +no_defs',
        selector,
        customFrag: layerCustomFrag
      });

      zarrLayerRef.current = zarrLayer;
      map.addLayer(zarrLayer);
      map.addSource('ocean-labels', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Arctic Ocean' },
              geometry: { type: 'Point', coordinates: [-10, 82] }
            },
            {
              type: 'Feature',
              properties: { name: 'North Atlantic Ocean' },
              geometry: { type: 'Point', coordinates: [-35, 35] }
            },
            {
              type: 'Feature',
              properties: { name: 'Pacific Ocean' },
              geometry: { type: 'Point', coordinates: [-150, 10] }
            },
            {
              type: 'Feature',
              properties: { name: 'Indian Ocean' },
              geometry: { type: 'Point', coordinates: [80, -25] }
            },
            {
              type: 'Feature',
              properties: { name: 'Southern Ocean' },
              geometry: { type: 'Point', coordinates: [0, -60] }
            }
          ]
        }
      });

      map.addLayer({
        id: 'ocean-labels',
        type: 'symbol',
        source: 'ocean-labels',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Noto Sans Italic'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 1, 14, 4, 22],
          'text-letter-spacing': 0.12,
          'text-max-width': 12,
          'text-allow-overlap': false,
          'symbol-placement': 'point'
        },
        paint: {
          'text-color': '#3b6f92',
          'text-halo-color': 'rgba(255, 255, 255, 0.65)',
          'text-halo-width': 1.2,
          'text-opacity': ['interpolate', ['linear'], ['zoom'], 1, 0.75, 5, 0.35]
        }
      });
      map.addSource('arctic-sea-labels', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            // Central ocean
            {
              type: 'Feature',
              properties: { name: 'Arctic Ocean', kind: 'ocean' },
              geometry: { type: 'Point', coordinates: [-35, 84] }
            },

            // Marginal seas around the Arctic Ocean
            {
              type: 'Feature',
              properties: { name: 'Beaufort Sea', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [-140, 72] }
            },
            {
              type: 'Feature',
              properties: { name: 'Chukchi Sea', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [-170, 70] }
            },
            {
              type: 'Feature',
              properties: { name: 'East Siberian Sea', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [160, 73] }
            },
            {
              type: 'Feature',
              properties: { name: 'Laptev Sea', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [125, 75] }
            },
            {
              type: 'Feature',
              properties: { name: 'Kara Sea', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [75, 74] }
            },
            {
              type: 'Feature',
              properties: { name: 'Barents Sea', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [38, 74] }
            },
            {
              type: 'Feature',
              properties: { name: 'Pechora Sea', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [55, 69.5] }
            },
            {
              type: 'Feature',
              properties: { name: 'White Sea', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [38, 65.5] }
            },
            {
              type: 'Feature',
              properties: { name: 'Greenland Sea', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [-5, 75] }
            },
            {
              type: 'Feature',
              properties: { name: 'Norwegian Sea', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [0, 68] }
            },
            {
              type: 'Feature',
              properties: { name: 'Lincoln Sea', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [-55, 83] }
            },
            {
              type: 'Feature',
              properties: { name: 'Wandel Sea', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [-15, 82] }
            },

            // Optional, useful if your map extends toward Canada/Greenland
            {
              type: 'Feature',
              properties: { name: 'Baffin Bay', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [-68, 74] }
            },
            {
              type: 'Feature',
              properties: { name: 'Hudson Bay', kind: 'sea' },
              geometry: { type: 'Point', coordinates: [-85, 60] }
            }
          ]
        }
      });

      map.addLayer({
        id: 'arctic-sea-labels',
        type: 'symbol',
        source: 'arctic-sea-labels',
        minzoom: 1,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Noto Sans Italic'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1,
            ['case', ['==', ['get', 'kind'], 'ocean'], 16, 11],
            4,
            ['case', ['==', ['get', 'kind'], 'ocean'], 26, 17]
          ],
          'text-letter-spacing': ['case', ['==', ['get', 'kind'], 'ocean'], 0.16, 0.08],
          'text-max-width': 18,
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'symbol-placement': 'point'
        },
        paint: {
          'text-color': '#111111',
          'text-halo-color': 'rgba(255, 255, 255, 0.75)',
          'text-halo-width': 1.2,
          'text-opacity': 0.95
        }
      });
    });

    mapRef.current = map;

    return () => {
      if (map.getLayer(ZARR_LAYER_ID)) {
        map.removeLayer(ZARR_LAYER_ID);
      }
      map.remove();
      mapRef.current = null;
      zarrLayerRef.current = null;
    };
  }, [layerClim, layerCustomFrag, queryParamsInitialized]);

  useEffect(() => {
    const zarrLayer = zarrLayerRef.current;
    if (!zarrLayer) {
      return;
    }

    const selector: Selector = {
      time: { selected: yearIndex, type: 'index' }
    };

    void zarrLayer.setSelector(selector);
  }, [yearIndex]);

  const currentYear = useMemo(() => {
    const year = START_YEAR + Math.floor(yearIndex / 12);
    const month = MONTHS[yearIndex % 12];
    return `${month} ${year}`;
  }, [yearIndex]);

  function handleStartOrResumeClick() {
    if (startButtonTimerRef.current) {
      window.clearTimeout(startButtonTimerRef.current);
    }

    setIsStartButtonPressing(true);
    startButtonTimerRef.current = window.setTimeout(() => {
      onStartOrResume();
      setIsStartButtonPressing(false);
    }, 140);
  }

  return (
    <section className="relative z-10 h-full w-full">
      <div className="absolute inset-0">
        <div ref={mapContainerRef} className="h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.1),rgba(0,0,0,0.55)_75%)]" />
      </div>

      <div className="absolute left-6 top-6 z-20 flex flex-col gap-2">
        <div className="flex h-14 w-max items-center rounded-md px-4 text-3xl font-extrabold tracking-wide text-white sm:text-4xl">
          {currentYear}
        </div>
        <div className="rounded-md bg-black/45 px-3 py-2 text-white">
          <div className="mt-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-wide text-white/85">
            <span>Sea Ice Age</span>
          </div>
          <div className="grid w-48 grid-cols-5 gap-0.5" aria-hidden>
            {legendColormap.map((color, index) => (
              <span
                key={`${color}-${index}`}
                className="h-2.5 first:rounded-l-full last:rounded-r-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="mt-0.5 grid w-48 grid-cols-5 text-[10px] font-extrabold tracking-wide text-white">
            {legendLabels.map(label => (
              <span key={label} className="text-center">
                {label}
              </span>
            ))}
          </div>
          <div className="mt-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-wide text-white/85">
            <span>Years</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleStartOrResumeClick}
        className={`absolute right-12 top-10 flex h-12 cursor-pointer items-center gap-3 rounded-xl bg-[#00b5ff] py-2.5 pl-5 text-2xl font-extrabold tracking-wide text-[#0d3352] shadow-[3px_3px_1px_rgba(255,255,255,0.2)] transition-all duration-200 hover:bg-[#00a0e0] hover:brightness-105 active:scale-[0.98] sm:text-4xl ${
          isStartButtonPressing ? 'scale-105' : 'scale-100'
        }`}
      >
        <span>{hasQuestStarted ? 'Resume Quest' : 'Start Quest'}</span>
        <Image
          src={ASSETS.bearZoom}
          alt="Quest agent"
          width={70}
          height={70}
          className="h-20 w-20 rounded-full border-2 border-[#0d3352] object-cover sm:h-20 sm:w-20 -mr-4"
        />
      </button>

      <TimeSlider
        yearIndex={yearIndex}
        timelineVisible={timelineVisible}
        onToggleTimeline={onToggleTimeline}
        onChangeYear={onChangeYear}
      />
    </section>
  );
}
