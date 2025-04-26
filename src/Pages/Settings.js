import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useFinance } from '../Context/FinanceContext'; 

const currencyOptions = ['₹', '$', '€', '£', '¥', '₩', '₽', '฿', '₺', '₴'];

function Settings() {
  // Local state to manage settings form inputs
  const [currency, setCurrency] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(false);

  const { dispatch } = useFinance(); // Access dispatch method from global finance context

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    const savedName = localStorage.getItem('name');
    const savedEmail = localStorage.getItem('email');
    const savedNotifications = localStorage.getItem('notifications');

    if (savedCurrency) setCurrency(savedCurrency);
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedNotifications !== null) {
      setNotifications(savedNotifications === 'true'); // Convert string to boolean
    }
  }, []);

  // Save user settings to localStorage
  const saveSettings = () => {
    if (!currency || !name.trim() || !email.trim()) {
      alert('Please fill in all required fields: Name, Email, and Currency.');
      return;
    }

    // Store values in localStorage
    localStorage.setItem('currency', currency);
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('notifications', notifications.toString());

    alert('Settings saved!');
  };

  // Reset settings and data in both local and global state
  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings and data?')) {
      // Remove saved user data from localStorage
      localStorage.removeItem('currency');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('notifications');
      localStorage.removeItem('transactions'); 
      localStorage.removeItem('budgets'); 

      // Reset local state to defaults
      setCurrency('');
      setName('');
      setEmail('');
      setNotifications(false);

      // Reset global state using context dispatch
      dispatch({ type: 'RESET_ALL' });

      alert('All settings and financial data have been cleared!');
    }
  };

  // Render the Settings form
  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col sm={12} md={8} lg={6}>
          <h2 className="mb-4 text-center">Settings</h2>
          <Card className="p-4 shadow">
            <Form>
              {/* Currency selection dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Default Currency <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  required
                >
                  <option value="">-- Select Currency --</option>
                  {currencyOptions.map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Name input */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Email input */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Save and Reset buttons */}
              <div className="d-flex justify-content-between flex-column flex-sm-row">
                <Button variant="primary" className="mb-2 mb-sm-0" onClick={saveSettings}>
                  Save
                </Button>
                <Button variant="outline-danger" onClick={resetSettings}>
                  Reset
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Settings;
