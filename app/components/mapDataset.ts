export const START_YEAR = 1984;
export const END_YEAR = 2024;
export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export type DatasetMode = 'normal' | 'climatology' | 'yearly';

export type DatasetConfig = {
  maxIndex: number;
  sourceUrl: string;
  defaultClim: [number, number];
  legendUnitLabel: string;
};

const DEFAULT_SOURCE_URL = 'https://atlantis-vis-o.s3-ext.jc.rl.ac.uk/openday/age_of_sea_ice.zarr';
const CLIMATOLOGY_SOURCE_URL =
  'https://atlantis-vis-o.s3-ext.jc.rl.ac.uk/openday/age_of_sea_ice_climatology.zarr';
export const DATASET_CONFIG: Record<DatasetMode, DatasetConfig> = {
  normal: {
    maxIndex: (END_YEAR - START_YEAR + 1) * 12 - 1,
    sourceUrl: DEFAULT_SOURCE_URL,
    defaultClim: [0, 5],
    legendUnitLabel: 'Years'
  },
  climatology: {
    maxIndex: 11,
    sourceUrl: CLIMATOLOGY_SOURCE_URL,
    defaultClim: [0, 5],
    legendUnitLabel: 'Months'
  },
  yearly: {
    maxIndex: END_YEAR - START_YEAR,
    sourceUrl: DEFAULT_SOURCE_URL,
    defaultClim: [0, 5],
    legendUnitLabel: 'Year'
  }
};

export function normalizeDatasetMode(value: string | null): DatasetMode {
  if (value === 'climatology' || value === 'yearly') {
    return value;
  }

  return 'normal';
}
