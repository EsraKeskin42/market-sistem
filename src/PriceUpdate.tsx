import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  name: string;
  price: string;
  art: string;
  barcode: string;
  category: string;
}

interface EditableProduct extends Product {
  newPrice: string;
  newName: string;
  newBarcode: string;
  newArt: string;
  isEditing: boolean;
}

function PriceUpdate() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<EditableProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [saveMessage, setSaveMessage] = useState<string>('');

  useEffect(() => {
    // localStorage'dan ürünleri yükle
    const savedData = localStorage.getItem('products_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setProducts(parsed.map((p: Product) => ({
        ...p,
        newPrice: p.price.replace(' TL', ''),
        newName: p.name,
        newBarcode: p.barcode,
        newArt: p.art,
        isEditing: false
      })));
    }
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.barcode.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleEdit = (index: number) => {
    setProducts(prev => {
      const updated = [...prev];
      updated[index].isEditing = true;
      return updated;
    });
  };

  const handleSave = (index: number) => {
    setProducts(prev => {
      const updated = [...prev];
      updated[index].isEditing = false;
      // Değerleri güncelle
      updated[index].price = updated[index].newPrice + ' TL';
      updated[index].name = updated[index].newName;
      updated[index].barcode = updated[index].newBarcode;
      updated[index].art = updated[index].newArt;
      return updated;
    });
    
    // localStorage'a kaydet
    const dataToSave = products.map(p => ({
      name: p.newName,
      price: p.newPrice + ' TL',
      art: p.newArt,
      barcode: p.newBarcode,
      category: p.category
    }));
    localStorage.setItem('products_data', JSON.stringify(dataToSave));
    
    setSaveMessage('✓ Değişiklikler kaydedildi!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleCancel = (index: number) => {
    setProducts(prev => {
      const updated = [...prev];
      updated[index].isEditing = false;
      // Değerleri eski haline getir
      updated[index].newPrice = updated[index].price.replace(' TL', '');
      updated[index].newName = updated[index].name;
      updated[index].newBarcode = updated[index].barcode;
      updated[index].newArt = updated[index].art;
      return updated;
    });
  };

  const handleChange = (index: number, field: keyof EditableProduct, value: string) => {
    setProducts(prev => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: '#2d4b45',
        color: 'white',
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>💰 Fiyat Güncelleme</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: 14 }}>
            Ürün fiyatlarını, barkodlarını ve görsellerini güncelleyin
          </p>
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

      <div style={{ padding: 30, maxWidth: 1400, margin: '0 auto' }}>
        {/* Filtreler */}
        <div style={{
          background: 'white',
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1, minWidth: 250 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#333' }}>
              🔍 Ürün Ara
            </label>
            <input
              type="text"
              placeholder="Ürün adı veya barkod..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4a8f6b'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ minWidth: 200 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#333' }}>
              📁 Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {saveMessage && (
            <div style={{
              background: '#e8f5ee',
              color: '#2d4b45',
              padding: '10px 16px',
              borderRadius: 8,
              fontWeight: 600,
              border: '1px solid #4a8f6b'
            }}>
              {saveMessage}
            </div>
          )}
        </div>

        {/* Ürün Listesi */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 120px',
            gap: 16,
            padding: '16px 20px',
            background: '#f8f9fa',
            borderBottom: '2px solid #e0e0e0',
            fontWeight: 700,
            color: '#555',
            fontSize: 13,
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}>
            <div>Görsel</div>
            <div>Ürün Adı</div>
            <div>Barkod</div>
            <div>Fiyat</div>
            <div>Kategori</div>
            <div style={{ textAlign: 'center' }}>İşlem</div>
          </div>

          <div style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
            {filteredProducts.length === 0 ? (
              <div style={{
                padding: 60,
                textAlign: 'center',
                color: '#999'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                <div style={{ fontSize: 16 }}>Ürün bulunamadı</div>
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 120px',
                    gap: 16,
                    padding: '16px 20px',
                    borderBottom: '1px solid #f0f0f0',
                    alignItems: 'center',
                    background: product.isEditing ? '#fffbf0' : 'white',
                    transition: 'background 0.2s'
                  }}
                >
                  {/* Görsel */}
                  <div>
                    {product.isEditing ? (
                      <input
                        type="text"
                        value={product.newArt}
                        onChange={(e) => handleChange(index, 'newArt', e.target.value)}
                        style={{
                          width: 50,
                          height: 50,
                          textAlign: 'center',
                          fontSize: 24,
                          border: '2px solid #4a8f6b',
                          borderRadius: 8,
                          padding: 0
                        }}
                        maxLength={2}
                      />
                    ) : (
                      <div style={{
                        width: 50,
                        height: 50,
                        background: '#f5f5f5',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28
                      }}>
                        {product.art}
                      </div>
                    )}
                  </div>

                  {/* Ürün Adı */}
                  <div>
                    {product.isEditing ? (
                      <input
                        type="text"
                        value={product.newName}
                        onChange={(e) => handleChange(index, 'newName', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '2px solid #4a8f6b',
                          borderRadius: 6,
                          fontSize: 14
                        }}
                      />
                    ) : (
                      <div style={{ fontWeight: 600, color: '#333' }}>{product.name}</div>
                    )}
                  </div>

                  {/* Barkod */}
                  <div>
                    {product.isEditing ? (
                      <input
                        type="text"
                        value={product.newBarcode}
                        onChange={(e) => handleChange(index, 'newBarcode', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '2px solid #4a8f6b',
                          borderRadius: 6,
                          fontSize: 14,
                          fontFamily: 'monospace'
                        }}
                      />
                    ) : (
                      <div style={{ 
                        fontFamily: 'monospace', 
                        color: '#666',
                        background: '#f5f5f5',
                        padding: '4px 8px',
                        borderRadius: 4,
                        display: 'inline-block'
                      }}>
                        {product.barcode}
                      </div>
                    )}
                  </div>

                  {/* Fiyat */}
                  <div>
                    {product.isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="text"
                          value={product.newPrice}
                          onChange={(e) => handleChange(index, 'newPrice', e.target.value)}
                          style={{
                            width: 100,
                            padding: '8px 12px',
                            border: '2px solid #4a8f6b',
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 600
                          }}
                        />
                        <span style={{ color: '#666' }}>TL</span>
                      </div>
                    ) : (
                      <div style={{ 
                        fontWeight: 700, 
                        color: '#2d4b45',
                        fontSize: 16
                      }}>
                        {product.price}
                      </div>
                    )}
                  </div>

                  {/* Kategori */}
                  <div>
                    <span style={{
                      background: '#e8f5ee',
                      color: '#4a8f6b',
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {product.category}
                    </span>
                  </div>

                  {/* İşlem Butonu */}
                  <div style={{ textAlign: 'center' }}>
                    {product.isEditing ? (
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        <button
                          onClick={() => handleSave(index)}
                          style={{
                            background: '#4a8f6b',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600
                          }}
                        >
                          ✓ Kaydet
                        </button>
                        <button
                          onClick={() => handleCancel(index)}
                          style={{
                            background: '#f5f5f5',
                            color: '#666',
                            border: '1px solid #ddd',
                            padding: '8px 12px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(index)}
                        style={{
                          background: '#f8f9fa',
                          color: '#555',
                          border: '1px solid #ddd',
                          padding: '8px 16px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: 600,
                          transition: 'all 0.2s',
                          width: '100%'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#2d4b45';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f8f9fa';
                          e.currentTarget.style.color = '#555';
                        }}
                      >
                        ✏️ Düzenle
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bilgi Kartı */}
        <div style={{
          marginTop: 20,
          padding: 16,
          background: '#e3f2fd',
          borderRadius: 8,
          border: '1px solid #bbdefb',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ fontSize: 24 }}>ℹ️</span>
          <div style={{ color: '#1565c0', fontSize: 14 }}>
            <strong>İpucu:</strong> Sadece değiştirmek istediğiniz alanları güncelleyin. 
            Değiştirmek istemediğiniz alanları olduğu gibi bırakabilirsiniz. 
            Kaydet butonuna bastığınızda değişiklikler otomatik olarak kaydedilir.
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceUpdate;