import type { SqlValue } from 'sql.js';

export type Row = { [column: string]: SqlValue };
