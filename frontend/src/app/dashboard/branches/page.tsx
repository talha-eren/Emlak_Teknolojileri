'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import { branchAPI, franchiseAPI } from '@/lib/api';
import { Branch, Franchise } from '@/types';
import { Plus, Eye, Edit, Trash2, Phone, Mail, MapPin, Building2, FileText, Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface BranchForm {
  franchise_id: number;
  name: string;
  city: string;
  phone?: string;
  email?: string;
  address?: string;
  consultant_count?: number;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [detailBranch, setDetailBranch] = useState<Branch | null>(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchForm>();

  const fetchBranches = async () => {
    try {
      const data = await branchAPI.getAll();
      setBranches(data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFranchises = async () => {
    try {
      const data = await franchiseAPI.getAll();
      setFranchises(data);
    } catch (error) {
      console.error('Failed to fetch franchises:', error);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchFranchises();
  }, []);

  const handleOpenModal = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      reset(branch);
    } else {
      setEditingBranch(null);
      reset({
        franchise_id: franchises[0]?.id || 0,
        name: '',
        city: '',
        phone: '',
        email: '',
        address: '',
        consultant_count: 0,
      });
    }
    setIsModalOpen(true);
    setError('');
  };

  const handleOpenDetailModal = (branch: Branch) => {
    setDetailBranch(branch);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setDetailBranch(null);
  };

  const exportBranchToPDF = (branch: Branch) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Ofis Detayları', 14, 20);
    doc.setFontSize(12);
    doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 30);
    
    const data = [
      ['Ofis Adı', branch.name],
      ['Şehir', branch.city],
      ['Telefon', branch.phone || '-'],
      ['E-posta', branch.email || '-'],
      ['Adres', branch.address || '-'],
      ['Danışman Sayısı', (branch as any).consultant_count || '0'],
      ['Franchise', getFranchiseName(branch.franchise_id)],
      ['Durum', branch.is_active ? 'Aktif' : 'Pasif']
    ];
    
    (doc as any).autoTable({
      startY: 40,
      body: data,
      theme: 'grid',
    });
    
    doc.save(`${branch.name}-detay.pdf`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
    reset({});
    setError('');
  };

  const onSubmit = async (data: BranchForm) => {
    try {
      if (editingBranch) {
        await branchAPI.update(editingBranch.id, data);
      } else {
        await branchAPI.create(data);
      }
      await fetchBranches();
      handleCloseModal();
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail;
      if (Array.isArray(errorDetail)) {
        setError(errorDetail.map((e: any) => e.msg || e).join(', '));
      } else if (typeof errorDetail === 'object') {
        setError(JSON.stringify(errorDetail));
      } else {
        setError(errorDetail || 'İşlem başarısız oldu.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu şubeyi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await branchAPI.delete(id);
      await fetchBranches();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Silme işlemi başarısız oldu.');
    }
  };

  const getFranchiseName = (franchiseId: number) => {
    const franchise = franchises.find((f) => f.id === franchiseId);
    return franchise?.name || 'Bilinmiyor';
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Şube Listesi', 14, 20);
    doc.setFontSize(12);
    doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 30);
    
    const tableData = branches.map(b => [
      b.name,
      b.city,
      b.phone || '-',
      b.email || '-',
      getFranchiseName(b.franchise_id),
      b.is_active ? 'Aktif' : 'Pasif'
    ]);
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Şube Adı', 'Şehir', 'Telefon', 'E-posta', 'Franchise', 'Durum']],
      body: tableData,
    });
    
    doc.save('sube-listesi.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(branches.map(b => ({
      'Şube Adı': b.name,
      'Şehir': b.city,
      'Telefon': b.phone || '-',
      'E-posta': b.email || '-',
      'Franchise': getFranchiseName(b.franchise_id),
      'Adres': b.address || '-',
      'Durum': b.is_active ? 'Aktif' : 'Pasif'
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Branches');
    XLSX.writeFile(wb, 'sube-listesi.xlsx');
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
      <Header title="Franchise Ofisleri" subtitle="Franchise şubelerini düzenleyin" />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Ofis Listesi</h2>
          <p className="text-sm text-gray-600 mt-1">Toplam {branches.length} ofis</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportToPDF} className="btn btn-secondary flex items-center gap-2">
            <FileText size={18} />
            PDF
          </button>
          <button onClick={exportToExcel} className="btn btn-secondary flex items-center gap-2">
            <Download size={18} />
            Excel
          </button>
          <button onClick={handlePrint} className="btn btn-secondary flex items-center gap-2">
            <Printer size={18} />
            Yazdır
          </button>
          <button onClick={() => handleOpenModal()} className="btn btn-primary flex items-center gap-2">
            <Plus size={20} />
            Yeni Ofis Ekle
          </button>
        </div>
      </div>

      {/* Branches Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ofis Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-Posta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danışman Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {branches.map((branch) => (
                <tr key={branch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                      <div className="text-xs text-gray-500">{branch.city}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{branch.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{branch.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {(branch as any).consultant_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        branch.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {branch.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => exportBranchToPDF(branch)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs font-medium"
                        title="Yazdır"
                      >
                        Yazdır
                      </button>
                      <button
                        onClick={() => handleOpenModal(branch)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Düzenle"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(branch.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {branches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Henüz şube eklenmemiş.</p>
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary mt-4 inline-flex items-center gap-2"
            >
              <Plus size={20} />
              İlk Şubeyi Ekle
            </button>
          </div>
        )}
      </div>

      {/* Branch Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBranch ? 'Şube Düzenle' : 'Yeni Şube Ekle'}
        size="lg"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Franchise *
            </label>
            <select
              {...register('franchise_id', { required: 'Franchise seçimi gereklidir' })}
              className="input"
            >
              <option value="">Franchise Seçin</option>
              {franchises.map((franchise) => (
                <option key={franchise.id} value={franchise.id}>
                  {franchise.name}
                </option>
              ))}
            </select>
            {errors.franchise_id && (
              <p className="text-red-500 text-sm mt-1">{errors.franchise_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şube Adı *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Şube adı gereklidir' })}
                className="input"
                placeholder="Örn: Kadıköy Şubesi"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şehir *</label>
              <input
                type="text"
                {...register('city', { required: 'Şehir gereklidir' })}
                className="input"
                placeholder="İstanbul"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
              <input
                type="text"
                {...register('phone')}
                className="input"
                placeholder="+90 (216) 555 0102"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
              <input
                type="email"
                {...register('email')}
                className="input"
                placeholder="kadikoy@jokerofis.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
            <textarea
              {...register('address')}
              className="input"
              rows={3}
              placeholder="Moda Mah. Bahariye Cad. No: 123, Kadıköy/İstanbul"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Danışman Sayısı</label>
            <input
              type="number"
              {...register('consultant_count')}
              className="input"
              placeholder="0"
              min="0"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
              İptal
            </button>
            <button type="submit" className="btn btn-primary">
              {editingBranch ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Branch Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        title="Ofis Detayları"
        size="md"
      >
        {detailBranch && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{detailBranch.name}</h3>
                <p className="text-sm text-gray-600">{getFranchiseName(detailBranch.franchise_id)}</p>
              </div>
              <button
                onClick={() => exportBranchToPDF(detailBranch)}
                className="btn btn-secondary flex items-center gap-2 text-sm"
              >
                <FileText size={16} />
                PDF Kaydet
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin size={20} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Şehir</p>
                  <p className="text-sm font-medium text-gray-900">{detailBranch.city}</p>
                </div>
              </div>

              {detailBranch.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Telefon</p>
                    <p className="text-sm font-medium text-gray-900">{detailBranch.phone}</p>
                  </div>
                </div>
              )}

              {detailBranch.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">E-posta</p>
                    <p className="text-sm font-medium text-gray-900">{detailBranch.email}</p>
                  </div>
                </div>
              )}

              {detailBranch.address && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Adres</p>
                    <p className="text-sm font-medium text-gray-900">{detailBranch.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Danışman Sayısı</p>
                  <p className="text-sm font-semibold text-blue-900">{(detailBranch as any).consultant_count || 0}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  detailBranch.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {detailBranch.is_active ? 'Aktif' : 'Pasif'}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


