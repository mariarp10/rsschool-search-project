import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { FlyAway } from './fly-away';
import { useSelectionStore } from '@store/selection.store';
import { MockCharacters } from '@tests/fixtures';
import { convertToCSV, downloadFile } from '@utils/helpers';

vi.mock('@utils/helpers', async () => {
  const actual =
    await vi.importActual<typeof import('@utils/helpers')>('@utils/helpers');

  return {
    ...actual,
    convertToCSV: vi.fn(),
    downloadFile: vi.fn(),
  };
});

const mockedConvertToCSV = vi.mocked(convertToCSV);
const mockedDownloadFile = vi.mocked(downloadFile);

describe('FlyAway', () => {
  beforeEach(() => {
    useSelectionStore.setState({
      selectedCharacters: [],
    });

    mockedConvertToCSV.mockReset();
    mockedDownloadFile.mockReset();
  });

  test('does not render when there are no selected characters', () => {
    const { container } = render(<FlyAway />);

    expect(container).toBeEmptyDOMElement();
  });

  test('renders selected characters from store', () => {
    const selectedCharacters = [MockCharacters[0], MockCharacters[1]];

    useSelectionStore.setState({
      selectedCharacters,
    });

    render(<FlyAway />);

    expect(screen.getByText(MockCharacters[0].name)).toBeInTheDocument();
    expect(screen.getByText(MockCharacters[1].name)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /download \(2\)/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  test('removes character from store when delete button is clicked', async () => {
    const user = userEvent.setup();

    const selectedCharacters = [MockCharacters[0], MockCharacters[1]];

    useSelectionStore.setState({
      selectedCharacters,
    });

    render(<FlyAway />);

    await user.click(
      screen.getByRole('button', {
        name: `Remove ${MockCharacters[0].name}`,
      }),
    );

    expect(useSelectionStore.getState().selectedCharacters).toEqual([
      MockCharacters[1],
    ]);

    expect(screen.queryByText(MockCharacters[0].name)).not.toBeInTheDocument();
    expect(screen.getByText(MockCharacters[1].name)).toBeInTheDocument();
  });

  test('clears selected characters when Clear button is clicked', async () => {
    const user = userEvent.setup();

    useSelectionStore.setState({
      selectedCharacters: [MockCharacters[0], MockCharacters[1]],
    });

    render(<FlyAway />);

    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(useSelectionStore.getState().selectedCharacters).toEqual([]);
    expect(screen.queryByText(MockCharacters[0].name)).not.toBeInTheDocument();
    expect(screen.queryByText(MockCharacters[1].name)).not.toBeInTheDocument();
  });

  test('converts selected characters to CSV and starts file download', async () => {
    const user = userEvent.setup();

    const selectedCharacters = [MockCharacters[0], MockCharacters[1]];

    mockedConvertToCSV.mockReturnValue('name,status\nRick,Alive');

    useSelectionStore.setState({
      selectedCharacters,
    });

    render(<FlyAway />);

    await user.click(
      screen.getByRole('button', {
        name: /download \(2\)/i,
      }),
    );

    expect(mockedConvertToCSV).toHaveBeenCalledTimes(1);
    expect(mockedConvertToCSV).toHaveBeenCalledWith(selectedCharacters);

    expect(mockedDownloadFile).toHaveBeenCalledTimes(1);
    expect(mockedDownloadFile).toHaveBeenCalledWith(
      'name,status\nRick,Alive',
      '2_characters.csv',
    );
  });
});
