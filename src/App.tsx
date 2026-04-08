import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

interface CartItem {
  name: string;
  price: string;
  numericPrice: number;
  qty: number;
  art: string;
}

type PaymentType = 'nakit' | 'kredi' | 'acik' | null;

function App() {
  const navigate = useNavigate();
  const win = globalThis as any;
  const cityFromElectron = win?.market?.city as string | null | undefined;

  const [storeName] = useState(() => {
    const cityFromStorage = typeof window !== 'undefined' ? window.localStorage.getItem('market_city') : null;
    return cityFromElectron || cityFromStorage || 'GAZİANTEP';
  });

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [now, setNow] = useState(() => new Date());
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Bekletilmiş sepet state'i
  const [heldCart, setHeldCart] = useState<CartItem[] | null>(null);
  
  const [selectedCartIndex, setSelectedCartIndex] = useState<number | null>(null);
  const [paymentModal, setPaymentModal] = useState<PaymentType>(null);

  const weightCategories = ['meyve', 'sebze'];
  const [scaleModal, setScaleModal] = useState<{
    product: { name: string; price: string; art: string };
  } | null>(null);
  const [scaleKg, setScaleKg] = useState('');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!cityFromElectron) return;
    try {
      window.localStorage.setItem('market_city', cityFromElectron);
    } catch {}
  }, [cityFromElectron]);

  const categories = useMemo(() => [
    { id: 'meyve', label: 'MEYVE', icon: '🍌' },
    { id: 'sebze', label: 'SEBZE', icon: '🥕' },
    { id: 'bakliyat', label: 'BAKLİYAT', icon: '🫘' },
    { id: 'atis', label: 'ATIŞTIRMALIK', icon: '🍪' },
    { id: 'sut', label: 'SÜT ÜRÜNLERİ', icon: '🥛' },
    { id: 'temizlik', label: 'TEMİZLİK\nMALZEMELERİ', icon: '🧽' },
  ], []);

  const productsByCategory = useMemo(() => ({
    meyve: [
      { name: 'MUZ', price: '25,00 TL', art: '🍌', barcode: '1234567890001' },
      { name: 'ELMA (kg)', price: '20,00 TL', art: '🍎', barcode: '1234567890002' },
      { name: 'ÇİLEK (Paket)', price: '35,00 TL', art: '🍓', barcode: '1234567890003' },
      { name: 'KARPUZ (kg)', price: '8,00 TL', art: '🍉', barcode: '1234567890004' },
      { name: 'ÜZÜM', price: '30,00 TL', art: '🍇', barcode: '1234567890005' },
      { name: 'LİMON', price: '18,00 TL', art: '🍋', barcode: '1234567890006' },
    ],
    sebze: [
      { name: 'DOMATES (kg)', price: '25,00 TL', art: '🍅', barcode: '1234567890010' },
      { name: 'SALATALIK (kg)', price: '20,00 TL', art: '🥒', barcode: '1234567890011' },
      { name: 'BİBER (kg)', price: '30,00 TL', art: '🫑', barcode: '1234567890012' },
      { name: 'PATLICAN (kg)', price: '28,00 TL', art: '🍆', barcode: '1234567890013' },
      { name: 'PATATES (kg)', price: '18,00 TL', art: '🥔', barcode: '1234567890014' },
      { name: 'SOĞAN (kg)', price: '15,00 TL', art: '🧅', barcode: '1234567890015' },
      { name: 'HAVUÇ (kg)', price: '17,00 TL', art: '🥕', barcode: '1234567890016' },
      { name: 'BROKOLİ (Adet)', price: '35,00 TL', art: '🥦', barcode: '1234567890017' },
      { name: 'MISIR (Adet)', price: '12,00 TL', art: '🌽', barcode: '1234567890018' },
      { name: 'SARIMSAK (Demet)', price: '40,00 TL', art: '🧄', barcode: '1234567890019' }
    ],
    bakliyat: [
      { name: 'KURU FASULYE (kg)', price: '85,00 TL', art: '⚪', barcode: '1234567890020' },
      { name: 'KIRMIZI MERCİMEK (kg)', price: '45,00 TL', art: '🟠', barcode: '1234567890021' },
      { name: 'NOHUT (kg)', price: '75,00 TL', art: '🤎', barcode: '1234567890022' },
      { name: 'PİRİNÇ (Osmancık kg)', price: '60,00 TL', art: '🍚', barcode: '1234567890023' },
      { name: 'BULGUR (Pilavlık kg)', price: '35,00 TL', art: '🌾', barcode: '1234567890024' },
      { name: 'YEŞİL MERCİMEK (kg)', price: '55,00 TL', art: '🟢', barcode: '1234567890025' },
      { name: 'BARBUNYA (kg)', price: '95,00 TL', art: '🥜', barcode: '1234567890026' },
      { name: 'MISIR PATLATMALIK (kg)', price: '40,00 TL', art: '🍿', barcode: '1234567890027' }
    ],
    atis: [
      { name: 'SÜTLÜ ÇİKOLATA', price: '22,50 TL', art: '🍫', barcode: '1234567890030' },
      { name: 'TUZLU FISTIK (Paket)', price: '30,00 TL', art: '🥜', barcode: '1234567890031' },
      { name: 'PATATES CİPSİ (Large)', price: '45,00 TL', art: '🥔', barcode: '1234567890032' },
      { name: 'BİSKÜVİ (Tam Buğday)', price: '18,50 TL', art: '🍪', barcode: '1234567890033' },
      { name: 'KEK (Meyveli)', price: '12,00 TL', art: '🧁', barcode: '1234567890034' },
      { name: 'GOFRET (Fındıklı)', price: '10,00 TL', art: '🧇', barcode: '1234567890035' },
      { name: 'JELİBON', price: '25,00 TL', art: '🍬', barcode: '1234567890036' },
      { name: 'MISIR CİPSİ', price: '42,00 TL', art: '🌽', barcode: '1234567890037' },
      { name: 'MEYVE BARI (Atom)', price: '20,00 TL', art: '🍯', barcode: '1234567890038' },
      { name: 'KRAKER (Baharatlı)', price: '15,00 TL', art: '🥨', barcode: '1234567890039' }
    ],
    sut: [
      { name: 'TAM YAĞLI SÜT (1L)', price: '34,50 TL', art: '🥛', barcode: '1234567890040' },
      { name: 'YOĞURT (2kg)', price: '65,00 TL', art: '🥣', barcode: '1234567890041' },
      { name: 'BEYAZ PEYNİR (500g)', price: '120,00 TL', art: '🧀', barcode: '1234567890042' },
      { name: 'KAŞAR PEYNİRİ (400g)', price: '145,00 TL', art: '🧀', barcode: '1234567890043' },
      { name: 'TEREYAĞI (250g)', price: '95,00 TL', art: '🧈', barcode: '1234567890044' },
      { name: 'AYRAN (1.5L)', price: '28,00 TL', art: '🥤', barcode: '1234567890045' },
      { name: 'KAYMAK (200g)', price: '70,00 TL', art: '🍯', barcode: '1234567890046' },
      { name: 'KEFİR (1L)', price: '42,00 TL', art: '🥛', barcode: '1234567890047' },
      { name: 'LABNE (200g)', price: '35,00 TL', art: '🥣', barcode: '1234567890048' },
      { name: 'SÜZME YOĞURT (900g)', price: '85,00 TL', art: '🥣', barcode: '1234567890049' }
    ],
    temizlik: [
      { name: 'ÇAMAŞIR DETERJANI (5kg)', price: '185,00 TL', art: '🧺', barcode: '1234567890050' },
      { name: 'YUMUŞATICI (1.5L)', price: '65,00 TL', art: '🌸', barcode: '1234567890051' },
      { name: 'BULAŞIK DETERJANI (Tablet)', price: '210,00 TL', art: '🍽️', barcode: '1234567890052' },
      { name: 'SIVI BULAŞIK DETERJANI', price: '45,00 TL', art: '🧼', barcode: '1234567890053' },
      { name: 'YÜZEY TEMİZLEYİCİ (2L)', price: '55,00 TL', art: '✨', barcode: '1234567890054' },
      { name: 'ÇAMAŞIR SUYU (1L)', price: '38,00 TL', art: '🧪', barcode: '1234567890055' },
      { name: 'CAM TEMİZLEYİCİ', price: '32,00 TL', art: '🪟', barcode: '1234567890056' },
      { name: 'SIVI SABUN (500ml)', price: '42,00 TL', art: '🧼', barcode: '1234567890057' },
      { name: 'KAĞIT HAVLU (6\'lı)', price: '85,00 TL', art: '🧻', barcode: '1234567890058' },
      { name: 'TUVALET KAĞIDI (16\'lı)', price: '140,00 TL', art: '🧻', barcode: '1234567890059' }
    ],
  } as Record<string, Array<{ name: string; price: string; art: string; barcode: string }>>), []);

  const allProducts = useMemo(() => Object.values(productsByCategory).flat(), [productsByCategory]);

  const activeProducts = useMemo(() => {
    if (searchTerm.trim()) {
      const normalize = (s: string) =>
        s.toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim();
      const term = normalize(searchTerm);
      return allProducts.filter(p => normalize(p.name).includes(term));
    }
    if (activeCategoryId) return productsByCategory[activeCategoryId] ?? [];
    return [];
  }, [searchTerm, activeCategoryId, allProducts, productsByCategory]);

  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(',', '.').replace(' TL', '')) || 0;
  };

  const handleProductClick = (p: { name: string; price: string; art: string }) => {
    const catId =
      activeCategoryId ??
      Object.entries(productsByCategory).find(([, prods]) =>
        prods.some(x => x.name === p.name)
      )?.[0];

    if (catId && weightCategories.includes(catId)) {
      setScaleKg('');
      setScaleModal({ product: p });
    } else {
      addToCart(p);
    }
  };

  const addToCart = (
    product: { name: string; price: string; art: string },
    customQty?: number,
    kg?: number
  ) => {
    const basePrice = parsePrice(product.price);

    if (kg !== undefined && kg > 0) {
      const numericPrice = parseFloat((basePrice * kg).toFixed(2));
      const displayPrice = `${numericPrice.toFixed(2).replace('.', ',')} TL`;
      const itemName = `${product.name} (${kg.toFixed(3)} kg)`;

      setCart(prev => [
        ...prev,
        {
          name: itemName,
          price: displayPrice,
          numericPrice,
          qty: 1,
          art: product.art
        }
      ]);
      return;
    }

    const qtyToAdd = customQty !== undefined
      ? customQty
      : (quantityInput ? parseInt(quantityInput) || 1 : 1);
    if (qtyToAdd < 1) return;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.name === product.name);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].qty += qtyToAdd;
        return updated;
      }
      return [
        ...prev,
        {
          name: product.name,
          price: product.price,
          numericPrice: basePrice,
          qty: qtyToAdd,
          art: product.art
        }
      ];
    });

    setQuantityInput('');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    if (selectedCartIndex === index) {
      setSelectedCartIndex(null);
    } else if (selectedCartIndex !== null && selectedCartIndex > index) {
      setSelectedCartIndex(selectedCartIndex - 1);
    }
  };

  // DÜZELTİLMİŞ: changeQuantity fonksiyonu - immutable update kullanıyor
  const changeQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const item = prev[index];
      if (!item) return prev;
      
      const newQty = item.qty + delta;
      if (newQty < 1) {
        // Miktar 0 ve altına düşerse ürünü sepetten kaldır
        return prev.filter((_, i) => i !== index);
      }
      
      // Immutable update: map kullanarak yeni array oluştur
      return prev.map((item, i) => 
        i === index ? { ...item, qty: newQty } : item
      );
    });
  };

  const selectCartRow = (index: number) => {
    setSelectedCartIndex(index);
  };

  const handleDeleteRow = () => {
    if (selectedCartIndex !== null && selectedCartIndex >= 0 && selectedCartIndex < cart.length) {
      removeFromCart(selectedCartIndex);
    }
  };

  // İPTAL butonu - sepetteki tüm ürünleri siler
  const handleCancelCart = () => {
    if (cart.length === 0) return;
    if (window.confirm('Sepetteki tüm ürünler silinecek. Emin misiniz?')) {
      setCart([]);
      setSelectedCartIndex(null);
    }
  };

  // Beklet fonksiyonu - sepeti beklet veya geri yükle
  const handleHoldCart = () => {
    if (heldCart === null) {
      // Sepeti beklet
      if (cart.length > 0) {
        setHeldCart([...cart]);
        setCart([]);
        setSelectedCartIndex(null);
      }
    } else {
      // Bekletilen sepeti geri yükle
      setCart(heldCart);
      setHeldCart(null);
      setSelectedCartIndex(null);
    }
  };

  // Mevcut sepet toplamı (SOL PANEL - Sepetteki ürünler)
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.numericPrice * item.qty, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2).replace('.', ','),
      tax: tax.toFixed(2).replace('.', ','),
      discount: '0,00',
      total: total.toFixed(2).replace('.', ','),
      totalItems: cart.reduce((sum, item) => sum + item.qty, 0)
    };
  }, [cart]);

  // Bekletilen sepet toplamı (SAĞ PANEL - Bekletilen ürünler)
  const heldTotals = useMemo(() => {
    if (!heldCart || heldCart.length === 0) return null;
    const subtotal = heldCart.reduce((sum, item) => sum + item.numericPrice * item.qty, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2).replace('.', ','),
      tax: tax.toFixed(2).replace('.', ','),
      total: total.toFixed(2).replace('.', ','),
      totalItems: heldCart.reduce((sum, item) => sum + item.qty, 0)
    };
  }, [heldCart]);

  const handleKeypad = (key: string) => {
    if (key === 'C') {
      setQuantityInput('');
    } else if (key === 'Enter') {
      const currentQtyStr = quantityInput.trim();
      if (!currentQtyStr) return;
      const qty = parseInt(currentQtyStr);
      if (isNaN(qty) || qty < 1 || activeProducts.length === 0) {
        setQuantityInput('');
        return;
      }
      addToCart(activeProducts[0], qty);
    } else {
      setQuantityInput(prev => (prev + key).slice(0, 5));
    }
  };

  const openPaymentModal = (type: PaymentType) => {
    if (cart.length === 0) return;
    setPaymentModal(type);
  };

  const closePaymentModal = () => {
    setPaymentModal(null);
  };

  const handleProductUpdate = () => {
    const allProductsData = Object.entries(productsByCategory).flatMap(([category, products]) =>
      products.map(p => ({ ...p, category }))
    );
    localStorage.setItem('products_data', JSON.stringify(allProductsData));
    navigate('/product-update');
  };

  const handleReports = () => {
    navigate('/reports');
  };

  const printReceipt = () => {
    const receiptWindow = window.open('', '_blank', 'width=400,height=600');
    if (!receiptWindow) return;

    const receiptDate = new Date().toLocaleString('tr-TR');
    const paymentTypeText = paymentModal === 'nakit' ? 'NAKİT' : 
                           paymentModal === 'kredi' ? 'KREDİ KARTI' : 'AÇIK HESAP';
    
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fiş</title>
        <style>
          body { 
            font-family: 'Courier New', monospace; 
            padding: 20px; 
            width: 320px;
            margin: 0 auto;
          }
          .header { text-align: center; margin-bottom: 20px; }
          .store-name { font-size: 18px; font-weight: bold; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px; }
          .item-name { flex: 1; }
          .item-qty { width: 40px; text-align: center; }
          .item-price { width: 60px; text-align: right; }
          .totals { margin-top: 15px; }
          .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .grand-total { font-size: 16px; font-weight: bold; margin-top: 10px; }
          .footer { text-align: center; margin-top: 20px; font-size: 11px; }
          .payment-type { text-align: center; margin: 10px 0; font-weight: bold; }
          @media print {
            body { width: 80mm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="store-name">${storeName}</div>
          <div>${receiptDate}</div>
        </div>
        
        <div class="divider"></div>
        
        ${cart.map(item => `
          <div class="item">
            <span class="item-name">${item.name}</span>
            <span class="item-qty">x${item.qty}</span>
            <span class="item-price">${(item.numericPrice * item.qty).toFixed(2).replace('.', ',')} TL</span>
          </div>
        `).join('')}
        
        <div class="divider"></div>
        
        <div class="totals">
          <div class="total-row">
            <span>Ara Toplam:</span>
            <span>${totals.subtotal} TL</span>
          </div>
          <div class="total-row">
            <span>KDV (%8):</span>
            <span>${totals.tax} TL</span>
          </div>
          <div class="total-row">
            <span>İndirim:</span>
            <span>${totals.discount} TL</span>
          </div>
          <div class="total-row grand-total">
            <span>TOPLAM:</span>
            <span>${totals.total} TL</span>
          </div>
        </div>
        
        <div class="payment-type">ÖDEME: ${paymentTypeText}</div>
        
        <div class="divider"></div>
        
        <div class="footer">
          Teşekkürler! Yine bekleriz.<br>
          Fiş No: ${Date.now().toString().slice(-6)}
        </div>
        
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; cursor: pointer;">
            Fişi Yazdır
          </button>
        </div>
      </body>
      </html>
    `;
    
    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
    
    setCart([]);
    setSelectedCartIndex(null);
    setPaymentModal(null);
  };

  const getPaymentTitle = () => {
    switch(paymentModal) {
      case 'nakit': return 'Nakit Ödeme';
      case 'kredi': return 'Kredi Kartı';
      case 'acik': return 'Açık Hesap';
      default: return '';
    }
  };

  return (
    <div className="pos">
      <div className="posGrid">
        <aside className="left">
          <div className="brandRow">
            <div className="brand">{storeName}</div>
            <div className="dt">
              <div className="pill">
                <div className="pillLabel">TARİH:</div>
                <div className="pillValue">
                  {now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
              </div>
              <div className="pill">
                <div className="pillLabel">SAAT:</div>
                <div className="pillValue">
                  {now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            <button className="menuBtn" type="button">
              <span className="menuIco" aria-hidden="true">☰</span>
              <span className="menuTxt">MENÜ</span>
            </button>
          </div>

          <div className="searchKeypadRow">
            <div className="searchSection">
              <label className="field">
                <div className="fieldLabel">Ürün Ara</div>
                <input
                  className="fieldInput"
                  placeholder="Ürün adı veya barkod..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
            </div>

            <div className="keypadSection">
              <div className="fieldLabel">Adet Girişi</div>
              <div className="keypadThreeRow">
                <div className="keypadRow">
                  <button
                    type="button"
                    onClick={() => handleKeypad('.')}
                    className="keypadBtn dotBtn"
                  >
                    .
                  </button>
                  {['1','2','3','4','5'].map(key => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleKeypad(key)}
                      className="keypadBtn"
                    >
                      {key}
                    </button>
                  ))}
                </div>
                <div className="keypadRow fiveKeys">
                  {['6','7','8','9','0'].map(key => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleKeypad(key)}
                      className="keypadBtn"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bottomKeypadRow">
                <div className="qtyDisplayCompact">
                  <span className="qtyLabelSmall">Adet:</span>
                  <span className="qtyValueCompact">{quantityInput || '-'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleKeypad('C')}
                  className="keypadBtn clearBtn medium"
                >
                  C
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypad('Enter')}
                  className="keypadBtn enterBtn medium"
                >
                  ↵
                </button>
              </div>
            </div>
          </div>

          <div className="cart">
            <div className="cartHead">
              <div className="cartCols">
                <span>Sil</span>
                <span>Ürün</span>
                <span>Adet</span>
                <span>Fiyat</span>
                <span>Toplam</span>
              </div>
            </div>
            <div className="cartRows">
              {cart.length === 0 ? (
                <div className={`emptyCartMessage ${heldCart ? 'holding' : ''}`}>
                  {heldCart ? 'Bekletilen sepet geri yüklenmeyi bekliyor. "Beklet" butonuna basarak geri yükleyebilirsiniz.' : 'Sepetiniz boş. Ürün eklemek için kategorilerden bir ürün seçin.'}
                </div>
              ) : (
                cart.map((item, index) => {
                  const lineTotal = (item.numericPrice * item.qty).toFixed(2).replace('.', ',');
                  const isSelected = selectedCartIndex === index;
                  return (
                    <div 
                      className="cartRow compact" 
                      key={index}
                      onClick={() => selectCartRow(index)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#e8f5ee' : 'transparent',
                        border: isSelected ? '2px solid #4a8f6b' : '2px solid transparent',
                        borderRadius: isSelected ? '8px' : '0',
                        transition: 'all 0.2s'
                      }}
                    >
                      <button 
                        className="mini deleteBtn small" 
                        type="button" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromCart(index);
                        }}
                      >
                        ×
                      </button>
                      <div className="cartNameCompact">
                        <div className="productNameCompact">{item.name}</div>
                      </div>
                      <div></div>
                      <div className="cartControls compact">
                        <button 
                          className="mini small" 
                          type="button" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            changeQuantity(index, -1);
                          }}
                        >
                          −
                        </button>
                        <button 
                          className="mini small" 
                          type="button" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            changeQuantity(index, 1);
                          }}
                        >
                          ＋
                        </button>
                      </div>
                      <div className="cartCalc compact">
                        <div className="calc small">{item.qty} × {item.price}</div>
                        <div className="sum small">{lineTotal}</div>
                        <div className="try small" aria-hidden="true">₺</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="cartItemCount">
                <span className="itemCountLabel">Sepetteki Ürünler:</span>
                <span className="itemCountValue">{totals.totalItems} adet</span>
                {selectedCartIndex !== null && (
                  <span style={{ marginLeft: 12, color: '#4a8f6b', fontWeight: 600 }}>
                    (Satır {selectedCartIndex + 1} seçili)
                  </span>
                )}
              </div>
            )}

            <div className="barcodeRow">
              <div className="totalDisplayBox">
                <span className="totalDisplayLabel">TOPLAM ÖDENECEK:</span>
                <span className="totalDisplayValue">{totals.total} ₺</span>
              </div>
              
              <button 
                className={`softBtn holdBtn ${heldCart ? 'active' : ''}`} 
                type="button"
                onClick={handleHoldCart}
              >
                {heldCart ? '⏳ Geri Yükle' : '⏸️ Beklet'}
              </button>
              
              <button 
                className="softBtn softDanger" 
                type="button"
                onClick={handleDeleteRow}
                disabled={selectedCartIndex === null}
                style={{
                  opacity: selectedCartIndex === null ? 0.5 : 1,
                  cursor: selectedCartIndex === null ? 'not-allowed' : 'pointer'
                }}
              >
                Satır Sil
              </button>
            </div>

            <div className="payRow">
              <button 
                className="payBtn cash" 
                type="button"
                onClick={() => openPaymentModal('nakit')}
                disabled={cart.length === 0}
              >
                <span className="payIcon" aria-hidden="true">💵</span> Nakit
              </button>
              <button 
                className="payBtn card" 
                type="button"
                onClick={() => openPaymentModal('kredi')}
                disabled={cart.length === 0}
              >
                <span className="payIcon" aria-hidden="true">💳</span> K. Kartı
              </button>
              <button 
                className="payBtn open" 
                type="button"
                onClick={() => openPaymentModal('acik')}
                disabled={cart.length === 0}
              >
                <span className="payIcon" aria-hidden="true">🧾</span> Açık Hesap
              </button>
              <button className="payBtn change" type="button">
                <span className="payIcon" aria-hidden="true">🪙</span> Para Üstü
              </button>
            </div>
          </div>
        </aside>

        <main className="right">
          <div className="cats">
            {categories.map((c) => {
              const active = c.id === activeCategoryId;
              return (
                <button
                  className={`cat ${active ? 'active' : ''}`}
                  type="button"
                  key={c.id}
                  data-cat-id={c.id}
                  onClick={() => {
                    setActiveCategoryId(c.id);
                    setSearchTerm('');
                  }}
                >
                  <div className="catIco" aria-hidden="true">{c.icon}</div>
                  <div className="catLbl">{c.label}</div>
                </button>
              );
            })}
          </div>

          <div className="productsWrap">
            <div className="products">
              {activeProducts.length === 0 ? (
                <div className="emptyProducts">
                  {searchTerm ? 'Aradığınız ürün bulunamadı.' : 'Lütfen bir kategori seçin veya ürün arayın.'}
                </div>
              ) : (
                activeProducts.map((p, idx) => (
                  <button
                    className="prod"
                    type="button"
                    key={idx}
                    onClick={() => handleProductClick(p)}
                  >
                    <div className="prodImg" aria-hidden="true">{p.art}</div>
                    <div className="prodName">{p.name}</div>
                    <div className="prodPrice">{p.price}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* SAĞ PANEL: Sadece bekletilen ürünlerin toplamı gösterilir */}
          <div className="totalBar">
            <div className="totalMid">
              {heldTotals ? (
                <>
                  <div className="totalTitle">BEKLETİLEN TOPLAM:</div>
                  <div className="totalValue held">{heldTotals.total} ₺</div>
                  <div className="heldItemCount">({heldTotals.totalItems} ürün)</div>
                </>
              ) : (
                <>
                  <div className="totalTitle">BEKLETİLEN YOK</div>
                  <div className="totalValue empty">0,00 ₺</div>
                </>
              )}
            </div>
          </div>

          <div className="bottomBar">
            <button 
              type="button"
              onClick={handleCancelCart}
              disabled={cart.length === 0}
              style={{ 
                background: cart.length === 0 ? '#ccc' : '#dc3545', 
                color: 'white', 
                fontWeight: 'bold',
                opacity: cart.length === 0 ? 0.5 : 1,
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ❌ İptal
            </button>
            <button type="button">F9 - Ödeme Al</button>
            <button 
              type="button" 
              onClick={() => navigate('/product-update')}
              style={{ background: '#4a8f6b', color: 'white', fontWeight: 'bold' }}
            >
              📝 Ürün Güncelle
            </button>
            <button 
              type="button"
              onClick={handleReports}
              style={{ background: '#2196f3', color: 'white', fontWeight: 'bold' }}
            >
              📊 Raporlar
            </button>
            <button type="button">Stok Seç</button>
          </div>
        </main>
      </div>

      {scaleModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#faf7f2', borderRadius: 18, padding: 28, width: 340,
            border: '1px solid #d9d3c8', display: 'grid', gap: 18
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 44, lineHeight: 1 }}>{scaleModal.product.art}</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: 17, color: '#2b2823' }}>
                  {scaleModal.product.name}
                </div>
                <div style={{ color: '#6a655d', fontSize: 13, marginTop: 2 }}>
                  Birim fiyat: {scaleModal.product.price}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#6a655d', fontSize: 13, marginBottom: 6 }}>
                Tartı Ağırlığı (kg)
              </div>
              <input
                type="number"
                step="0.001"
                min="0"
                placeholder="0.000"
                value={scaleKg}
                onChange={e => setScaleKg(e.target.value)}
                autoFocus
                style={{
                  width: '100%', height: 56, borderRadius: 12,
                  border: '2px solid #4a8f6b', fontSize: 26, fontWeight: 900,
                  textAlign: 'center', outline: 'none', color: '#2d4b45',
                  background: '#fff', boxSizing: 'border-box'
                }}
              />
            </div>

            {scaleKg && parseFloat(scaleKg) > 0 && (
              <div style={{
                background: '#e8f5ee', borderRadius: 12, padding: '10px 16px',
                fontWeight: 900, color: '#2d4b45', fontSize: 16, textAlign: 'center',
                border: '1px solid #b2d8c0'
              }}>
                Toplam: {(parsePrice(scaleModal.product.price) * parseFloat(scaleKg))
                  .toFixed(2).replace('.', ',')} TL
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                onClick={() => setScaleModal(null)}
                style={{
                  height: 48, borderRadius: 12, border: '1px solid #d9d3c8',
                  background: '#f4efe6', fontWeight: 800, cursor: 'pointer',
                  fontSize: 15, color: '#2b2823'
                }}
              >
                İptal
              </button>
              <button
                type="button"
                disabled={!scaleKg || parseFloat(scaleKg) <= 0}
                onClick={() => {
                  const kg = parseFloat(scaleKg);
                  if (kg > 0) {
                    addToCart(scaleModal.product, undefined, kg);
                    setScaleModal(null);
                  }
                }}
                style={{
                  height: 48, borderRadius: 12, border: '1px solid #4a8f6b',
                  background: '#2d4b45', color: '#fff', fontWeight: 800,
                  cursor: 'pointer', fontSize: 15,
                  opacity: (!scaleKg || parseFloat(scaleKg) <= 0) ? 0.4 : 1
                }}
              >
                Sepete Ekle ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100,
          padding: 20
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, width: '100%', maxWidth: 420,
            maxHeight: '90vh', overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid #e5e5e5',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#2d4b45'
            }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>
                {getPaymentTitle()}
              </div>
              <button
                onClick={closePaymentModal}
                style={{
                  background: 'none', border: 'none', color: '#fff', fontSize: 28,
                  cursor: 'pointer', padding: '0 4px', lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              padding: 24, background: '#f8f9fa', fontFamily: '"Courier New", monospace',
              borderBottom: '1px solid #e5e5e5'
            }}>
              <div style={{
                background: '#fff', padding: 20, borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px dashed #ccc'
              }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>{storeName}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {now.toLocaleString('tr-TR')}
                  </div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                    Fiş No: {Date.now().toString().slice(-6)}
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '12px 0' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: 13, margin: '6px 0', lineHeight: 1.4
                    }}>
                      <span style={{ flex: 1 }}>{item.name}</span>
                      <span style={{ margin: '0 8px' }}>x{item.qty}</span>
                      <span style={{ textAlign: 'right', minWidth: 70 }}>
                        {(item.numericPrice * item.qty).toFixed(2).replace('.', ',')} TL
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                    <span>Ara Toplam:</span>
                    <span>{totals.subtotal} TL</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                    <span>KDV (%8):</span>
                    <span>{totals.tax} TL</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                    <span>İndirim:</span>
                    <span>{totals.discount} TL</span>
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    margin: '12px 0 0 0', paddingTop: 12,
                    borderTop: '2px solid #000', fontSize: 16, fontWeight: 'bold'
                  }}>
                    <span>TOPLAM:</span>
                    <span>{totals.total} TL</span>
                  </div>
                </div>

                <div style={{
                  textAlign: 'center', marginTop: 16, paddingTop: 12,
                  borderTop: '1px dashed #000', fontWeight: 'bold', fontSize: 14,
                  color: '#2d4b45'
                }}>
                  ÖDEME: {paymentModal === 'nakit' ? 'NAKİT' : paymentModal === 'kredi' ? 'KREDİ KARTI' : 'AÇIK HESAP'}
                </div>

                <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: '#666' }}>
                  Teşekkürler! Yine bekleriz.
                </div>
              </div>
            </div>

            <div style={{
              padding: '20px 24px', background: '#fff'
            }}>
              <button
                onClick={printReceipt}
                style={{
                  width: '100%', padding: '16px 20px', borderRadius: 10, border: 'none',
                  background: '#2d4b45', color: '#fff', fontSize: 16,
                  fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(45,75,69,0.3)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#1f3531';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#2d4b45';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🖨️ Fiş Çıktısı Al
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;