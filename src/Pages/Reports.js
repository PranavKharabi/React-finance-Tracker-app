import React, { useMemo } from 'react';
import { useFinance } from '../Context/FinanceContext';
import { Container, Row, Col, Button, Card, Table } from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { getCurrencySymbol } from '../utils/getCurrencySymbol';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

function Reports() {
  const { state } = useFinance();
  const currency = getCurrencySymbol();
  const currentYear = new Date().getFullYear();

  // Filter transactions once
  const filteredTransactions = useMemo(() => {
    return state.transactions.filter(
      (t) => new Date(t.date).getFullYear() === currentYear
    );
  }, [state.transactions, currentYear]);

  // Calculate summaries
  const { totalIncome, totalExpenses, netSavings, categoryTotals, monthlyIncome, monthlyExpenses } = useMemo(() => {
    const totals = {
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0,
      categoryTotals: {},
      monthlyIncome: Array(12).fill(0),
      monthlyExpenses: Array(12).fill(0),
    };

    filteredTransactions.forEach((t) => {
      const month = new Date(t.date).getMonth();

      if (t.type === 'Income') {
        totals.totalIncome += t.amount;
        totals.monthlyIncome[month] += t.amount;
      } else if (t.type === 'Expense') {
        totals.totalExpenses += t.amount;
        totals.monthlyExpenses[month] += t.amount;
        totals.categoryTotals[t.category] = (totals.categoryTotals[t.category] || 0) + t.amount;
      }
    });

    totals.netSavings = totals.totalIncome - totals.totalExpenses;
    return totals;
  }, [filteredTransactions]);

  // Chart Data
  const pieData = useMemo(() => ({
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: [
        '#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0',
        '#9966ff', '#c9cbcf', '#f67019', '#00a950',
        '#b7005c', '#ffaa00', '#00b7ff'
      ],
    }],
  }), [categoryTotals]);

  const barData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Expenses',
        backgroundColor: '#dc3545',
        data: monthlyExpenses,
      },
      {
        label: 'Income',
        backgroundColor: '#28a745',
        data: monthlyIncome,
      },
    ],
  }), [monthlyIncome, monthlyExpenses]);

  // CSV export
  const exportToCSV = () => {
    const rows = [];

    rows.push(['--- Financial Summary ---']);
    rows.push(['Total Income', totalIncome]);
    rows.push(['Total Expenses', totalExpenses]);
    rows.push(['Net Savings', netSavings]);
    rows.push([]);

    rows.push(['--- Category-wise Expenses ---']);
    rows.push(['Category', 'Amount']);
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      rows.push([cat, amt]);
    });
    rows.push([]);

    rows.push(['--- Transactions ---']);
    rows.push(['Date', 'Type', 'Amount', 'Category', 'Description']);
    filteredTransactions.forEach(t => {
      rows.push([t.date, t.type, t.amount, t.category, t.description || '']);
    });

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'finance_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col><h2>Reports</h2></Col>
        <Col className="text-end">
          <Button variant="outline-success" onClick={exportToCSV}>
            Export CSV
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="mb-3 p-3">
            <h5>Total Income</h5>
            <p className="text-success fw-bold">{currency}{totalIncome.toFixed(2)}</p>
            <h5>Total Expenses</h5>
            <p className="text-danger fw-bold">{currency}{totalExpenses.toFixed(2)}</p>
            <h5>Net Savings</h5>
            <p className={`fw-bold ${netSavings >= 0 ? 'text-success' : 'text-danger'}`}>
              {currency}{netSavings.toFixed(2)}
            </p>
          </Card>
          <Card className="p-3">
            <h5 className="text-center">Expenses by Category</h5>
            <div style={{ height: '300px' }}>
              <Pie data={pieData} />
            </div>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="p-3 mb-3">
            <h5 className="text-center">Monthly Financial Summary</h5>
            <div style={{ height: '400px' }}>
              <Bar data={barData} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="p-3">
            <h5 className="mb-3">Monthly Summary Table</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Income</th>
                  <th>Expenses</th>
                  <th>Savings</th>
                </tr>
              </thead>
              <tbody>
                {barData.labels.map((month, index) => (
                  <tr key={month}>
                    <td>{month}</td>
                    <td>{currency}{monthlyIncome[index].toFixed(2)}</td>
                    <td>{currency}{monthlyExpenses[index].toFixed(2)}</td>
                    <td className={monthlyIncome[index] - monthlyExpenses[index] >= 0 ? 'text-success' : 'text-danger'}>
                      {currency}{(monthlyIncome[index] - monthlyExpenses[index]).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Reports;
