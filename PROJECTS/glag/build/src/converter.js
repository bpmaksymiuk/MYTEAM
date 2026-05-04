import { CYRILLIC_TO_GLAGOLITIC, GLAGOLITIC_TO_CYRILLIC } from './mapping';
export function convert(input, direction) {
    const map = direction === 'cyr-glag' ? CYRILLIC_TO_GLAGOLITIC : GLAGOLITIC_TO_CYRILLIC;
    let result = '';
    for (const char of input) {
        result += map.get(char) ?? char;
    }
    return result;
}
