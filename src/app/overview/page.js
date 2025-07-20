"use client";

import React, { useRef, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const initialTransactions = [
  {
    id: "728ed52f",
    title: "Check Deposit",
    amount: 100.0,
    category: "income",
    date: "2025-06-06",
    type: "Income",
  },
  {
    id: "489e1d42",
    title: "Lunch",
    amount: 25.0,
    category: "food",
    date: "2025-06-06",
    type: "Expense",
  },
];

export default function OverviewPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    type: "Expense",
  });
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const audioRef = useRef(null);

  const handleImageClick = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      ...form,
      id: Date.now().toString(),
      amount: parseFloat(form.amount),
    };
    setTransactions((prev) => [...prev, newTransaction]);
    setForm({ title: "", amount: "", category: "", date: "", type: "Expense" });
  };

  const filteredTransactions = transactions.filter((t) => {
    const typeMatch = filterType === "All" || t.type === filterType;
    const categoryMatch =
      filterCategory === "All" || t.category === filterCategory;
    return typeMatch && categoryMatch;
  });

  const income = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;

  const expenseData = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, curr) => {
      const found = acc.find((item) => item.name === curr.category);
      if (found) found.value += curr.amount;
      else acc.push({ name: curr.category, value: curr.amount });
      return acc;
    }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ffbb28"];
  
  const barChartData = Array.from(
  new Set(transactions.map((t) => t.date))
).map((date) => {
  const dayTransactions = transactions.filter((t) => t.date === date);
  const income = dayTransactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = dayTransactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);
  return { date, Income: income, Expense: expense };
});

const handleExport = () => {
  const csvRows = [
    ["Title", "Amount", "Category", "Date", "Type"],
    ...transactions.map((t) => [
      t.title,
      t.amount,
      t.category,
      t.date,
      t.type,
    ]),
  ];

  const csvContent = csvRows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "transactions.csv");
  link.click();
};

const handleImport = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const lines = event.target.result.split("\n").filter(Boolean);
    const [, ...rows] = lines; // skip header

    const imported = rows.map((line) => {
      const [title, amount, category, date, type] = line.split(",");
      return {
        id: Date.now().toString() + Math.random(),
        title,
        amount: parseFloat(amount),
        category,
        date,
        type,
      };
    });

    setTransactions((prev) => [...prev, ...imported]);
  };

  reader.readAsText(file);
};


  return (
    <div
      style={{
        backgroundImage: "url('/colorful-template-banner-and-background-with-blue-and-white-color-gradient-color-vector.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "1.5rem",
        position: "relative",
      }}
    >
      <audio autoPlay loop>
        <source src="/piano.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <audio ref={audioRef} src="/ElevenLabs_Text_to_Speech_audio.mp3" />

      <img
        src="/ef07afed-4688-4129-a231-af69c5c167c0-removebg-preview.png"
        alt="Music Button"
        onClick={handleImageClick}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          cursor: "pointer",
          borderRadius: "50%",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      />

      <h1 className="text-2xl font-bold text-black mb-4">
        Finance Tracker
      </h1>

      <div className="flex gap-6 text-lg font-medium text-black">
        <div>💰 Income: ${income.toFixed(2)}</div>
        <div>💸 Expenses: ${expenses.toFixed(2)}</div>
        <div>🧮 Balance: ${balance.toFixed(2)}</div>
      </div>

      <div className="flex gap-4 items-center mt-4">
        <select
          onChange={(e) => setFilterType(e.target.value)}
          value={filterType}
          className="border p-2"
        >
          <option value="All">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <select
          onChange={(e) => setFilterCategory(e.target.value)}
          value={filterCategory}
          className="border p-2"
        >
          <option value="All">All Categories</option>
          {[...new Set(transactions.map((t) => t.category))]
            .filter(Boolean)
            .map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 max-w-xl mt-6"
      >
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          name="amount"
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-2 col-span-2"
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-black py-2 px-4 col-span-2 rounded"
        >
          Add Transaction
        </button>
      </form>
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleExport}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Export CSV
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="py-2 px-4 border rounded bg-white text-black"
        />
      </div>

      <div className="mt-6 bg-white rounded shadow">
        <DataTable
          columns={columns({ deleteTransaction })}
          data={filteredTransactions}
        />
      </div>

      {expenseData.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-black">Spending Overview</h2>
          <div className="flex flex-wrap gap-10">
            {/* Pie Chart */}
            <PieChart width={400} height={300}>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
              
            {/* Line Chart */}
            <LineChart width={500} height={300} data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Income" stroke="#4ade80" />
              <Line type="monotone" dataKey="Expense" stroke="#f87171" />
            </LineChart>
          </div>
        </div>
      )}
    </div>
  );
}
