export function getCurrencySymbol() {
    return localStorage.getItem('currency') || '₹';
  }
  