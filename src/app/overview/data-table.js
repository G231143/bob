"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Your DataTable component (unchanged)
export function DataTable({ columns, data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Sample initial transactions data
const initialTransactions = [
  {
    id: 1,
    title: "Groceries",
    amount: -50,
    category: "Food",
    date: "2025-06-08",
    type: "Expense",
  },
  {
    id: 2,
    title: "Part-Time Job",
    amount: 300,
    category: "Income",
    date: "2025-06-07",
    type: "Income",
  },
];

// Columns definition including the delete action
const columnsDefinition = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "type", header: "Type" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => (
      <button
        className="text-red-500"
        onClick={() => {
          // Trigger the delete function passed in meta
          table.options.meta?.deleteTransaction(row.original.id);
        }}
      >
        Delete
      </button>
    ),
  },
];

// Main component managing state and passing props
export default function TransactionsManager() {
  const [transactions, setTransactions] = useState(initialTransactions);

  // Delete handler
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Pass the deleteTransaction function via table meta so it is accessible in cell renderers
  const tableMeta = { deleteTransaction };

  return (
    <DataTable
      columns={columnsDefinition}
      data={transactions}
      // Pass meta for access inside cells
      meta={tableMeta}
    />
  );
}
