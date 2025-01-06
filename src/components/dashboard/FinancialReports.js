import React, { useState } from 'react';

const FinancialReports = () => {
  const [reportType, setReportType] = useState('monthly');
  const [reportPeriod, setReportPeriod] = useState('current');

  const reports = {
    income: 4500.00,
    expenses: 3200.00,
    savings: 1300.00,
    categories: [
      { name: 'Housing', amount: 1200.00, percentage: 37.5 },
      { name: 'Food', amount: 800.00, percentage: 25 },
      { name: 'Transportation', amount: 400.00, percentage: 12.5 },
      { name: 'Utilities', amount: 300.00, percentage: 9.4 },
      { name: 'Entertainment', amount: 500.00, percentage: 15.6 }
    ]
  };

  return (
    <div className="financial-reports">
      <div className="section-header">
        <h2>Financial Reports</h2>
        <div className="report-controls">
          <select 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
            className="form-select"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <select 
            value={reportPeriod} 
            onChange={(e) => setReportPeriod(e.target.value)}
            className="form-select"
          >
            <option value="current">Current Period</option>
            <option value="previous">Previous Period</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="btn btn-primary btn-sm">Generate Report</button>
        </div>
      </div>

      <div className="reports-grid">
        <div className="summary-card">
          <h3>Summary</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <label>Total Income</label>
              <span className="amount positive">${reports.income}</span>
            </div>
            <div className="stat-item">
              <label>Total Expenses</label>
              <span className="amount negative">${reports.expenses}</span>
            </div>
            <div className="stat-item">
              <label>Net Savings</label>
              <span className="amount">${reports.savings}</span>
            </div>
          </div>
        </div>

        <div className="category-breakdown">
          <h3>Expense Breakdown</h3>
          <div className="category-list">
            {reports.categories.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category.name}</span>
                  <span className="category-amount">${category.amount}</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <span className="percentage">{category.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports; 