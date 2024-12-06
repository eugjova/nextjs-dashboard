'use client';

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartProps {
  data: {
    month: string;
    total: number;
  }[];
  type: 'revenue' | 'customers';
}

export function DashboardChart({ data, type }: ChartProps) {
  
  const sortedData = [...data].sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  const options = {
    chart: {
      type: 'bar' as const,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: sortedData.map(item => {
        try {
          const date = new Date(item.month);
          return date.toLocaleString('id-ID', { 
            month: 'short',
            year: 'numeric' 
          });
        } catch (error) {
          console.error('Error formatting date:', error);
          return item.month;
        }
      }),
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          if (type === 'revenue') {
            return new Intl.NumberFormat('id-ID', { 
              style: 'currency', 
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value);
          }
          return value.toString();
        }
      }
    },
    colors: [type === 'revenue' ? '#EF4444' : '#3B82F6']
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {type === 'revenue' ? 'Recent Revenue' : 'Recent Customers'}
        </h2>
        <p className="text-gray-500">Tidak ada data tersedia</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {type === 'revenue' ? 'Recent Revenue' : 'Recent Customers'}
      </h2>
      <Chart
        options={options}
        series={[{
          name: type === 'revenue' ? 'Revenue' : 'New Customers',
          data: sortedData.map(item => Number(item.total))
        }]}
        type="bar"
        height={350}
      />
    </div>
  );
} 