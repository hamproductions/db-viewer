import { useEffect, useState } from 'react';
import type { SqlJsStatic, Database } from 'sql.js';
import initSqlJs from 'sql.js';

export const useDatabase = (file?: File) => {
  const [sqlJS, setSqlJS] = useState<SqlJsStatic>();
  const [db, setDB] = useState<Database>();

  useEffect(() => {
    void initSqlJs({ locateFile: (filename) => `/wasm/${filename}` }).then((sqlJs) =>
      setSqlJS(sqlJs)
    );
  }, []);

  useEffect(() => {
    if (!sqlJS) return;
    if (!file) {
      setDB(undefined);
      return;
    }
    void file.arrayBuffer().then((buffer) => {
      const db = new sqlJS.Database(new Uint8Array(buffer));
      setDB(db);
    });
  }, [file, sqlJS]);

  return { db };
};
