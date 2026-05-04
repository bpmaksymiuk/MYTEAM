export const CYRILLIC_TO_GLAGOLITIC: Map<string, string> = new Map([
  ['А', 'Ⰰ'], ['а', 'ⰰ'],
  ['Б', 'Ⰱ'], ['б', 'ⰱ'],
  ['В', 'Ⰲ'], ['в', 'ⰲ'],
  ['Г', 'Ⰳ'], ['г', 'ⰳ'],
  ['Д', 'Ⰴ'], ['д', 'ⰴ'],
  ['Е', 'Ⰵ'], ['е', 'ⰵ'],
  ['Ж', 'Ⰶ'], ['ж', 'ⰶ'],
  ['З', 'Ⰸ'], ['з', 'ⰸ'],
  ['И', 'Ⰹ'], ['и', 'ⰹ'],
  ['К', 'Ⰽ'], ['к', 'ⰽ'],
  ['Л', 'Ⰾ'], ['л', 'ⰾ'],
  ['М', 'Ⰿ'], ['м', 'ⰿ'],
  ['Н', 'Ⱀ'], ['н', 'ⱀ'],
  ['О', 'Ⱁ'], ['о', 'ⱁ'],
  ['П', 'Ⱂ'], ['п', 'ⱂ'],
  ['Р', 'Ⱃ'], ['р', 'ⱃ'],
  ['С', 'Ⱄ'], ['с', 'ⱄ'],
  ['Т', 'Ⱅ'], ['т', 'ⱅ'],
  ['У', 'Ⱆ'], ['у', 'ⱆ'],
  ['Ф', 'Ⱇ'], ['ф', 'ⱇ'],
  ['Х', 'Ⱈ'], ['х', 'ⱈ'],
  ['Ц', 'Ⱌ'], ['ц', 'ⱌ'],
  ['Ш', 'Ⱎ'], ['ш', 'ⱎ'],
  ['Ч', 'Ⱏ'], ['ч', 'ⱏ'],
  ['Ъ', 'Ⱐ'], ['ъ', 'ⱐ'],
  ['Ы', 'Ⱑ'], ['ы', 'ⱑ'],
  ['Ь', 'Ⱒ'], ['ь', 'ⱒ'],
  ['Ю', 'Ⱓ'], ['ю', 'ⱓ'],
  ['Я', 'Ⱔ'], ['я', 'ⱔ'],
]);

export const GLAGOLITIC_TO_CYRILLIC: Map<string, string> = new Map(
  [...CYRILLIC_TO_GLAGOLITIC.entries()].map(([cyr, glag]) => [glag, cyr])
);

export interface CharPair {
  cyrillic: string;
  cyrillicName: string;
  glagolitic: string;
  glagoliticName: string;
}

export const CHAR_PAIRS: CharPair[] = [
  { cyrillic: 'А', cyrillicName: 'Az',       glagolitic: 'Ⰰ', glagoliticName: 'Az' },
  { cyrillic: 'Б', cyrillicName: 'Buki',     glagolitic: 'Ⰱ', glagoliticName: 'Buky' },
  { cyrillic: 'В', cyrillicName: 'Vedi',     glagolitic: 'Ⰲ', glagoliticName: 'Vidi' },
  { cyrillic: 'Г', cyrillicName: 'Glagoli',  glagolitic: 'Ⰳ', glagoliticName: 'Glagoli' },
  { cyrillic: 'Д', cyrillicName: 'Dobro',    glagolitic: 'Ⰴ', glagoliticName: 'Dobro' },
  { cyrillic: 'Е', cyrillicName: 'Jest',     glagolitic: 'Ⰵ', glagoliticName: 'Jest' },
  { cyrillic: 'Ж', cyrillicName: 'Živete',   glagolitic: 'Ⰶ', glagoliticName: 'Živěte' },
  { cyrillic: 'З', cyrillicName: 'Zemlja',   glagolitic: 'Ⰸ', glagoliticName: 'Ziemlja' },
  { cyrillic: 'И', cyrillicName: 'Izhe',     glagolitic: 'Ⰹ', glagoliticName: 'Izhe' },
  { cyrillic: 'К', cyrillicName: 'Kako',     glagolitic: 'Ⰽ', glagoliticName: 'Kako' },
  { cyrillic: 'Л', cyrillicName: 'Ljudi',    glagolitic: 'Ⰾ', glagoliticName: 'Ljudi' },
  { cyrillic: 'М', cyrillicName: 'Myslite',  glagolitic: 'Ⰿ', glagoliticName: 'Myslite' },
  { cyrillic: 'Н', cyrillicName: 'Naš',      glagolitic: 'Ⱀ', glagoliticName: 'Naš' },
  { cyrillic: 'О', cyrillicName: 'On',       glagolitic: 'Ⱁ', glagoliticName: 'On' },
  { cyrillic: 'П', cyrillicName: 'Pokoj',    glagolitic: 'Ⱂ', glagoliticName: 'Pokoj' },
  { cyrillic: 'Р', cyrillicName: 'Rci',      glagolitic: 'Ⱃ', glagoliticName: 'Rci' },
  { cyrillic: 'С', cyrillicName: 'Slovo',    glagolitic: 'Ⱄ', glagoliticName: 'Slovo' },
  { cyrillic: 'Т', cyrillicName: 'Tvrdo',    glagolitic: 'Ⱅ', glagoliticName: 'Tvrdo' },
  { cyrillic: 'У', cyrillicName: 'Uk',       glagolitic: 'Ⱆ', glagoliticName: 'Uku' },
  { cyrillic: 'Ф', cyrillicName: 'Fert',     glagolitic: 'Ⱇ', glagoliticName: 'Frt' },
  { cyrillic: 'Х', cyrillicName: 'Her',      glagolitic: 'Ⱈ', glagoliticName: 'Her' },
  { cyrillic: 'Ц', cyrillicName: 'Tsi',      glagolitic: 'Ⱌ', glagoliticName: 'Tsi' },
  { cyrillic: 'Ш', cyrillicName: 'Sha',      glagolitic: 'Ⱎ', glagoliticName: 'Sha' },
  { cyrillic: 'Ч', cyrillicName: 'Cherv',    glagolitic: 'Ⱏ', glagoliticName: 'Cherv' },
  { cyrillic: 'Ъ', cyrillicName: 'Jer',      glagolitic: 'Ⱐ', glagoliticName: 'Yer' },
  { cyrillic: 'Ы', cyrillicName: 'Yery',     glagolitic: 'Ⱑ', glagoliticName: 'Yery' },
  { cyrillic: 'Ь', cyrillicName: 'Jer soft', glagolitic: 'Ⱒ', glagoliticName: 'Soft Yer' },
  { cyrillic: 'Ю', cyrillicName: 'Yu',       glagolitic: 'Ⱓ', glagoliticName: 'Yu' },
  { cyrillic: 'Я', cyrillicName: 'Ya',       glagolitic: 'Ⱔ', glagoliticName: 'Ya' },
];
