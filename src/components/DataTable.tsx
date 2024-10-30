import type { InputHTMLAttributes } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { FaSortDown, FaSortUp } from 'react-icons/fa6';
import { Table } from './ui/table';
import { Input } from './ui/input';
import { Pagination } from './ui/pagination';
import type { Row } from '~/types';
import { HStack, Stack } from 'styled-system/jsx';

export function DataTable(props: { data: Row[]; tableNames: string[] }) {
  // eslint-disable-next-line react-compiler/react-compiler
  'use no memo';

  const { data, tableNames } = props;
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20
  });

  const columns = useMemo<ColumnDef<Row, unknown>[]>(() => {
    return Object.keys(data[0]).map((column) => {
      return {
        accessorKey: column,
        cell: (info) => info.getValue()
        // meta: typeof data[0][column] === 'number' && {
        //   filterVariant: 'range'
        // }
      };
    });
  }, [data, tableNames]);

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: {
      columnFilters,
      sorting,
      pagination
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false
  });

  return (
    <Stack alignItems="center">
      <Stack w="full" h="full" overflowX="auto">
        <Table.Root>
          {/* <Table.Caption></Table.Caption> */}
          <Table.Head>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  return (
                    <Table.Header key={header.id} colSpan={header.colSpan} py="2">
                      {header.isPlaceholder ? null : (
                        <Stack gap="sm">
                          <HStack
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : ''
                            }}
                            onClick={header.column.getToggleSortingHandler()}
                            justifyContent="space-between"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {isSorted !== false &&
                              (isSorted === 'desc' ? <FaSortDown /> : <FaSortUp />)}
                          </HStack>
                          {header.column.getCanFilter() ? (
                            <Stack>
                              <Filter column={header.column} />
                            </Stack>
                          ) : null}
                        </Stack>
                      )}
                    </Table.Header>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Head>
          <Table.Body>
            {table.getRowModel().rows.map((row) => {
              return (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Table.Cell key={cell.id} whiteSpace="pre">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
          {/* <Table.Foot>
        <Table.Row>
          <Table.Cell colSpan={2}>Totals</Table.Cell>
          <Table.Cell>87</Table.Cell>
          <Table.Cell textAlign="right">$34,163.00</Table.Cell>
        </Table.Row>
      </Table.Foot> */}
        </Table.Root>
      </Stack>
      <Pagination
        count={data.length}
        pageSize={pagination.pageSize}
        defaultPage={1}
        onPageChange={({ page }) => {
          table.setPageIndex(page - 1);
        }}
        page={pagination.pageIndex + 1}
      />
    </Stack>
  );
}

function Filter({ column }: { column: Column<Row, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = (column.columnDef.meta ?? {}) as { filterVariant?: string };

  return filterVariant === 'range' ? (
    <Stack>
      <HStack>
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          className="shadow border rounded w-24"
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
          placeholder={`Min`}
        />
        <DebouncedInput
          className="shadow border rounded w-24"
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
          placeholder={`Max`}
        />
      </HStack>
    </Stack>
  ) : filterVariant === 'select' ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      <option value="complicated">complicated</option>
      <option value="relationship">relationship</option>
      <option value="single">single</option>
    </select>
  ) : (
    <DebouncedInput
      className="shadow border rounded w-36"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
    // See faceted column filters example for datalist search suggestions
  );
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return <Input {...props} size="xs" value={value} onChange={(e) => setValue(e.target.value)} />;
}
