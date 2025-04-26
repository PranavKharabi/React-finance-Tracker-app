import React, { createContext, useReducer, useContext } from 'react';

const FinanceContext = createContext();

// Initial state, loading from localStorage if available
const initialState = {
  transactions: JSON.parse(localStorage.getItem('transactions')) || [],
  budgets: JSON.parse(localStorage.getItem('budgets')) || {},
};

// Reducer function to manage state updates
function reducer(state, action) {
  let updatedState;

  switch (action.type) {
    case 'ADD_TRANSACTION':
      updatedState = {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
      break;

    case 'DELETE_TRANSACTION':
      updatedState = {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
      break;

    case 'SET_BUDGET':
      updatedState = {
        ...state,
        budgets: {
          ...state.budgets,
          [action.payload.category]: action.payload.amount,
        },
      };
      break;

    case 'UPDATE_TRANSACTION':
      updatedState = {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.updatedData } : t
        ),
      };
      break;

    case 'RESET_BUDGET':
      updatedState = {
        ...state,
        budgets: {
          ...state.budgets,
          [action.payload.category]: 0,
        },
      };
      break;

    case 'EDIT_TRANSACTION':
      updatedState = {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
      break;

    case 'RESET_ALL':
      updatedState = {
        transactions: [],
        budgets: {},
      };
      break;

    default:
      return state;
  }

  // Store the updated state in localStorage to persist between page reloads
  localStorage.setItem('transactions', JSON.stringify(updatedState.transactions));
  localStorage.setItem('budgets', JSON.stringify(updatedState.budgets));

  return updatedState;
}

// Context provider to wrap the app and provide access to state and dispatch
export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook to easily access Finance context in components
export const useFinance = () => useContext(FinanceContext);
