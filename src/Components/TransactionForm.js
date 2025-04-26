import React, { useState } from 'react';

const categories = [
  'Groceries', 'Salary', 'Rent', 'Entertainment', 'Utilities', 'Transportation',
  'Healthcare', 'Investment', 'Education', 'Dining Out', 'Shopping',
  'Insurance', 'Subscriptions', 'Travel', 'Other'
];

const types = ['Income', 'Expense', 'Investment', 'Savings'];

function TransactionForm({ onSubmit }) {
  const [form, setForm] = useState({
    type: 'Expense',
    amount: '',
    category: '',
    date: '',
    description: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = e => {
    e.preventDefault(); 
      if (!form.amount || !form.category || !form.date) {
      alert('Please fill required fields');
      return;
    }

    // Submit the form data (convert amount to number)
    onSubmit({ ...form, amount: parseFloat(form.amount) });

    // Reset the form after submission
    setForm({ type: 'Expense', amount: '', category: '', date: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-3">
        <label>Type</label>
        <select
          className="form-control"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
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
          required
        />
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
            <option key={cat}>{cat}</option>
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
        ></textarea>
      </div>

      <button className="btn btn-primary">Add</button>
    </form>
  );
}

export default TransactionForm; 
