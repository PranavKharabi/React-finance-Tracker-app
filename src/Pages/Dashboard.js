import React from 'react';
import { useFinance } from '../Context/FinanceContext';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
// Register necessary Chart.js components
ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement);

function Dashboard() {
  const { state } = useFinance(); 
  const currency = localStorage.getItem('currency') || '₹';
  const now = new Date();

  const transactions = state.transactions;

  // Filter transactions to include only current year
  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === now.getFullYear();
  });

  // Calculate totals
  const income = filteredTransactions
    .filter(t => t.type === 'Income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = filteredTransactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const savings = filteredTransactions
    .filter(t => t.type === 'Savings')
    .reduce((acc, t) => acc + t.amount, 0);

  const remaining = income - expenses;

  // Group expenses by category
  const expenseCategories = {};
  filteredTransactions.forEach(t => {
    if (t.type === 'Expense') {
      expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
    }
  });

  // Get top 3 expense categories
  const topCategories = Object.entries(expenseCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Get single largest expense category
  const biggestExpense = Object.entries(expenseCategories)
    .sort((a, b) => b[1] - a[1])[0];

  // Generate labels for months
  const months = [...Array(12)].map((_, i) =>
    new Date(now.getFullYear(), i).toLocaleString('default', { month: 'short' })
  );

  // Monthly Expenses
  const monthlyExpenses = months.map(month =>
    transactions
      .filter(t =>
        new Date(t.date).toLocaleString('default', { month: 'short' }) === month &&
        new Date(t.date).getFullYear() === now.getFullYear() &&
        t.type === 'Expense'
      )
      .reduce((acc, t) => acc + t.amount, 0)
  );

  // Monthly Income
  const monthlyIncome = months.map(month =>
    transactions
      .filter(t =>
        new Date(t.date).toLocaleString('default', { month: 'short' }) === month &&
        new Date(t.date).getFullYear() === now.getFullYear() &&
        t.type === 'Income'
      )
      .reduce((acc, t) => acc + t.amount, 0)
  );

  // Chart.js line chart config
  const lineData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyExpenses,
        fill: false,
        borderColor: '#ff6384',
        tension: 0.3,
      },
      {
        label: 'Monthly Income',
        data: monthlyIncome,
        fill: false,
        borderColor: '#36a2eb',
        tension: 0.3,
      },
    ],
  };

  // Chart.js pie chart config
  const pieData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(expenseCategories),
        backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff', '#c9cbcf'],
      },
    ],
  };

  return (
    <div>
      <h2 className="text-center mb-4">Dashboard</h2>

      {/* Overspending warning */}
      {expenses > income && (
        <div className="alert alert-danger mt-3">
          ⚠️ You are overspending! Your expenses ({currency}{expenses}) exceed your income ({currency}{income}).
        </div>
      )}

      {/* Summary Cards */}
      <div className="row my-4">
        <div className="col-12 col-sm-6 col-md-3">
          <div className="alert alert-success">Total Income: {currency}{income}</div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="alert alert-danger">Total Expenses: {currency}{expenses}</div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="alert alert-primary">Remaining: {currency}{remaining}</div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="alert alert-info">
            Savings: {currency}{savings > 0 ? savings : 0}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-12 col-md-8 mb-4 mb-md-0">
          <div style={{ height: '350px' }}>
            <Line data={lineData} />
          </div>
        </div>
        <div className="col-12 col-md-4">
          <Pie data={pieData} />
        </div>
      </div>

      {/* Top categories and biggest expense */}
      <div className="mt-4">
        <h5>Top Expense Categories</h5>
        <ul>
          {topCategories.map(([cat, amt], index) => (
            <li key={index}>{cat}: {currency}{amt}</li>
          ))}
        </ul>

        {biggestExpense && (
          <div className="mt-3">
            <strong>Biggest Expense of the Year:</strong> {biggestExpense[0]} ({currency}{biggestExpense[1]})
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
