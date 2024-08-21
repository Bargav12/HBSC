import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './Calculation.css';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Calculation = () => {
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
    <div className="calculation-container">
      <h2 className="calculation-title">Transaction Analysis</h2>

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

      {/* Display Overall Mean and Median */}
      <div className="stats-container">
        <h3 className="stats-title">Overall Transaction Statistics</h3>
        <p><strong>Mean Transaction Amount:</strong> ${meanAmount.toFixed(2)}</p>
        <p><strong>Median Transaction Amount:</strong> ${medianAmount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Calculation;
