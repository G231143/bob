"use client";

export const columns = ({ deleteTransaction }) => [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <button
          className="text-red-500 hover:underline"
          onClick={() => deleteTransaction(transaction.id)}
        >
          Delete
        </button>
      );
    },
  },
];
