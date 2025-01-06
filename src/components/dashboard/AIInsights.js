import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './AIInsights.css';
import { Doughnut, Line } from 'react-chartjs-2';
import { chartOptions, trendChartOptions } from '../../utils/chartOptions';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AIInsights = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async (refresh = false) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`/api/ai-insights?refresh=${refresh}`);
            console.log('AI Insights response:', response.data);
            setInsights(response.data);
        } catch (error) {
            console.error('Error fetching AI insights:', error);
            setError(error.response?.data?.error || 'Failed to load AI insights. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getHealthScoreColor = (score) => {
        if (score >= 80) return '#10B981';
        if (score >= 60) return '#F59E0B';
        return '#EF4444';
    };

    const generateChartData = (categoryData) => {
        if (!categoryData) return {
            labels: [],
            datasets: [{ data: [] }]
        };

        return {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    '#4299E1', '#48BB78', '#F6AD55', '#F56565',
                    '#9F7AEA', '#ED64A6', '#4FD1C5', '#667EEA'
                ]
            }]
        };
    };

    const generateTrendData = (trendData) => {
        if (!trendData) return {
            labels: [],
            datasets: [{ data: [] }]
        };

        return {
            labels: Object.keys(trendData),
            datasets: [{
                label: 'Monthly Spending',
                data: Object.values(trendData),
                borderColor: '#4299E1',
                tension: 0.4
            }]
        };
    };

    if (loading) return (
        <div className="ai-insights-loading">
            <div className="loading-spinner"></div>
            <p>Analyzing your financial data...</p>
        </div>
    );

    if (error) return (
        <div className="ai-insights-error">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={fetchInsights} className="retry-button">
                Retry Analysis
            </button>
        </div>
    );

    return (
        <div className="ai-insights-container">
            <div className="insights-header">
                <div className="header-left">
                    <h2>AI Financial Insights</h2>
                    <p className="last-updated">
                        Last updated: {new Date(insights?.lastUpdated).toLocaleString()}
                    </p>
                </div>
                <button onClick={() => fetchInsights(true)} className="refresh-insights">
                    <i className="fas fa-sync"></i> Refresh Analysis
                </button>
            </div>

            <div className="insights-tabs">
                <button 
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <i className="fas fa-chart-pie"></i> Overview
                </button>
                <button 
                    className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('recommendations')}
                >
                    <i className="fas fa-lightbulb"></i> Recommendations
                </button>
                <button 
                    className={`tab ${activeTab === 'goals' ? 'active' : ''}`}
                    onClick={() => setActiveTab('goals')}
                >
                    <i className="fas fa-bullseye"></i> Goals
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="insights-grid">
                    <div className="metrics-row">
                        <div className="metric-card">
                            <h3>Total Income</h3>
                            <div className="metric-value positive">
                                ${Number(insights?.totalIncome || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </div>
                        </div>
                        <div className="metric-card">
                            <h3>Total Expenses</h3>
                            <div className="metric-value negative">
                                ${Number(insights?.totalExpenses || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </div>
                        </div>
                        <div className="metric-card">
                            <h3>Net Savings</h3>
                            <div className={`metric-value ${insights?.netSavings >= 0 ? 'positive' : 'negative'}`}>
                                ${Number(insights?.netSavings || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="charts-row">
                        <div className="chart-card">
                            <h3>Expense Distribution</h3>
                            <div className="chart-container">
                                <Doughnut 
                                    data={generateChartData(insights?.categoryDistribution)}
                                    options={chartOptions}
                                />
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Monthly Trends</h3>
                            <div className="chart-container">
                                <Line 
                                    data={generateTrendData(insights?.monthlyTrends)}
                                    options={trendChartOptions}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="insights-details-row">
                        <div className="insight-card">
                            <h3><i className="fas fa-star"></i> Financial Strengths</h3>
                            <div className="insight-content">
                                <p>{insights?.strengths}</p>
                            </div>
                        </div>

                        <div className="insight-card">
                            <h3><i className="fas fa-chart-line"></i> Quick Wins</h3>
                            <div className="insight-content">
                                <p>{insights?.quickWins}</p>
                            </div>
                        </div>

                        <div className="insight-card">
                            <h3><i className="fas fa-lightbulb"></i> Interesting Facts</h3>
                            <div className="insight-content">
                                <p>{insights?.interestingFacts}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'recommendations' && (
                <div className="insights-grid">
                    <div className="insight-card">
                        <h3><i className="fas fa-bullseye"></i> Areas for Improvement</h3>
                        <div className="insight-content">
                            <p>{insights?.improvements}</p>
                        </div>
                    </div>

                    <div className="insight-card">
                        <h3><i className="fas fa-road"></i> Long-term Strategy</h3>
                        <div className="insight-content">
                            <p>{insights?.longTermRecommendations}</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'goals' && (
                <div className="insights-grid">
                    <div className="insight-card">
                        <h3>SMART Financial Goals</h3>
                        <div className="insight-content">
                            <i className="fas fa-flag icon"></i>
                            <p>{insights?.smartGoals}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIInsights; 