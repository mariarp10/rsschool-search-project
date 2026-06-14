import type { Character } from './types';

const sanitizeCsvCell = (value: string | number): string => {
  const formulaPrefixPattern = /^[=+\-@]/;

  const stringValue = String(value);
  const safeValue = formulaPrefixPattern.test(stringValue)
    ? `'${stringValue}`
    : stringValue;

  return `"${safeValue.replaceAll('"', '""')}"`;
};

export const convertToCSV = (characters: Character[]): string => {
  const headers = [
    'id',
    'name',
    'status',
    'species',
    'episodesCount',
    'origin',
  ];

  const rows = characters.map((character) => [
    character.id,
    character.name,
    character.status,
    character.species,
    character.episode.length,
    character.origin.name,
  ]);

  return [headers, ...rows]
    .map((row) => row.map((item) => sanitizeCsvCell(item)).join(','))
    .join('\n');
};

export const downloadFile = (data: string, fileName: string): void => {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;

  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
