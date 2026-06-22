'use client';

import { ErrorNotification } from '@ui/error-notification/error-notification';
import { Search } from '@components/search/search';
import { ApiError } from '@utils/api-error';

const SERVER_ERROR_CODE = 500;

type CharactersErrorProps = {
  error: Error;
};

const getErrorCode = (error: Error): number => {
  if (error instanceof ApiError) {
    return error.status;
  }

  return SERVER_ERROR_CODE;
};

export default function CharactersError({ error }: CharactersErrorProps) {
  const errorCode = getErrorCode(error);

  return (
    <section style={{ paddingInline: '100px' }}>
      <Search />
      <ErrorNotification errorCode={errorCode} />
    </section>
  );
}
