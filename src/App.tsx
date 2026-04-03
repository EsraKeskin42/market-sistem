import { useEffect, useMemo, useState, useCallback } from 'react';
import './App.css';

interface CartItem {
  name: string;
  price: string;
  numericPrice: number;
  qty: number;
  art: string;
}

function App() {
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
      { name: 'MUZ', price: '25,00 TL', art: '🍌' },
      { name: 'ELMA (kg)', price: '20,00 TL', art: '🍎' },
      { name: 'ÇİLEK (Paket)', price: '35,00 TL', art: '🍓' },
      { name: 'KARPUZ (kg)', price: '8,00 TL', art: '🍉' },
      { name: 'ÜZÜM', price: '30,00 TL', art: '🍇' },
      { name: 'LİMON', price: '18,00 TL', art: '🍋' },
    ],
    sebze: [
      { name: 'DOMATES (kg)', price: '25,00 TL', art: '🍅' },
      { name: 'SALATALIK (kg)', price: '20,00 TL', art: '🥒' },
      { name: 'BİBER (kg)', price: '30,00 TL', art: '🫑' },
      { name: 'PATLICAN (kg)', price: '28,00 TL', art: '🍆' },
      { name: 'PATATES (kg)', price: '18,00 TL', art: '🥔' },
      { name: 'SOĞAN (kg)', price: '15,00 TL', art: '🧅' },
      { name: 'HAVUÇ (kg)', price: '17,00 TL', art: '🥕' },
      { name: 'BROKOLİ (Adet)', price: '35,00 TL', art: '🥦' },
      { name: 'MISIR (Adet)', price: '12,00 TL', art: '🌽' },
      { name: 'SARIMSAK (Demet)', price: '40,00 TL', art: '🧄' }
    ],
    bakliyat: [
      { name: 'KURU FASULYE (kg)', price: '85,00 TL', art: '⚪' },
      { name: 'KIRMIZI MERCİMEK (kg)', price: '45,00 TL', art: '🟠' },
      { name: 'NOHUT (kg)', price: '75,00 TL', art: '🤎' },
      { name: 'PİRİNÇ (Osmancık kg)', price: '60,00 TL', art: '🍚' },
      { name: 'BULGUR (Pilavlık kg)', price: '35,00 TL', art: '🌾' },
      { name: 'YEŞİL MERCİMEK (kg)', price: '55,00 TL', art: '🟢' },
      { name: 'BARBUNYA (kg)', price: '95,00 TL', art: '🥜' },
      { name: 'MISIR PATLATMALIK (kg)', price: '40,00 TL', art: '🍿' }
    ],
    atis: [
      { name: 'SÜTLÜ ÇİKOLATA', price: '22,50 TL', art: '🍫' },
      { name: 'TUZLU FISTIK (Paket)', price: '30,00 TL', art: '🥜' },
      { name: 'PATATES CİPSİ (Large)', price: '45,00 TL', art: '🥔' },
      { name: 'BİSKÜVİ (Tam Buğday)', price: '18,50 TL', art: '🍪' },
      { name: 'KEK (Meyveli)', price: '12,00 TL', art: '🧁' },
      { name: 'GOFRET (Fındıklı)', price: '10,00 TL', art: '🧇' },
      { name: 'JELİBON', price: '25,00 TL', art: '🍬' },
      { name: 'MISIR CİPSİ', price: '42,00 TL', art: '🌽' },
      { name: 'MEYVE BARI (Atom)', price: '20,00 TL', art: '🍯' },
      { name: 'KRAKER (Baharatlı)', price: '15,00 TL', art: '🥨' }
    ],
    sut: [
      { name: 'TAM YAĞLI SÜT (1L)', price: '34,50 TL', art: '🥛' },
      { name: 'YOĞURT (2kg)', price: '65,00 TL', art: '🥣' },
      { name: 'BEYAZ PEYNİR (500g)', price: '120,00 TL', art: '🧀' },
      { name: 'KAŞAR PEYNİRİ (400g)', price: '145,00 TL', art: '🧀' },
      { name: 'TEREYAĞI (250g)', price: '95,00 TL', art: '🧈' },
      { name: 'AYRAN (1.5L)', price: '28,00 TL', art: '🥤' },
      { name: 'KAYMAK (200g)', price: '70,00 TL', art: '🍯' },
      { name: 'KEFİR (1L)', price: '42,00 TL', art: '🥛' },
      { name: 'LABNE (200g)', price: '35,00 TL', art: '🥣' },
      { name: 'SÜZME YOĞURT (900g)', price: '85,00 TL', art: '🥣' }
    ],
    temizlik: [
      { name: 'ÇAMAŞIR DETERJANI (5kg)', price: '185,00 TL', art: '🧺' },
      { name: 'YUMUŞATICI (1.5L)', price: '65,00 TL', art: '🌸' },
      { name: 'BULAŞIK DETERJANI (Tablet)', price: '210,00 TL', art: '🍽️' },
      { name: 'SIVI BULAŞIK DETERJANI', price: '45,00 TL', art: '🧼' },
      { name: 'YÜZEY TEMİZLEYİCİ (2L)', price: '55,00 TL', art: '✨' },
      { name: 'ÇAMAŞIR SUYU (1L)', price: '38,00 TL', art: '🧪' },
      { name: 'CAM TEMİZLEYİCİ', price: '32,00 TL', art: '🪟' },
      { name: 'SIVI SABUN (500ml)', price: '42,00 TL', art: '🧼' },
      { name: 'KAĞIT HAVLU (6\'lı)', price: '85,00 TL', art: '🧻' },
      { name: 'TUVALET KAĞIDI (16\'lı)', price: '140,00 TL', art: '🧻' }
    ],
  } as Record<string, Array<{ name: string; price: string; art: string }>>), []);

  const allProducts = useMemo(() => Object.values(productsByCategory).flat(), [productsByCategory]);

  const activeProducts = useMemo(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      return allProducts.filter(p => p.name.toLowerCase().includes(term));
    }
    if (activeCategoryId) return productsByCategory[activeCategoryId] ?? [];
    return [];
  }, [searchTerm, activeCategoryId, allProducts, productsByCategory]);

  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(',', '.').replace(' TL', '')) || 0;
  };

  // ====================== ÜRÜN EKLEME ======================
  const addToCart = useCallback((product: { name: string; price: string; art: string }, customQty?: number) => {
    const qtyToAdd = customQty !== undefined 
      ? customQty 
      : (quantityInput ? parseInt(quantityInput) || 1 : 1);

    if (qtyToAdd < 1) return;

    const numericPrice = parsePrice(product.price);

    setCart((prev) => {
      const existingIndex = prev.findIndex(item => item.name === product.name);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].qty += qtyToAdd;
        return updated;
      } else {
        return [...prev, {
          name: product.name,
          price: product.price,
          numericPrice,
          qty: qtyToAdd,
          art: product.art
        }];
      }
    });

    setQuantityInput('');
  }, [quantityInput]);

  // ====================== KEYPAD ENTER (EN ÖNEMLİ DÜZELTME) ======================
  const handleKeypadEnter = useCallback(() => {
    const currentInput = quantityInput.trim();
    if (!currentInput || activeProducts.length === 0) {
      setQuantityInput('');
      return;
    }

    const qty = parseInt(currentInput);
    if (isNaN(qty) || qty < 1) {
      setQuantityInput('');
      return;
    }

    // En güncel değeri kullanarak ekle
    addToCart(activeProducts[0], qty);
  }, [quantityInput, activeProducts, addToCart]);

  const handleKeypad = (key: string) => {
    if (key === 'C') {
      setQuantityInput('');
    } else if (key === 'Enter') {
      handleKeypadEnter();
    } else {
      setQuantityInput(prev => (prev + key).slice(0, 5));
    }
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const changeQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const newCart = [...prev];
      const newQty = newCart[index].qty + delta;
      if (newQty < 1) return newCart.filter((_, i) => i !== index);
      newCart[index].qty = newQty;
      return newCart;
    });
  };

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

          <div className="searchRow">
            <label className="field">
              <div className="fieldLabel">Ürün</div>
              <input
                className="fieldInput"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>

            <div className="keypad">
              {['1','2','3','4','5','6','7','8','9','0','C','Enter'].map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeypad(key)}
                  className={key === 'Enter' ? 'enterBtn' : ''}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="quantityDisplay">
              <div className="fieldLabel">Adet</div>
              <div className="qtyValue">{quantityInput || '—'}</div>
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
                <div className="emptyCartMessage">
                  Sepetiniz boş. Ürün eklemek için kategorilerden bir ürün seçin.
                </div>
              ) : (
                cart.map((item, index) => {
                  const lineTotal = (item.numericPrice * item.qty).toFixed(2).replace('.', ',');
                  return (
                    <div className="cartRow compact" key={index}>
                      <button className="mini deleteBtn small" type="button" onClick={() => removeFromCart(index)}>×</button>
                      <div className="cartNameCompact">
                        <div className="productNameCompact">{item.name}</div>
                      </div>
                      <div></div>
                      <div className="cartControls compact">
                        <button className="mini small" type="button" onClick={() => changeQuantity(index, -1)}>−</button>
                        <button className="mini small" type="button" onClick={() => changeQuantity(index, 1)}>＋</button>
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
              </div>
            )}

            <div className="barcodeRow">
              <div className="barcodeInput">
                <span className="barcodeIcon" aria-hidden="true">▥</span>
                <input placeholder="Barkod Okutunuz." />
                <span className="barcodePict" aria-hidden="true">▮▯▮▯</span>
              </div>
              <button className="softBtn" type="button">Fiyat Gör</button>
              <button className="softBtn softDanger" type="button">Satır Sil</button>
            </div>

            <div className="payRow">
              <button className="payBtn cash" type="button">
                <span className="payIcon" aria-hidden="true">📷</span> Nakit
              </button>
              <button className="payBtn card" type="button">
                <span className="payIcon" aria-hidden="true">💳</span> K. Kartı
              </button>
              <button className="payBtn open" type="button">
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
                    onClick={() => addToCart(p)}
                  >
                    <div className="prodImg" aria-hidden="true">{p.art}</div>
                    <div className="prodName">{p.name}</div>
                    <div className="prodPrice">{p.price}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="totalBar">
            <div className="totalLeft">
              <div className="barcodes">
                <div className="barcodeBox" aria-hidden="true">▮▯▮▯▮▯</div>
                <div className="barcodeBox" aria-hidden="true">▮▮▯▯▮▮</div>
              </div>
              <div className="subBtns">
                <button className="miniAction" type="button">Ekran Resmi</button>
                <button className="miniAction" type="button">İndirim</button>
                <button className="miniAction" type="button">Bekleme</button>
              </div>
            </div>
            <div className="totalMid">
              <div className="totalTitle">TOPLAM ÖDENECEK:</div>
              <div className="totalValue">{totals.total} ₺</div>
            </div>
            <div className="totalRight">
              <div className="totals">
                <div><span>Ara Toplam:</span><b>{totals.subtotal}</b></div>
                <div><span>Toplam Kdv:</span><b>{totals.tax}</b></div>
                <div><span>İndirim:</span><b>{totals.discount}</b></div>
              </div>
            </div>
          </div>

          <div className="bottomBar">
            <button type="button">F3 - Fiş İptal</button>
            <button type="button">F9 - Ödeme Al</button>
            <button type="button">Stok Seç</button>
            <button type="button">Raporlar</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;