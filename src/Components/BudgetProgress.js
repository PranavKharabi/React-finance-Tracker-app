import React from 'react';
import { useFinance } from '../Context/FinanceContext'; 


function BudgetProgress() {
  const { state } = useFinance();
  const { budgets, transactions } = state;

  // Get the preferred currency symbol from localStorage (defaults to ₹)
  const currency = localStorage.getItem('currency') || '₹';

  // Helper function: Calculate total spending for a specific category
  const getCategorySpending = (category) =>
    transactions
      .filter((t) => t.category === category && t.type === 'Expense') // Filter only expenses for the given category
      .reduce((sum, t) => sum + t.amount, 0); // Sum up the amounts

  return (
    <div>
      {/* Iterate through each budget category and amount */}
      {Object.entries(budgets).map(([category, budgetAmount]) => {
        const spent = getCategorySpending(category); // Get total spent in the current category
        const percentage = Math.min((spent / budgetAmount) * 100, 100).toFixed(1); // Calculate percentage used (max 100%)
        const isOverBudget = spent > budgetAmount; // Check if spending exceeded budget

        return (
          <div key={category} className="mb-4">
            <h5>{category}</h5>

            {/* Progress bar for budget tracking */}
            <div className="progress mb-1" style={{ height: '25px' }}>
              <div
                className={`progress-bar ${isOverBudget ? 'bg-danger' : 'bg-success'}`} // Red if over budget, green otherwise
                role="progressbar"
                style={{ width: `${percentage}%` }} // Width proportional to percentage spent
              >
                {spent} / {budgetAmount} {/* Show spent vs budget */}
              </div>
            </div>

            {/* Show overspending alert if user exceeded the budget */}
            {isOverBudget && (
              <div className="alert alert-danger p-2">
                Overspending! You have exceeded your {currency}{budgetAmount} budget in {category}.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BudgetProgress; 
