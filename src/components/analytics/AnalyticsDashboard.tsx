import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { api_Url } from '../../config';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  pageId: string;
}

export const AnalyticsDashboard: React.FC<Props> = ({ pageId }) => {
  const [metrics, setMetrics] = useState({
    totalVisitors: 0,
    uniqueVisitors: 0,
    prizes_claimed:0,
    spins: 0,
    spinConversionRate: 0,
    prizeMetrics: {
      mostPopularPrize: 'N/A', // Default value
      redemptionRate: 0,
    },
    trafficSources: {
      organic: 0,
      social: 0,
      paid: 0,
      direct: 0,
    },
    history: {
      labels: [],
      visitors: [],
      spins: [],
      conversions: [],
    },
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });

  useEffect(() => {

    
    const fetchMetrics = async () => {
      try {
        // Fetch general analytics metrics
        const analyticsResponse = await fetch(
          `${api_Url}/api/analytics?pageId=${pageId}&startDate=${dateRange.startDate.toISOString().split('T')[0]}&endDate=${dateRange.endDate.toISOString().split('T')[0]}`
        );
        const analyticsResult = await analyticsResponse.json();

        if (analyticsResult.success) {
          setMetrics((prevMetrics) => ({
            ...prevMetrics,
            totalVisitors: analyticsResult.data?.pageVisited || 0,
            uniqueVisitors: analyticsResult.data?.visitors || 0,
            spins: analyticsResult.data?.spins || 0,
            spinConversionRate: analyticsResult.data?.spinConversionRate || 0,
            history: analyticsResult.data?.history || prevMetrics.history,
            prizes_claimed: analyticsResult?.data.conversions
            
          }
          
        ) );
        } else {
          console.error('Error fetching metrics:', analyticsResult.message);
        }

        // Fetch most popular prize
        const prizeResponse = await fetch(`${api_Url}/api/prizes/most-popular?pageId=${pageId}`);
        const prizeResult = await prizeResponse.json();

        if (prizeResult.success) {
          setMetrics((prevMetrics) => ({
            ...prevMetrics,
            prizeMetrics: {
              ...prevMetrics.prizeMetrics,
              mostPopularPrize: prizeResult.data._id || 'N/A', // Use the _id field as prizeName
            },
          }));
        } else {
          console.error('Error fetching most popular prize:', prizeResult.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchMetrics();
  }, [pageId, dateRange]);

  const chartData = {
    
    datasets: [
      {
        label: 'page_loaded',
        data: metrics?.history.visitors || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'spin_completed',
        data: metrics?.history.spins || [],
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1,
      },
      {
        label: 'prize_claimed',
        data: metrics?.history.conversions || [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#2B2B33] p-4 rounded-lg text-center">
          <h4 className="text-sm text-gray-400">Page Visited</h4>
          <p className="text-lg font-semibold text-white">{metrics.totalVisitors}</p>
        </div>
        <div className="bg-[#2B2B33] p-4 rounded-lg text-center">
          <h4 className="text-sm text-gray-400">Unique Visitors</h4>
          <p className="text-lg font-semibold text-white">{metrics.uniqueVisitors}</p>
        </div>
        <div className="bg-[#2B2B33] p-4 rounded-lg text-center">
          <h4 className="text-sm text-gray-400">Spins Initiated</h4>
          <p className="text-lg font-semibold text-white">{metrics.spins}</p>
        </div>
        <div className="bg-[#2B2B33] p-4 rounded-lg text-center">
          <h4 className="text-sm text-gray-400">Spin Conversion Rate</h4>
          <p className="text-lg font-semibold text-white">{metrics.spinConversionRate}%</p>
        </div>
        <div className="bg-[#2B2B33] p-4 rounded-lg text-center">
          <h4 className="text-sm text-gray-400">Most Popular Prize</h4>
          <p className="text-lg font-semibold text-white">{metrics.prizeMetrics.mostPopularPrize}</p>
        </div>
      </div>

      <div className="bg-[#1B1B21] p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-[#D3D3DF] mb-4">Performance Over Time</h3>
        <div className="h-[400px]">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(195, 58, 255, 0.1)' },
                },
                x: {
                  grid: { color: 'rgba(195, 58, 255, 0.1)' },
                },
              },
              plugins: {
                legend: {
                  position: 'top',
                  labels: { color: '#D3D3DF' },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
