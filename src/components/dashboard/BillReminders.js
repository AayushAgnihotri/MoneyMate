import React from 'react';

const BillReminders = () => {
  const upcomingBills = [
    {
      id: 1,
      title: 'Electricity Bill',
      amount: 150.00,
      dueDate: '2024-03-25',
      status: 'pending',
      category: 'Utilities'
    },
    {
      id: 2,
      title: 'Internet Bill',
      amount: 79.99,
      dueDate: '2024-03-28',
      status: 'pending',
      category: 'Utilities'
    },
    {
      id: 3,
      title: 'Credit Card Payment',
      amount: 500.00,
      dueDate: '2024-03-30',
      status: 'upcoming',
      category: 'Credit Card'
    }
  ];

  return (
    <div className="bill-reminders">
      <div className="section-header">
        <h2>Upcoming Bills</h2>
        <button className="btn btn-primary btn-sm">Add New Bill</button>
      </div>
      <div className="bills-list">
        {upcomingBills.map(bill => (
          <div key={bill.id} className="bill-card">
            <div className="bill-info">
              <div className="bill-title">
                <h4>{bill.title}</h4>
                <span className={`status-badge ${bill.status}`}>
                  {bill.status}
                </span>
              </div>
              <p className="bill-category">{bill.category}</p>
              <div className="bill-details">
                <span className="amount">${bill.amount}</span>
                <span className="due-date">Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
            <button className="btn btn-outline-primary btn-sm">Pay Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillReminders; 