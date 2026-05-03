import fs from 'fs/promises';

const API_URL = 'https://rickandmortyapi.com/api';
const DELAY_MS = 1000;
const OUTPUT_FILE_PATH = './public/all-characters.json';

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchCharactersPage(page) {
  const url = `${API_URL}/character?page=${page}`;
  console.log(`fetching page ${page}`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch page ${page}. Status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

async function generateCharactersJson() {
  const allCharacters = [];

  const firstPageData = await fetchCharactersPage(1);

  allCharacters.push(...firstPageData.results);

  const totalPages = firstPageData.info.pages;

  console.log(`Total pages: ${totalPages}`);
  console.log(`Characters loaded so far: ${allCharacters.length}`);

  for (let page = 2; page <= totalPages; page += 1) {
    await delay(DELAY_MS);

    const pageData = await fetchCharactersPage(page);

    allCharacters.push(...pageData.results);

    console.log(`Characters loaded so far: ${allCharacters.length}`);
  }

  await fs.writeFile(OUTPUT_FILE_PATH, JSON.stringify(allCharacters, null, 2));

  console.log(`Done. Saved ${allCharacters.length} characters to ${OUTPUT_FILE_PATH}`);
}

generateCharactersJson();
