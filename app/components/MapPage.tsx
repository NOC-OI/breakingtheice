'use client';

import { useEffect, useMemo, useRef } from 'react';
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

  float a = clamp(age, 0.0, 5.0);

  vec3 c0 = vec3(0.3059, 0.3725, 0.4235);
  vec3 c1 = vec3(0.4078, 0.4588, 0.5098);
  vec3 c2 = vec3(0.5137, 0.5725, 0.6078);
  vec3 c3 = vec3(0.6588, 0.7137, 0.7451);
  vec3 c4 = vec3(0.7804, 0.8431, 0.8706);

  vec3 baseColor;

  if (a < 1.0) {
    baseColor = mix(c0, c1, smoothstep(0.0, 1.0, a));
  } else if (a < 2.0) {
    baseColor = mix(c1, c2, smoothstep(1.0, 2.0, a));
  } else if (a < 3.0) {
    baseColor = mix(c2, c3, smoothstep(2.0, 3.0, a));
  } else if (a < 4.0) {
    baseColor = mix(c3, c4, smoothstep(3.0, 4.0, a));
  } else {
    baseColor = c4;
  }

  float x = clamp(a / 5.0, 0.0, 1.0);
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

  float alpha = opacity * mix(0.68, 0.96, smoothstep(0.0, 0.45, x));
  fragColor = vec4(clamp(color, 0.0, 1.0), alpha);
`;

type MapPageProps = {
  hasQuestStarted: boolean;
  yearIndex: number;
  timelineVisible: boolean;
  onToggleTimeline: () => void;
  onHideTimeline: () => void;
  onChangeYear: (index: number) => void;
  onStartOrResume: () => void;
};

export function MapPage({
  hasQuestStarted,
  yearIndex,
  timelineVisible,
  onToggleTimeline,
  onHideTimeline,
  onChangeYear,
  onStartOrResume
}: MapPageProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const zarrLayerRef = useRef<ZarrLayer | null>(null);
  const yearIndexRef = useRef(yearIndex);

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
      center: [-40, 73],
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
        source: 'https://atlantis-vis-o.s3-ext.jc.rl.ac.uk/openday/iceage.zarr',
        variable: 'age_of_sea_ice',
        clim: [0, 5],
        fillValue: 21,
        colormap: ICE_COLORMAP,
        zarrVersion: 3,
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

  return (
    <section className="relative z-10 h-full w-full">
      <div className="absolute inset-0">
        <div ref={mapContainerRef} className="h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.1),rgba(0,0,0,0.55)_75%)]" />
      </div>

      <div className="absolute left-6 top-6 rounded-md bg-black/45 px-4 py-2 text-3xl font-extrabold tracking-wide text-white sm:text-4xl">
        {currentYear}
      </div>

      <button
        type="button"
        onClick={onStartOrResume}
        className="absolute right-6 top-6 flex items-center gap-3 rounded-xl border border-white/50 bg-[#00b5ff] px-5 py-2.5 text-2xl font-extrabold tracking-wide text-[#0d3352] shadow-[3px_3px_1px_rgba(255,255,255,0.2)] transition hover:brightness-105 sm:text-4xl"
      >
        <span>{hasQuestStarted ? 'Resume Quest' : 'Start Quest'}</span>
        <Image
          src={ASSETS.bearAvatar}
          alt="Quest agent"
          width={56}
          height={56}
          className="h-12 w-12 rounded-full border-2 border-[#0d3352] object-cover sm:h-14 sm:w-14"
        />
      </button>

      {timelineVisible && (
        <TimeSlider
          yearIndex={yearIndex}
          onHideTimeline={onHideTimeline}
          onChangeYear={onChangeYear}
        />
      )}

      {!timelineVisible && (
        <div className="absolute bottom-8 right-6 z-20">
          <button
            type="button"
            onClick={onToggleTimeline}
            className="rounded-[10px] bg-[#0d3352] p-3 shadow-[4px_4px_4px_rgba(255,255,255,0.1)]"
            aria-label="Show timeline"
          >
            <span className="flex h-5 w-6 items-center justify-center rounded-xs bg-[#faf7f5] px-1 py-1.5">
              <Image
                src={ASSETS.visibilityHideIcon}
                alt=""
                width={14}
                height={10}
                aria-hidden
                className="h-2.5 w-3.5"
              />
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
