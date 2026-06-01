import { beforeEach, describe, expect, test, vi } from 'vitest';

import { convertToCSV, downloadFile } from './helpers';
import { MockCharacters } from '@tests/fixtures';

describe('helpers', () => {
  describe('convertToCSV', () => {
    test('converts characters to CSV string', () => {
      const characters = [MockCharacters[0]];
      const character = characters[0];

      const result = convertToCSV(characters);

      const expectedHeaders = [
        '"id"',
        '"name"',
        '"status"',
        '"species"',
        '"episodesCount"',
        '"origin"',
      ].join(',');

      const expectedRow = [
        String(character.id),
        character.name,
        character.status,
        character.species,
        String(character.episode.length),
        character.origin.name,
      ]
        .map((item) => `"${item}"`)
        .join(',');

      expect(result).toBe([expectedHeaders, expectedRow].join('\n'));
    });

    test('returns only headers when characters array is empty', () => {
      expect(convertToCSV([])).toBe(
        '"id","name","status","species","episodesCount","origin"',
      );
    });
  });

  describe('downloadFile', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    test('creates CSV file link, clicks it, and revokes object URL', () => {
      const objectUrl = 'blob:test-url';

      const createObjectURLMock = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue(objectUrl);

      const revokeObjectURLMock = vi
        .spyOn(URL, 'revokeObjectURL')
        .mockImplementation(() => undefined);

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const clickMock = vi.fn();

      vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        const element = document.createElementNS(
          'http://www.w3.org/1999/xhtml',
          tagName,
        ) as HTMLAnchorElement;

        element.click = clickMock;

        return element;
      });

      downloadFile('csv-data', 'characters.csv');

      expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob));
      expect(appendChildSpy).toHaveBeenCalledWith(
        expect.any(HTMLAnchorElement),
      );
      expect(clickMock).toHaveBeenCalledTimes(1);
      expect(removeChildSpy).toHaveBeenCalledWith(
        expect.any(HTMLAnchorElement),
      );
      expect(revokeObjectURLMock).toHaveBeenCalledWith(objectUrl);
    });
  });
});
