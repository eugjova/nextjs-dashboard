'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const handleDateChange = () => {
    const params = new URLSearchParams(searchParams);

    if (startDate) {
      params.set('startDate', startDate);
    } else {
      params.delete('startDate');
    }
    
    if (endDate) {
      params.set('endDate', endDate);
    } else {
      params.delete('endDate');
    }

    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    
    const params = new URLSearchParams(searchParams);
    params.delete('startDate');
    params.delete('endDate');
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="peer block rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        />
        <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>
      <span>-</span>
      <div className="relative">
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="peer block rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        />
        <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>
      <button
        onClick={handleDateChange}
        className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
      >
        Terapkan
      </button>
      {(startDate || endDate) && (
        <button
          onClick={handleClear}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
} 