import { ChannelTypes } from '~/types/program';

export const CHANNEL_TYPES = {
  地上波: 2,
  BSデジタル: 3,
  BS4K: 5,
  CS: 120,
} as const satisfies ChannelTypes;
