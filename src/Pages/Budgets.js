import React, { useState } from 'react';
import { useFinance } from '../Context/FinanceContext'; 
import BudgetProgress from '../Components/BudgetProgress';


const categories = [
  'Groceries', 'Entertainment', 'Rent', 'Utilities', 'Transportation',
  'Healthcare', 'Investment', 'Education', 'Dining Out',
  'Shopping', 'Insurance', 'Subscriptions', 'Travel', 'Other'
];

function Budgets() {
  const { state, dispatch } = useFinance(); // Get current state and dispatch from context
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  // Set budget for a selected category
  const handleSetBudget = () => {
    if (!selectedCategory || !budgetAmount) {
      alert('Please select category and enter budget');
      return;
    }

    // Dispatch SET_BUDGET action
    dispatch({
      type: 'SET_BUDGET',
      payload: {
        category: selectedCategory,
        amount: parseFloat(budgetAmount),
      },
    });

    // Reset form inputs
    setSelectedCategory('');
    setBudgetAmount('');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Set Monthly Budgets</h2>

      <div className="row g-3 mb-4 align-items-end">
        <div className="col-sm-12 col-md-4">
          <label className="form-label">Category</label>
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="col-sm-12 col-md-4">
          <label className="form-label">Budget Amount</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter Budget Amount"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
          />
        </div>

        <div className="col-sm-12 col-md-4">
          <button className="btn btn-primary w-auto float-start" onClick={handleSetBudget}>
            Set Budget
          </button>
        </div>
      </div>

      <h4 className="mb-3">Budget Overview</h4>
      {Object.keys(state.budgets).length === 0 ? (
        <div className="alert alert-info">No budgets set yet.</div>
      ) : (
        <BudgetProgress />
      )}
    </div>
  );
}

export default Budgets;
