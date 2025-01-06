import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardCharts = () => {
  const { darkMode } = useTheme();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          color: darkMode ? '#e5e7eb' : '#1f2937',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Expense Distribution',
        color: darkMode ? '#f3f4f6' : '#1f2937',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#64748b'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#64748b'
        }
      }
    }
  };

  // Update colors for dark mode
  const colors = darkMode ? {
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(99, 102, 241, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(139, 92, 246, 0.8)',
    ],
    borderColor: [
      'rgba(59, 130, 246, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(245, 158, 11, 1)',
      'rgba(99, 102, 241, 1)',
      'rgba(236, 72, 153, 1)',
      'rgba(139, 92, 246, 1)',
    ]
  } : {
    backgroundColor: [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ]
  };

  // Sample data for expense categories
  const expenseData = {
    labels: ['Rent', 'Food', 'Entertainment', 'Transport', 'Utilities', 'Others'],
    datasets: [
      {
        data: [1200, 800, 500, 300, 400, 200],
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderWidth: 1,
      },
    ],
  };

  // Sample data for monthly comparison
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Expenses',
        data: [3200, 3500, 3300, 3700, 3400, 3200],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Budget',
        data: [3500, 3500, 3500, 3500, 3500, 3500],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Monthly Expenses vs Budget',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="dashboard-charts">
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-container">
            <Doughnut data={expenseData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-container">
            <Bar data={monthlyData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts; 