import React, { useState, useMemo } from 'react';
import { useFinance } from '../Context/FinanceContext';
import { Modal, Button } from 'react-bootstrap';
import { format } from 'date-fns';

const categories = [
  'Groceries', 'Salary', 'Rent', 'Entertainment', 'Utilities', 'Transportation',
  'Healthcare', 'Investment', 'Education', 'Dining Out', 'Shopping',
  'Insurance', 'Subscriptions', 'Travel', 'Other'
];

function TransactionHistory() {
  const { state, dispatch } = useFinance(); 

  // Filter state
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Sorting state
  const [sortColumn, setSortColumn] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Edit modal state
  const [editTransaction, setEditTransaction] = useState(null);
  const [form, setForm] = useState({
    type: '',
    amount: '',
    category: '',
    date: '',
    description: ''
  });

  // Filter transactions based on selected filters
  const filteredTransactions = useMemo(() => {
    let transactions = state.transactions;

    if (filterCategory) {
      transactions = transactions.filter(t => t.category === filterCategory);
    }

    if (filterStartDate) {
      transactions = transactions.filter(t => new Date(t.date) >= new Date(filterStartDate));
    }

    if (filterEndDate) {
      transactions = transactions.filter(t => new Date(t.date) <= new Date(filterEndDate));
    }

    return transactions;
  }, [state.transactions, filterCategory, filterStartDate, filterEndDate]);

  // Sort transactions by selected column and order
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortColumn === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortColumn === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortColumn === 'type') {
        return sortOrder === 'asc'
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
      return 0;
    });
  }, [filteredTransactions, sortColumn, sortOrder]);

  // Paginate sorted results
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Handle transaction deletion
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    const updatedTransactions = state.transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  // Load selected transaction into edit form
  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setForm({ ...transaction });
  };

  // Handle changes in the edit form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Save edited transaction
  const handleSave = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) {
      alert('Please fill all required fields');
      return;
    }

    const updated = { ...form, id: editTransaction.id, amount: parseFloat(form.amount) };

    dispatch({ type: 'EDIT_TRANSACTION', payload: updated });

    const updatedTransactions = state.transactions.map(t =>
      t.id === editTransaction.id ? updated : t
    );
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    // Reset modal state
    setEditTransaction(null);
    setForm({ type: '', amount: '', category: '', date: '', description: '' });
  };

  // Handle table sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  // Handle page change
  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Transaction History</h2>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label>Category</label>
          <select className="form-control" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label>Start Date</label>
          <input
            className="form-control"
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label>End Date</label>
          <input
            className="form-control"
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-responsive">
        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>Date</th>
              <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>Category</th>
              <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>Amount</th>
              <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>Type</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{format(new Date(transaction.date), 'yyyy-MM-dd')}</td>
                <td>{transaction.category}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.type}</td>
                <td>{transaction.description || 'N/A'}</td>
                <td>
                  <button className="btn btn-info btn-sm me-2" onClick={() => handleEdit(transaction)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(transaction.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center">
        <Button
          variant="secondary"
          onClick={() => handlePagination(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage}</span>
        <Button
          variant="secondary"
          onClick={() => handlePagination(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= sortedTransactions.length}
        >
          Next
        </Button>
      </div>

      {/* Edit Transaction Modal */}
      <Modal show={!!editTransaction} onHide={() => setEditTransaction(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label>Type</label>
              <select className="form-control" name="type" value={form.type} onChange={handleFormChange}>
                {['Income', 'Expense', 'Investment', 'Savings'].map(type => (
                  <option key={type} value={type}>{type}</option>
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
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Category</label>
              <select
                className="form-control"
                name="category"
                value={form.category}
                onChange={handleFormChange}
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
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Description</label>
              <textarea
                className="form-control"
                name="description"
                value={form.description}
                onChange={handleFormChange}
              />
            </div>
            <Button variant="primary" type="submit">Save</Button>{' '}
            <Button variant="secondary" onClick={() => setEditTransaction(null)}>Cancel</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TransactionHistory;
