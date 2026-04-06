import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface SaleRecord {
  id: string;
  date: string;
  time: string;
  hour: number;
  total: number;
  paymentType: 'nakit' | 'kredi' | 'acik';
  items: number;
  dayOfWeek: number;
  dayName: string;
}

function Reports() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');
  const [activeTab, setActiveTab] = useState<'overview' | 'hourly' | 'payment' | 'trends'>('overview');

  // Örnek satış verileri (gerçek uygulamada localStorage'dan veya API'den gelecek)
  const [salesData, setSalesData] = useState<SaleRecord[]>([]);

  useEffect(() => {
    // Örnek veri oluştur (gerçek uygulamada bu veriler localStorage'dan gelir)
    generateSampleData();
  }, []);

  const generateSampleData = () => {
    const data: SaleRecord[] = [];
    const paymentTypes: ('nakit' | 'kredi' | 'acik')[] = ['nakit', 'kredi', 'acik'];
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    
    // Son 30 gün için örnek veri
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();
      
      // Her gün için 20-50 arası satış
      const dailySales = Math.floor(Math.random() * 30) + 20;
      
      for (let j = 0; j < dailySales; j++) {
        const hour = Math.floor(Math.random() * 14) + 8; // 08:00 - 22:00 arası
        const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
        const total = Math.floor(Math.random() * 800) + 50; // 50-850 TL arası
        
        data.push({
          id: `sale-${i}-${j}`,
          date: date.toISOString().split('T')[0],
          time: `${hour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          hour,
          total,
          paymentType,
          items: Math.floor(Math.random() * 10) + 1,
          dayOfWeek,
          dayName: dayNames[dayOfWeek]
        });
      }
    }
    
    setSalesData(data);
  };

  // Filtrelenmiş veriler
  const filteredData = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);

    return salesData.filter(sale => {
      if (dateRange === 'today') return sale.date === today;
      if (dateRange === 'week') return new Date(sale.date) >= weekAgo;
      if (dateRange === 'month') return new Date(sale.date) >= monthAgo;
      return true;
    });
  }, [salesData, dateRange]);

  // Genel İstatistikler
  const stats = useMemo(() => {
    const totalSales = filteredData.reduce((sum, s) => sum + s.total, 0);
    const totalTransactions = filteredData.length;
    const avgTicket = totalTransactions > 0 ? totalSales / totalTransactions : 0;
    const totalItems = filteredData.reduce((sum, s) => sum + s.items, 0);
    
    // Önceki periyodla karşılaştırma (simülasyon)
    const prevPeriodChange = Math.floor(Math.random() * 20) - 5; // -5% ile +15% arası
    
    return {
      totalSales,
      totalTransactions,
      avgTicket,
      totalItems,
      prevPeriodChange
    };
  }, [filteredData]);

  // Saatlik Yoğunluk Verisi
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 08-22
    return hours.map(hour => {
      const hourSales = filteredData.filter(s => s.hour === hour);
      return {
        hour: `${hour}:00`,
        sales: hourSales.length,
        revenue: hourSales.reduce((sum, s) => sum + s.total, 0),
        avgTicket: hourSales.length > 0 
          ? hourSales.reduce((sum, s) => sum + s.total, 0) / hourSales.length 
          : 0
      };
    });
  }, [filteredData]);

  // Günlük Dağılım
  const dailyData = useMemo(() => {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    return days.map((day, index) => {
      const daySales = filteredData.filter(s => s.dayOfWeek === (index + 1) % 7);
      return {
        day,
        sales: daySales.length,
        revenue: daySales.reduce((sum, s) => sum + s.total, 0),
        customers: daySales.length
      };
    });
  }, [filteredData]);

  // Ödeme Tipine Göre Dağılım
  const paymentData = useMemo(() => {
    const types = [
      { key: 'nakit', label: 'Nakit', color: '#4a8f6b', icon: '💵' },
      { key: 'kredi', label: 'Kredi Kartı', color: '#2196f3', icon: '💳' },
      { key: 'acik', label: 'Açık Hesap', color: '#ff9800', icon: '🧾' }
    ];
    
    return types.map(type => {
      const typeSales = filteredData.filter(s => s.paymentType === type.key);
      return {
        name: type.label,
        value: typeSales.reduce((sum, s) => sum + s.total, 0),
        count: typeSales.length,
        color: type.color,
        icon: type.icon
      };
    });
  }, [filteredData]);

  // Satış Eğilimleri (Son 7 gün)
  const trendData = useMemo(() => {
    const days = 7;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const daySales = filteredData.filter(s => s.date === dateStr);
      
      data.push({
        date: date.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric' }),
        revenue: daySales.reduce((sum, s) => sum + s.total, 0),
        transactions: daySales.length,
        items: daySales.reduce((sum, s) => sum + s.items, 0)
      });
    }
    return data;
  }, [filteredData]);

  // Müşteri Yoğunluğu Radar Verisi
  const customerRadarData = useMemo(() => {
    return hourlyData.map(h => ({
      subject: h.hour,
      A: h.sales,
      fullMark: Math.max(...hourlyData.map(d => d.sales)) * 1.2
    }));
  }, [hourlyData]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(value);
  };

  const COLORS = ['#4a8f6b', '#2196f3', '#ff9800', '#e91e63', '#9c27b0'];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2d4b45 0%, #4a8f6b 100%)',
        color: 'white',
        padding: '25px 30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
                📊 Raporlar ve Analizler
              </h1>
              <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: 14 }}>
                Satış performansınızı ve müşteri davranışlarını analiz edin
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {/* Tarih Aralığı Seçici */}
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 10,
                padding: 4,
                display: 'flex',
                gap: 4
              }}>
                {[
                  { key: 'today', label: 'Bugün' },
                  { key: 'week', label: 'Bu Hafta' },
                  { key: 'month', label: 'Bu Ay' }
                ].map(range => (
                  <button
                    key={range.key}
                    onClick={() => setDateRange(range.key as any)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: dateRange === range.key ? 'white' : 'transparent',
                      color: dateRange === range.key ? '#2d4b45' : 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 13,
                      transition: 'all 0.2s'
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleBack}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                ← Geri Dön
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '25px' }}>
        {/* Özet Kartları */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          marginBottom: 30
        }}>
          {[
            { 
              title: 'Toplam Ciro', 
              value: formatCurrency(stats.totalSales),
              change: `+${stats.prevPeriodChange}%`,
              icon: '💰',
              color: '#4a8f6b'
            },
            { 
              title: 'Toplam İşlem', 
              value: stats.totalTransactions.toLocaleString('tr-TR'),
              change: `${stats.totalTransactions > 100 ? '+' : ''}${Math.floor(stats.totalTransactions / 10)}`,
              icon: '🛒',
              color: '#2196f3'
            },
            { 
              title: 'Ortalama Sepet', 
              value: formatCurrency(stats.avgTicket),
              change: '+5.2%',
              icon: '🛍️',
              color: '#ff9800'
            },
            { 
              title: 'Satılan Ürün', 
              value: stats.totalItems.toLocaleString('tr-TR'),
              change: '+12%',
              icon: '📦',
              color: '#e91e63'
            }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'white',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e8ecef',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{stat.icon}</span>
                <span style={{
                  background: stat.change.startsWith('+') ? '#e8f5ee' : '#ffebee',
                  color: stat.change.startsWith('+') ? '#4a8f6b' : '#e91e63',
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {stat.change}
                </span>
              </div>
              <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>{stat.title}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tab Menü */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 6,
          marginBottom: 25,
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap'
        }}>
          {[
            { key: 'overview', label: '📈 Genel Bakış', desc: 'Satış özeti' },
            { key: 'hourly', label: '⏰ Saat Analizi', desc: 'Yoğun saatler' },
            { key: 'payment', label: '💳 Ödeme Analizi', desc: 'Ödeme tipleri' },
            { key: 'trends', label: '📊 Eğilimler', desc: 'Satış trendleri' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                flex: 1,
                minWidth: 160,
                padding: '14px 20px',
                borderRadius: 10,
                border: 'none',
                background: activeTab === tab.key ? '#2d4b45' : 'transparent',
                color: activeTab === tab.key ? 'white' : '#666',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{tab.label}</div>
              <div style={{ fontSize: 12, opacity: activeTab === tab.key ? 0.9 : 0.6 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* Tab İçerikleri */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 25 }}>
            {/* Günlük Satış Grafiği */}
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 25,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#1a1a2e', fontSize: 18 }}>
                📅 Günlere Göre Satış Dağılımı
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="revenue" fill="#4a8f6b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Ödeme Dağılımı Pasta Grafiği */}
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 25,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#1a1a2e', fontSize: 18 }}>
                💳 Ödeme Tipine Göre Dağılım
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 15 }}>
                {paymentData.map((p, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{p.icon}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{p.name}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: p.color }}>
                      {formatCurrency(p.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hourly' && (
          <div style={{ display: 'grid', gap: 25 }}>
            {/* Saatlik Yoğunluk */}
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 25,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#1a1a2e', fontSize: 18 }}>
                ⏰ Saatlik Müşteri Yoğunluğu ve Ciro
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4a8f6b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4a8f6b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4a8f6b" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    name="Ciro (TL)"
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="sales" 
                    fill="#2196f3" 
                    name="İşlem Sayısı"
                    radius={[4, 4, 0, 0]}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Grafiği - Yoğunluk Analizi */}
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 25,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 30
            }}>
              <div>
                <h3 style={{ margin: '0 0 20px 0', color: '#1a1a2e', fontSize: 18 }}>
                  🎯 Saatlik Yoğunluk Analizi
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={customerRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                    <Radar
                      name="İşlem Sayısı"
                      dataKey="A"
                      stroke="#4a8f6b"
                      fill="#4a8f6b"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ color: '#1a1a2e', marginBottom: 20 }}>📊 Yoğun Saatler Özeti</h4>
                {hourlyData
                  .sort((a, b) => b.sales - a.sales)
                  .slice(0, 5)
                  .map((hour, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <div style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 14,
                        marginRight: 15
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#333' }}>{hour.hour}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{hour.sales} işlem</div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#4a8f6b' }}>
                        {formatCurrency(hour.revenue)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 25 }}>
            {/* Ödeme Detayları */}
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 25,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#1a1a2e', fontSize: 18 }}>
                💳 Ödeme Tipi Detayları
              </h3>
              <div style={{ display: 'grid', gap: 15 }}>
                {paymentData.map((payment, idx) => (
                  <div key={idx} style={{
                    padding: 20,
                    background: '#f8f9fa',
                    borderRadius: 12,
                    borderLeft: `4px solid ${payment.color}`,
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: 15,
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: 32 }}>{payment.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#333', fontSize: 16 }}>{payment.name}</div>
                      <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                        {payment.count} işlem
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: payment.color, fontSize: 18 }}>
                        {formatCurrency(payment.value)}
                      </div>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        %{((payment.value / stats.totalSales) * 100).toFixed(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ödeme Trendi */}
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 25,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#1a1a2e', fontSize: 18 }}>
                📈 Günlük Ödeme Trendi
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#4a8f6b" strokeWidth={3} name="Toplam Ciro" />
                  <Line type="monotone" dataKey="transactions" stroke="#2196f3" strokeWidth={2} name="İşlem Sayısı" yAxisId={1} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div style={{ display: 'grid', gap: 25 }}>
            {/* Satış Eğilimleri */}
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 25,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#1a1a2e', fontSize: 18 }}>
                📊 Son 7 Günlük Satış Eğilimi
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4a8f6b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4a8f6b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff9800" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ff9800" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4a8f6b" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue2)" 
                    name="Ciro (TL)"
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="items" 
                    stroke="#ff9800" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorItems)" 
                    name="Satılan Ürün"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Haftalık Karşılaştırma */}
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 25,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#1a1a2e', fontSize: 18 }}>
                📅 Haftanın Günleri Performans Karşılaştırması
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dailyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="day" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Ciro' : 'Müşteri Sayısı'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#4a8f6b" name="Ciro (TL)" radius={[0, 8, 8, 0]} barSize={30} />
                  <Bar dataKey="customers" fill="#2196f3" name="Müşteri Sayısı" radius={[0, 8, 8, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;