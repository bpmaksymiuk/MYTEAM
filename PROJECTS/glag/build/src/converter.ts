import { CYRILLIC_TO_GLAGOLITIC, GLAGOLITIC_TO_CYRILLIC } from './mapping';

export type Direction = 'cyr-glag' | 'glag-cyr';

export function convert(input: string, direction: Direction): string {
  const map = direction === 'cyr-glag' ? CYRILLIC_TO_GLAGOLITIC : GLAGOLITIC_TO_CYRILLIC;
  let result = '';
  for (const char of input) {
    result += map.get(char) ?? char;
  }
  return result;
}
