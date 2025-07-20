# Finance Tracker

A clean and responsive personal finance tracker built with **React**. This application allows users to manage and visualize their income and expenses with filtering, data visualization, and persistent local storage.

## Features

- ✅ Add, view, and delete income and expense transactions
- 🔍 Filter by transaction type (Income/Expense) and category
- 📊 Automatically calculates total income, expenses, and remaining balance
- 📈 Visualizes spending by category using a pie chart
- 💾 Data is saved locally using browser `localStorage`
- 🎨 Clean and responsive UI for desktop

## How It Works

### State Management

React's `useState` and `useEffect` hooks manage:

- **Transactions**: a list of income and expense items
- **Form Inputs**: values for title, amount, date, category, and type
- **Filters**: type and category filters for displaying relevant records

### Adding a Transaction

When a user submits the form:

- A new transaction object is created
- It's added to the `transactions` state array
- State is updated, triggering the UI to refresh

### Deleting a Transaction

Each row in the data table includes a delete button:

- Clicking it removes the transaction by its unique `id`
- The `transactions` array is updated accordingly

### Data Persistence with localStorage

- On initial load, the app reads from `localStorage` to restore previous data
- On every transaction update, the new state is saved to `localStorage`

```js
useEffect(() => {
  const stored = localStorage.getItem("transactions");
  if (stored) setTransactions(JSON.parse(stored));
}, []);

useEffect(() => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}, [transactions]);
