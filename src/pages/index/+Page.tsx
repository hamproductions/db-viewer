import { sortBy } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Center, HStack, Stack } from 'styled-system/jsx';
import { DataTable } from '~/components/DataTable';
import { Metadata } from '~/components/layout/Metadata';
import { Heading } from '~/components/ui/heading';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { UploadBox } from '~/components/UploadBox';
import { useDatabase } from '~/hooks/useDatabase';
import { parseDBResults } from '~/utils/db';

export function Page() {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File>();
  const { db } = useDatabase(selectedFile);
  const [selectedTable, setSelectedTable] = useState<string>();
  const [tableFilter, setTableFilter] = useState<string>();

  const tableList = useMemo(() => {
    if (!db) return [];
    const r = db?.exec('SELECT * FROM sqlite_master WHERE type="table"');
    if (!r?.[0]) return;
    return sortBy(parseDBResults(r[0]), 'tbl_name');
  }, [db]);

  const tableData = useMemo(() => {
    if (!db) return;
    if (!selectedTable) return;
    const tableName = selectedTable.replaceAll(
      /[\t\r\n]|(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*)\*\/)/gi,
      ''
    );
    // Can't hardcode
    const r = db?.exec(`SELECT * FROM '${tableName}'`);
    if (!r?.[0]) return;
    return parseDBResults(r[0]);
  }, [selectedTable, db]);

  const filteredTable = useMemo(() => {
    if (!tableFilter) return tableList;
    return tableList?.filter((d) => {
      return d.name?.toString().includes(tableFilter);
    });
  }, [tableData, tableFilter, db]);

  useEffect(() => {
    if (!db) {
      setSelectedTable(undefined);
      setTableFilter(undefined);
    }
  }, [db]);

  return (
    <>
      <Metadata title={t('title')} helmet />
      <Center>
        <Stack alignItems="center" w="full" maxWidth="breakpoint-xl">
          <Heading as="h1" fontSize="2xl">
            {t('title')}
          </Heading>
          <Text>{t('description')}</Text>
          <UploadBox
            accept=".sqlite,.sqlite3"
            maxFiles={1}
            file={selectedFile}
            onFileChange={({ acceptedFiles }) => setSelectedFile(acceptedFiles[0])}
          />
          <HStack alignItems="flex-start" w="full">
            <Stack>
              <Input
                value={tableFilter}
                onChange={(e) => setTableFilter(e.currentTarget.value)}
                placeholder={t('table.filter')}
              />
              {filteredTable && (
                <Stack gap={0}>
                  {filteredTable.map((row) => {
                    return (
                      <HStack
                        onClick={() => setSelectedTable(row.name?.toString())}
                        key={`${row.tbl_name?.toString()}`}
                        data-selected={selectedTable === row.name ? true : undefined}
                        borderBottom="1px solid"
                        borderBottomColor="border.default"
                        p="2"
                        bgColor={{ _selected: 'bg.emphasized' }}
                        transition="background"
                        _hover={{ bgColor: 'bg.subtle' }}
                      >
                        <Text>{row.name}</Text>
                      </HStack>
                    );
                  })}
                </Stack>
              )}
            </Stack>
            {selectedTable && (
              <Stack w="full" overflow="hidden">
                <Heading>{selectedTable}</Heading>
                {tableData ? (
                  <DataTable
                    key={`table-${selectedTable}`}
                    data={tableData}
                    tableNames={tableList?.map((r) => r.name?.toString() ?? '') ?? []}
                  />
                ) : (
                  <Center w="full" h="full">
                    <Text>{t('table.no-data')}</Text>
                  </Center>
                )}
              </Stack>
            )}
          </HStack>
        </Stack>
      </Center>
    </>
  );
}
