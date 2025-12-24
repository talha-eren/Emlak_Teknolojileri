import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  iconBgColor: string;
  iconColor: string;
}

export default function StatCard({ icon: Icon, title, value, iconBgColor, iconColor }: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={cn('p-3 rounded-lg', iconBgColor)}>
          <Icon className={iconColor} size={24} />
        </div>
      </div>
    </div>
  );
}


