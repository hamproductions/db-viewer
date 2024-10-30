import { zip } from 'lodash-es';
import type { QueryExecResult } from 'sql.js';
import type { Row } from '~/types';

export const parseDBResults = (result: QueryExecResult): Row[] => {
  const { columns, values } = result;
  return values.map((row) => {
    return Object.fromEntries(zip(columns, row));
  });
};
