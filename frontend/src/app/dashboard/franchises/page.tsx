'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';
import { franchiseAPI } from '@/lib/api';
import { Franchise } from '@/types';
import { Plus, Edit, Phone, Mail, MapPin, FileText, Download, Printer, Save } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { createPDFWithTurkishSupport, addTextToPDF, formatTableData } from '@/lib/pdfUtils';

interface FranchiseForm {
  name: string;
  tax_number: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
}

export default function FranchisesPage() {
  const [franchise, setFranchise] = useState<Franchise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FranchiseForm>();

  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        const data = await franchiseAPI.getAll();
        // Get the first franchise (main franchise)
        if (data && data.length > 0) {
          setFranchise(data[0]);
          reset(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch franchise:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFranchise();
  }, [reset]);

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (franchise) {
      reset(franchise);
    }
    setError('');
  };

  const onSubmit = async (data: FranchiseForm) => {
    try {
      if (franchise) {
        const updated = await franchiseAPI.update(franchise.id, data);
        setFranchise(updated);
      } else {
        const created = await franchiseAPI.create(data);
        setFranchise(created);
      }
      setIsEditing(false);
      setError('');
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

  const exportToPDF = () => {
    if (!franchise) return;
    
    const doc = createPDFWithTurkishSupport();
    doc.setFontSize(18);
    addTextToPDF(doc, 'Franchise Bilgileri', 14, 20);
    doc.setFontSize(12);
    addTextToPDF(doc, `Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 30);
    
    const data = formatTableData([
      ['Franchise Adi', franchise.name],
      ['Vergi Numarasi', franchise.tax_number],
      ['Telefon', franchise.phone || '-'],
      ['E-posta', franchise.email || '-'],
      ['Adres', franchise.address || '-'],
      ['Aciklama', franchise.description || '-'],
      ['Durum', franchise.is_active ? 'Aktif' : 'Pasif']
    ]);
    
    (doc as any).autoTable({
      startY: 40,
      body: data,
      theme: 'grid',
    });
    
    doc.save('franchise-bilgileri.pdf');
  };

  const exportToExcel = () => {
    if (!franchise) return;
    
    const ws = XLSX.utils.json_to_sheet([{
      'Franchise Adı': franchise.name,
      'Vergi Numarası': franchise.tax_number,
      'Telefon': franchise.phone || '-',
      'E-posta': franchise.email || '-',
      'Adres': franchise.address || '-',
      'Açıklama': franchise.description || '-',
      'Durum': franchise.is_active ? 'Aktif' : 'Pasif'
    }]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Franchise');
    XLSX.writeFile(wb, 'franchise-bilgileri.xlsx');
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
      <Header title="Franchise Bilgileri" subtitle="Franchise bilgilerini düzenleyin" />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Franchise Detayları</h2>
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
          {!isEditing && franchise && (
            <button onClick={handleEdit} className="btn btn-primary flex items-center gap-2">
              <Edit size={20} />
              Düzenle
            </button>
          )}
        </div>
      </div>

      {/* Franchise Form/Display */}
      {franchise ? (
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Franchise Adı *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Franchise adı gereklidir' })}
                  className="input"
                  placeholder="Örn: RTECA Emlak Teknolojileri"
                  disabled={!isEditing}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vergi Numarası *
                </label>
                <input
                  type="text"
                  {...register('tax_number', { required: 'Vergi numarası gereklidir' })}
                  className="input"
                  placeholder="1234567890"
                  disabled={!isEditing}
                />
                {errors.tax_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.tax_number.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Telefon
                </label>
                <input
                  type="text"
                  {...register('phone')}
                  className="input"
                  placeholder="+90 (212) 555 0000"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  E-posta
                </label>
                <input
                  type="text"
                  {...register('email')}
                  className="input"
                  placeholder="info@rteca.com"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Adres
              </label>
              <textarea
                {...register('address')}
                className="input"
                rows={3}
                placeholder="Merkez Mah. Büyükdere Cad. No: 123, Şişli/İstanbul"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Franchise Hakkında
              </label>
              <textarea
                {...register('description')}
                className="input"
                rows={4}
                placeholder="Franchise hakkında açıklama..."
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                  İptal
                </button>
                <button type="submit" className="btn btn-primary flex items-center gap-2">
                  <Save size={18} />
                  Kaydet
                </button>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Henüz franchise bilgisi eklenmemiş.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Franchise Bilgisi Ekle
          </button>
        </div>
      )}
    </div>
  );
}


