'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Maximize2, Minimize2, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Merhaba! RTECA Emlak Teknolojileri asistanıyım. Size nasıl yardımcı olabilirim?\n\nKomutlar:\n• "yardım" - Tüm komutları göster\n• "rapor oluştur" - PDF rapor oluştur\n• "excel oluştur" - Excel belgesi oluştur\n• "franchise" - Franchise yönetimi\n• "ofis" - Ofis yönetimi',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const createPDFReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('RTECA Emlak Teknolojileri', 14, 20);
    doc.setFontSize(12);
    doc.text('Sistem Raporu', 14, 30);
    doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 40);
    doc.text('Bu rapor asistan tarafından oluşturulmuştur.', 14, 50);
    doc.save('rteca-rapor.pdf');
    return 'PDF raporu başarıyla oluşturuldu ve indirildi!';
  };

  const createExcelReport = () => {
    const ws = XLSX.utils.json_to_sheet([
      { 'Başlık': 'RTECA Emlak Teknolojileri', 'Değer': 'Sistem Raporu' },
      { 'Başlık': 'Tarih', 'Değer': new Date().toLocaleDateString('tr-TR') },
      { 'Başlık': 'Durum', 'Değer': 'Aktif' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rapor');
    XLSX.writeFile(wb, 'rteca-rapor.xlsx');
    return 'Excel belgesi başarıyla oluşturuldu ve indirildi!';
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('rapor oluştur') || lowerMessage.includes('pdf oluştur')) {
      return createPDFReport();
    }
    
    if (lowerMessage.includes('excel oluştur') || lowerMessage.includes('excel belgesi')) {
      return createExcelReport();
    }

    if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
      return 'Merhaba! Size nasıl yardımcı olabilirim?\n\nBelge oluşturmak için:\n• "rapor oluştur" - PDF rapor\n• "excel oluştur" - Excel belgesi';
    }
    
    if (lowerMessage.includes('franchise') || lowerMessage.includes('bayilik')) {
      return 'Franchise yönetimi için "Franchise Bilgileri" menüsünü kullanabilirsiniz. Buradan yeni franchise ekleyebilir, mevcut franchise\'ları düzenleyebilirsiniz.\n\nİşlemler:\n• Yeni franchise ekle\n• Franchise düzenle\n• Franchise sil\n• PDF/Excel rapor al';
    }
    
    if (lowerMessage.includes('ofis') || lowerMessage.includes('şube')) {
      return 'Ofis yönetimi için "Ofisler" menüsünü kullanabilirsiniz. Franchise\'lara bağlı ofisler ekleyebilir ve yönetebilirsiniz.\n\nİşlemler:\n• Yeni ofis ekle\n• Ofis düzenle\n• Ofis detayları\n• PDF/Excel rapor al';
    }
    
    if (lowerMessage.includes('nasıl') && lowerMessage.includes('ekle')) {
      return 'Yeni kayıt eklemek için:\n1. İlgili menüden "Yeni Ekle" butonuna tıklayın\n2. Açılan formda gerekli bilgileri doldurun\n3. "Kaydet" butonuna basın\n\nBelge oluşturmak için "rapor oluştur" veya "excel oluştur" yazabilirsiniz.';
    }
    
    if (lowerMessage.includes('rapor') || lowerMessage.includes('belge')) {
      return 'Belge oluşturma seçenekleri:\n\n1. PDF Rapor: "rapor oluştur" yazın\n2. Excel Belgesi: "excel oluştur" yazın\n3. Dashboard\'dan: PDF, Excel ve Yazdır butonları\n4. Franchise/Ofis sayfalarından: Export butonları';
    }
    
    if (lowerMessage.includes('istatistik') || lowerMessage.includes('dashboard')) {
      return 'Dashboard sayfasında:\n• Toplam franchise sayısı\n• Şube sayısı\n• Satış rakamları\n• Grafikler\n• PDF/Excel export\n\nBelge oluşturmak için "rapor oluştur" yazabilirsiniz.';
    }
    
    if (lowerMessage.includes('yardım') || lowerMessage.includes('help')) {
      return 'Size yardımcı olabileceğim konular:\n\n📊 Yönetim:\n• Franchise yönetimi\n• Ofis/Şube yönetimi\n• Dashboard kullanımı\n\n📄 Belgeler:\n• "rapor oluştur" - PDF rapor\n• "excel oluştur" - Excel belgesi\n• Rapor indirme\n\n💡 Diğer:\n• Kullanıcı profili\n• Sistem ayarları\n\nHangi konuda yardım istersiniz?';
    }

    if (lowerMessage.includes('profil') || lowerMessage.includes('hesap')) {
      return 'Profil ayarlarınıza sol menüdeki kullanıcı bilgilerinize tıklayarak ulaşabilirsiniz. Buradan:\n• Adınızı değiştirebilirsiniz\n• Şifrenizi güncelleyebilirsiniz\n• Email adresinizi düzenleyebilirsiniz';
    }

    return 'Anlamadım. "yardım" yazarak neler yapabileceğimi öğrenebilirsiniz.\n\nHızlı komutlar:\n• "rapor oluştur" - PDF oluştur\n• "excel oluştur" - Excel oluştur\n• "franchise" - Franchise bilgisi\n• "ofis" - Ofis bilgisi';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse: Message = {
        text: getBotResponse(input),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const chatWindowClass = isFullScreen 
    ? 'fixed inset-4 z-50' 
    : 'fixed bottom-6 right-6 w-96 h-[500px] z-50';

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-50"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`${chatWindowClass} bg-white rounded-2xl shadow-2xl flex flex-col`}>
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">RTECA Asistan</h3>
                <p className="text-xs text-blue-100">Online • Belgeler oluşturabilir</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="hover:bg-blue-700 p-2 rounded-lg transition-colors"
                title={isFullScreen ? 'Küçült' : 'Tam Ekran'}
              >
                {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsFullScreen(false);
                }}
                className="hover:bg-blue-700 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <p className="text-xs text-gray-600 mb-2 font-medium">Hızlı Komutlar:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setInput('rapor oluştur');
                  setTimeout(() => handleSend(), 100);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <FileText size={16} className="text-blue-600" />
                <span>PDF Oluştur</span>
              </button>
              <button
                onClick={() => {
                  setInput('excel oluştur');
                  setTimeout(() => handleSend(), 100);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-green-50 hover:border-green-300 transition-colors"
              >
                <Download size={16} className="text-green-600" />
                <span>Excel Oluştur</span>
              </button>
              <button
                onClick={() => {
                  setInput('franchise');
                  setTimeout(() => handleSend(), 100);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Franchise</span>
              </button>
              <button
                onClick={() => {
                  setInput('ofis');
                  setTimeout(() => handleSend(), 100);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-orange-50 hover:border-orange-300 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-orange-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Ofis Bilgisi</span>
              </button>
              <button
                onClick={() => {
                  setInput('dashboard');
                  setTimeout(() => handleSend(), 100);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => {
                  setInput('yardım');
                  setTimeout(() => handleSend(), 100);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-yellow-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Yardım</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-blue-100'}`}>
                    {message.timestamp.toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesajınızı yazın..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
