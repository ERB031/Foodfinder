export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api/v1'
  : 'https://api.foodfinder.app/api/v1';

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
} as const;

export const MAX_PHOTOS_PER_RECOMMENDATION = 5;

export const CUISINE_TYPES = [
  'American',
  'Chinese',
  'French',
  'Indian',
  'Italian',
  'Japanese',
  'Korean',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Thai',
  'Vietnamese',
  'Other',
] as const;

export const SPECIALIZATIONS = [
  'Pastry',
  'BBQ',
  'Sushi',
  'Italian',
  'French',
  'Farm-to-Table',
  'Vegan',
  'Seafood',
  'Street Food',
  'Fine Dining',
  'Bakery',
  'Other',
] as const;
