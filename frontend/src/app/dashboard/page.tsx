'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import { Building2, Store, DollarSign, AlertCircle, TrendingUp, Download, FileText, Printer } from 'lucide-react';
import { dashboardAPI, franchiseAPI, branchAPI } from '@/lib/api';
import { DashboardStats } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, franchisesData, branchesData, activitiesData] = await Promise.all([
          dashboardAPI.getStats(),
          franchiseAPI.getAll(),
          branchAPI.getAll(),
          dashboardAPI.getActivities(10),
        ]);
        
        setStats(statsData);
        setFranchises(franchisesData);
        setBranches(branchesData);
        setActivities(activitiesData);

        // Prepare chart data
        const franchiseStats = franchisesData.map((f: any) => ({
          name: f.name.substring(0, 20),
          branches: branchesData.filter((b: any) => b.franchise_id === f.id).length,
        }));
        setChartData(franchiseStats);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('RTECA Emlak Teknolojileri - Dashboard Raporu', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 30);
    
    doc.setFontSize(14);
    doc.text('İstatistikler', 14, 45);
    
    const statsTable = [
      ['Toplam Franchise', stats?.total_franchises || 0],
      ['Toplam Şube', stats?.total_branches || 0],
      ['Toplam Satış', formatCurrency(stats?.total_sales || 0)],
      ['Bekleyen İstekler', stats?.pending_requests || 0],
    ];
    
    (doc as any).autoTable({
      startY: 50,
      head: [['Metrik', 'Değer']],
      body: statsTable,
    });
    
    doc.save('dashboard-raporu.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        'Metrik': 'Toplam Franchise',
        'Değer': stats?.total_franchises || 0
      },
      {
        'Metrik': 'Toplam Şube',
        'Değer': stats?.total_branches || 0
      },
      {
        'Metrik': 'Toplam Satış',
        'Değer': stats?.total_sales || 0
      },
      {
        'Metrik': 'Bekleyen İstekler',
        'Değer': stats?.pending_requests || 0
      }
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');
    XLSX.writeFile(wb, 'dashboard-raporu.xlsx');
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Franchise Dashboard"
        subtitle="Franchise yönetimi için hoş geldiniz"
      />

      {/* Export Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={exportToPDF}
          className="btn btn-secondary flex items-center gap-2"
        >
          <FileText size={18} />
          PDF Olarak Kaydet
        </button>
        <button
          onClick={exportToExcel}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Download size={18} />
          Excel Olarak Kaydet
        </button>
        <button
          onClick={handlePrint}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Printer size={18} />
          Yazdır
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Building2}
          title="Adet Ofis"
          value={branches.length}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Store}
          title="Toplam Danışman"
          value={stats?.total_branches || 0}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon={DollarSign}
          title="Toplam Kazanç"
          value={formatCurrency(stats?.total_sales || 0)}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
        <StatCard
          icon={AlertCircle}
          title="Danışman Olana"
          value={stats?.pending_requests || 0}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Son Aktiviteler
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.action === 'profile_updated' ? 'bg-blue-600' :
                    activity.action === 'branch_created' ? 'bg-green-600' :
                    activity.action === 'branch_updated' ? 'bg-orange-600' :
                    'bg-gray-600'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.created_at).toLocaleString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Henüz aktivite bulunmuyor</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="text-orange-600" size={20} />
            Franchise Listesi
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {franchises.map((franchise) => (
              <div key={franchise.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="text-sm font-medium text-gray-900">{franchise.name}</p>
                <p className="text-xs text-gray-600">Vergi No: {franchise.tax_number}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts - Moved to Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Franchise Başına Şube Sayısı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="branches" fill="#0ea5e9" name="Şube Sayısı" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Büyüme Trendi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="branches" stroke="#10b981" name="Şube Sayısı" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
