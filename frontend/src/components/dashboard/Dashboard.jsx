import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Dashboard.css';

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [genderData, setGenderData] = useState({
    male: 0,
    female: 0,
  });

  const [fraudData, setFraudData] = useState({
    noFraud: 0,
    fraud: 0,
  });

  const [merchantData, setMerchantData] = useState({});
  const [categoryData, setCategoryData] = useState({});

  const [meanAmount, setMeanAmount] = useState(0);
  const [medianAmount, setMedianAmount] = useState(0);

  // Utility function to calculate the median
  const calculateMedian = (arr) => {
    const sorted = arr.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  // Fetch data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1000/api/transactions');
        console.log('Fetched Data:', response.data);

        // Segregate data by gender
        const maleTransactions = response.data.filter(item => item.gender === "'M'");
        const femaleTransactions = response.data.filter(item => item.gender === "'F'");

        // Segregate data by fraud status
        const fraudTransactions = response.data.filter(item => item.fraud === 1);
        const noFraudTransactions = response.data.filter(item => item.fraud === 0);

        // Aggregate data by merchant
        const merchantAggregation = response.data.reduce((acc, item) => {
          acc[item.merchant] = (acc[item.merchant] || 0) + item.amount;
          return acc;
        }, {});

        // Aggregate data by category
        const categoryAggregation = response.data.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + item.amount;
          return acc;
        }, {});

        // Calculate mean and median for all transactions
        const amounts = response.data.map(item => item.amount);
        const mean = amounts.reduce((acc, curr) => acc + curr, 0) / amounts.length;
        const median = calculateMedian(amounts);

        // Set gender and fraud data for the charts
        setGenderData({
          male: maleTransactions.length,
          female: femaleTransactions.length,
        });

        setFraudData({
          noFraud: noFraudTransactions.length,
          fraud: fraudTransactions.length,
        });

        setMerchantData(merchantAggregation);
        setCategoryData(categoryAggregation);

        setMeanAmount(mean);
        setMedianAmount(median);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Pie chart data for gender distribution
  const genderPieChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Gender Distribution',
        data: [genderData.male, genderData.female],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  // Pie chart data for fraud status
  const fraudPieChartData = {
    labels: ['No Fraud', 'Fraud'],
    datasets: [
      {
        label: 'Fraud Status',
        data: [fraudData.noFraud, fraudData.fraud],
        backgroundColor: ['#4BC0C0', '#FFCE56'],
        hoverBackgroundColor: ['#4BC0C0', '#FFCE56'],
      },
    ],
  };

  // Bar chart data for merchant distribution
  const merchantBarChartData = {
    labels: Object.keys(merchantData),
    datasets: [
      {
        label: 'Total Spent by Merchant',
        data: Object.values(merchantData),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Bar chart data for category distribution
  const categoryBarChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Total Spent by Category',
        data: Object.values(categoryData),
        backgroundColor: '#FF6384',
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* Pie Chart for Gender Distribution */}
      <div className="chart-container">
        <h3 className="chart-title">Gender Distribution</h3>
        <div className="chart">
          <Pie data={genderPieChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Pie Chart for Fraud Status */}
      <div className="chart-container">
        <h3 className="chart-title">Fraud Status</h3>
        <div className="chart">
          <Pie data={fraudPieChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Bar Chart for Total Spent by Merchant */}
      <div className="chart-container">
        <h3 className="chart-title">Total Spent by Merchant</h3>
        <div className="chart">
          <Bar data={merchantBarChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Bar Chart for Total Spent by Category */}
      <div className="chart-container">
        <h3 className="chart-title">Total Spent by Category</h3>
        <div className="chart">
          <Bar data={categoryBarChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Display Mean and Median */}
      <div className="stats-container">
        <h3 className="stats-title">Transaction Statistics</h3>
        <p><strong>Mean Transaction Amount:</strong> ${meanAmount.toFixed(2)}</p>
        <p><strong>Median Transaction Amount:</strong> ${medianAmount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Dashboard;
