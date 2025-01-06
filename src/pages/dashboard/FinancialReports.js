import React, { useState } from 'react';
import '../../styles/dashboard-pages.css';
import '../../components/dashboard/DashboardFeatures.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from '../../utils/axiosConfig';

const FinancialReports = () => {
  const [reportType, setReportType] = useState('monthly');
  const [reportPeriod, setReportPeriod] = useState('current');
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState({
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
  });

  const generateReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reports/${reportType}`, {
        params: { period: reportPeriod }
      });
      
      setReports(response.data);
      
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Financial Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Report Type: ${reportType.toUpperCase()}`, 20, 30);
    doc.text(`Period: ${reportPeriod}`, 20, 40);

    doc.text('Summary', 20, 60);
    doc.autoTable({
      startY: 65,
      head: [['Category', 'Amount']],
      body: [
        ['Total Income', `$${reports.income.toFixed(2)}`],
        ['Total Expenses', `$${reports.expenses.toFixed(2)}`],
        ['Net Savings', `$${reports.savings.toFixed(2)}`]
      ],
    });

    doc.text('Category Breakdown', 20, doc.lastAutoTable.finalY + 20);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Category', 'Amount', 'Percentage']],
      body: reports.categories.map(cat => [
        cat.name,
        `$${cat.amount.toFixed(2)}`,
        `${cat.percentage}%`
      ]),
    });

    doc.save(`financial-report-${reportType}-${reportPeriod}.pdf`);
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Financial Reports</h1>
          <p className="text-muted">Analyze your financial performance</p>
        </div>
        <div className="header-actions">
          <button 
            className="action-button" 
            onClick={generateReport}
            disabled={loading}
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sync'}`}></i>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          <button 
            className="action-button" 
            onClick={exportPDF}
            disabled={loading}
          >
            <i className="fas fa-download"></i> Export PDF
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="financial-reports">
          <div className="section-header">
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
      </div>
    </div>
  );
};

export default FinancialReports; 