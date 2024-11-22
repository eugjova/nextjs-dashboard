import { Revenue } from './definitions';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDateToLocal = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // Jika total halaman 7 atau kurang
  // [1, 2, 3, 4, 5, 6, 7]
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Jika halaman saat ini di dekat awal
  // [1, 2, 3, ..., 7, 8, 9]
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // Jika halaman saat ini di dekat akhir
  // [1, 2, 3, ..., 7, 8, 9]
  if (currentPage >= totalPages - 2) {
    return [1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // Jika halaman saat ini di tengah
  // [1, 2, ..., 4, 5, 6, ..., 8, 9]
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
