import { z } from 'zod';
import { CharacterSchema } from '@utils/api.schemas';
import { NextResponse } from 'next/server';
import { convertToCSV } from '@utils/download-csv';

const CharactersSchema = z.array(CharacterSchema);

export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json();

  const parsedCharacters = CharactersSchema.safeParse(body);

  if (!parsedCharacters.success) {
    return NextResponse.json(
      { message: 'Invalid characters data' },
      { status: 400 },
    );
  }

  const characters = parsedCharacters.data;
  const csv = convertToCSV(characters);

  return new Response(csv, {
    status: 200,

    headers: {
      'Content-Type': 'text/csv; charset=utf-8',

      'Content-Disposition': `attachment; filename="${String(characters.length)}_characters.csv"`,
    },
  });
}
