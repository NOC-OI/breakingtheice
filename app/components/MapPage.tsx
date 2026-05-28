'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import maplibregl from 'maplibre-gl';
import { ZarrLayer, type Selector } from '@carbonplan/zarr-layer';
import { ASSETS } from './assets';
import { TimeSlider } from './TimeSlider';

const START_YEAR = 1984;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ZARR_LAYER_ID = 'arctic-ice-age-layer';

const ICE_COLORMAP = ['#4E5F6C', '#687582', '#83929B', '#A8B6BE', '#C7D7DE'];

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
        clim: [0, 5],
        fillValue: 21,
        colormap: ICE_COLORMAP,
        zarrVersion: 3,
        bounds: [-4518421.5, -4518421.5, 4518421.5, 4518421.5],
        proj4:
          '+proj=laea +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +a=6371228 +b=6371228 +units=m +no_defs',
        selector,
        customFrag: ICE_AGE_CUSTOM_FRAG
      });

      zarrLayerRef.current = zarrLayer;
      map.addLayer(zarrLayer);
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
  }, []);

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
        <div className="rounded-md bg-black/45 px-3 py-2 text-white">
          <div className="mt-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-wide text-white/85">
            <span>Sea Ice Age</span>
          </div>
          <div className="grid w-48 grid-cols-5 gap-0.5" aria-hidden>
            {ICE_COLORMAP.map(color => (
              <span
                key={color}
                className="h-2.5 first:rounded-l-full last:rounded-r-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="mt-0.5 grid w-48 grid-cols-5 text-[10px] font-extrabold tracking-wide text-white">
            <span className="text-left">0-1</span>
            <span className="text-center">1-2</span>
            <span className="text-center">2-3</span>
            <span className="text-center">3-4</span>
            <span className="text-right">4+</span>
          </div>
          <div className="mt-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-wide text-white/85">
            <span>Years</span>
          </div>
        </div>

        <div className="flex h-14 w-max items-center rounded-md px-4 text-3xl font-extrabold tracking-wide text-white sm:text-4xl">
          {currentYear}
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
