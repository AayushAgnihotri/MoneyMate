import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './BudgetChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetChart = ({ budgets, expenses, currency }) => {
  const categories = Object.keys(budgets);
  
  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Budget',
        data: categories.map(category => budgets[category]),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(168, 85, 247, 0.5)',
          'rgba(14, 165, 233, 0.5)',
          'rgba(236, 72, 153, 0.5)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(236, 72, 153, 1)'
        ],
        borderWidth: 1
      },
      {
        label: 'Spent',
        data: categories.map(category => expenses[category] || 0),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(236, 72, 153, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed;
            return `${label}: ${currency.symbol}${value.toFixed(2)}`;
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <div className="budget-chart">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default BudgetChart; 