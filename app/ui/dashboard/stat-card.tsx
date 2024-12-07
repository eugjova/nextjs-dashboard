import { oswald } from '@/app/ui/fonts';
import type { SVGProps } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  Icon: React.ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & React.RefAttributes<SVGSVGElement>>;
  iconColor: string;
  iconBgColor: string;
}

export function StatCard({ title, value, Icon, iconColor, iconBgColor }: StatCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-gray-600 font-medium">{title}</div>
          <div className={`${oswald.variable} text-2xl font-bold text-gray-900`}>
            {value}
          </div>
        </div>
        <div className={`flex items-center justify-center w-16 h-16 rounded-full ${iconBgColor} ${iconColor}`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
} 