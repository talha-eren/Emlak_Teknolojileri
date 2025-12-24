'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';
import { authAPI } from '@/lib/api';
import { User } from '@/types';
import { User as UserIcon, Mail, Lock, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileForm {
  full_name: string;
  email: string;
}

interface PasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>();

  const newPassword = watch('new_password');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authAPI.getMe();
        setUser(userData);
        resetProfile({
          full_name: userData.full_name,
          email: userData.email,
        });
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [resetProfile, router]);

  const onSubmitProfile = async (data: ProfileForm) => {
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const updatedUser = await authAPI.updateProfile(data);
      setUser(updatedUser);
      setSuccessMessage('Profil bilgileriniz başarıyla güncellendi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Profil güncellenirken bir hata oluştu.';
      setErrorMessage(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  const onSubmitPassword = async (data: PasswordForm) => {
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await authAPI.updateProfile({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      
      setSuccessMessage('Şifreniz başarıyla değiştirildi!');
      resetPassword();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Şifre değiştirilirken bir hata oluştu.';
      setErrorMessage(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  const getUserRole = () => {
    if (!user) return 'Kullanıcı';
    if (user.is_superuser) return 'Yönetici';
    return 'Kullanıcı';
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
      <Header title="Profil Ayarları" subtitle="Hesap bilgilerinizi yönetin" />

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="card">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-white">
                {user?.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{user?.full_name}</h3>
            <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
            <div className="mt-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                user?.is_superuser 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {getUserRole()}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Üyelik Tarihi</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR') : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <UserIcon size={20} className="text-blue-600" />
            Profil Bilgileri
          </h3>

          <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                {...registerProfile('full_name', {
                  required: 'Ad soyad gereklidir',
                  minLength: {
                    value: 3,
                    message: 'Ad soyad en az 3 karakter olmalıdır',
                  },
                })}
                className="input"
                placeholder="Adınız Soyadınız"
              />
              {profileErrors.full_name && (
                <p className="text-red-500 text-sm mt-1">{profileErrors.full_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                {...registerProfile('email', {
                  required: 'E-posta gereklidir',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Geçerli bir e-posta adresi girin',
                  },
                })}
                className="input"
                placeholder="ornek@email.com"
              />
              {profileErrors.email && (
                <p className="text-red-500 text-sm mt-1">{profileErrors.email.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn btn-primary flex items-center gap-2">
                <Save size={18} />
                Değişiklikleri Kaydet
              </button>
            </div>
          </form>

          <hr className="my-8" />

          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Lock size={20} className="text-blue-600" />
            Şifre Değiştir
          </h3>

          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mevcut Şifre
              </label>
              <input
                type="password"
                {...registerPassword('current_password', {
                  required: 'Mevcut şifre gereklidir',
                })}
                className="input"
                placeholder="••••••••"
              />
              {passwordErrors.current_password && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.current_password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Şifre
              </label>
              <input
                type="password"
                {...registerPassword('new_password', {
                  required: 'Yeni şifre gereklidir',
                  minLength: {
                    value: 6,
                    message: 'Şifre en az 6 karakter olmalıdır',
                  },
                })}
                className="input"
                placeholder="••••••••"
              />
              {passwordErrors.new_password && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.new_password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Şifre Tekrar
              </label>
              <input
                type="password"
                {...registerPassword('confirm_password', {
                  required: 'Şifre tekrarı gereklidir',
                  validate: (value) => value === newPassword || 'Şifreler eşleşmiyor',
                })}
                className="input"
                placeholder="••••••••"
              />
              {passwordErrors.confirm_password && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.confirm_password.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn btn-primary flex items-center gap-2">
                <Lock size={18} />
                Şifreyi Değiştir
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

