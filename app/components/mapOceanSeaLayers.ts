import type { Map } from 'maplibre-gl';

const OCEAN_LABELS_SOURCE_ID = 'ocean-labels';
const OCEAN_LABELS_LAYER_ID = 'ocean-labels';
const ARCTIC_SEA_LABELS_SOURCE_ID = 'arctic-sea-labels';
const ARCTIC_SEA_LABELS_LAYER_ID = 'arctic-sea-labels';

function moveLayerToTopIfPresent(map: Map, layerId: string): void {
  if (map.getLayer(layerId)) {
    map.moveLayer(layerId);
  }
}

export function removeOceanAndSeaLabels(map: Map): void {
  if (map.getLayer(OCEAN_LABELS_LAYER_ID)) {
    map.removeLayer(OCEAN_LABELS_LAYER_ID);
  }
  if (map.getSource(OCEAN_LABELS_SOURCE_ID)) {
    map.removeSource(OCEAN_LABELS_SOURCE_ID);
  }
  if (map.getLayer(ARCTIC_SEA_LABELS_LAYER_ID)) {
    map.removeLayer(ARCTIC_SEA_LABELS_LAYER_ID);
  }
  if (map.getSource(ARCTIC_SEA_LABELS_SOURCE_ID)) {
    map.removeSource(ARCTIC_SEA_LABELS_SOURCE_ID);
  }
}

export function addOceanAndSeaLabels(map: Map): void {
  if (!map.getSource(OCEAN_LABELS_SOURCE_ID)) {
    map.addSource(OCEAN_LABELS_SOURCE_ID, {
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
  }

  if (!map.getLayer(OCEAN_LABELS_LAYER_ID)) {
    map.addLayer({
      id: OCEAN_LABELS_LAYER_ID,
      type: 'symbol',
      source: OCEAN_LABELS_SOURCE_ID,
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
  }

  if (!map.getSource(ARCTIC_SEA_LABELS_SOURCE_ID)) {
    map.addSource(ARCTIC_SEA_LABELS_SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Arctic Ocean', kind: 'ocean' },
            geometry: { type: 'Point', coordinates: [-35, 84] }
          },
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
  }

  if (!map.getLayer(ARCTIC_SEA_LABELS_LAYER_ID)) {
    map.addLayer({
      id: ARCTIC_SEA_LABELS_LAYER_ID,
      type: 'symbol',
      source: ARCTIC_SEA_LABELS_SOURCE_ID,
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
  }

  moveLayerToTopIfPresent(map, OCEAN_LABELS_LAYER_ID);
  moveLayerToTopIfPresent(map, ARCTIC_SEA_LABELS_LAYER_ID);
}

export function bringOceanAndSeaLabelsToFront(map: Map): void {
  moveLayerToTopIfPresent(map, OCEAN_LABELS_LAYER_ID);
  moveLayerToTopIfPresent(map, ARCTIC_SEA_LABELS_LAYER_ID);
}
