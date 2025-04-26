import React, { useState } from 'react';
import { useFinance } from '../Context/FinanceContext';
import { v4 as uuidv4 } from 'uuid'; // Unique ID generator for transactions

const categories = [
  'Groceries', 'Salary', 'Rent', 'Entertainment', 'Utilities', 'Transportation',
  'Healthcare', 'Investment', 'Education', 'Dining Out', 'Shopping',
  'Insurance', 'Subscriptions', 'Travel', 'Other'
];

const types = ['Income', 'Expense', 'Savings'];

function AddTransaction() {
  const { dispatch } = useFinance(); // Access dispatch from context to update global state

  // Local state to manage form input
  const [form, setForm] = useState({
    type: 'Expense',
    amount: '',
    category: '',
    date: '',
    description: ''
  });

  // Handle input changes and update form state
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!form.amount || !form.category || !form.date) {
      alert('Please fill required fields');
      return;
    }

    // Create new transaction object with unique ID and parsed amount
    const newTransaction = {
      ...form,
      id: uuidv4(),
      amount: parseFloat(form.amount)
    };

    // Update context state
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });

    // Update localStorage for persistence
    const stored = JSON.parse(localStorage.getItem('transactions')) || [];
    localStorage.setItem('transactions', JSON.stringify([...stored, newTransaction]));

    // Reset form after submission
    setForm({ type: 'Expense', amount: '', category: '', date: '', description: '' });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h1 className="mb-4">Add Transaction</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Type</label>
              <select
                className="form-control"
                name="type"
                value={form.type}
                onChange={handleChange}>
                {types.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Amount</label>
              <input
                className="form-control"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                required />
            </div>

            <div className="mb-3">
              <label>Category</label>
              <select
                className="form-control"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >

                <option value="">-- Select Category --</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Date</label>
              <input
                className="form-control"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Description</label>
              <textarea
                className="form-control"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <button className="btn btn-primary px-4 mb-4">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTransaction;
