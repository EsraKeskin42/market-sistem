import { useEffect, useMemo, useState } from 'react'
import './App.css'

interface CartItem {
  name: string
  price: string
  numericPrice: number
  qty: number
  art: string
}

function App() {
  const win = globalThis as any
  const cityFromElectron = win?.market?.city as string | null | undefined

  const [storeName] = useState(() => {
    const cityFromStorage =
      typeof window !== 'undefined' ? window.localStorage.getItem('market_city') : null
    return cityFromElectron || cityFromStorage || 'GAZİANTEP'
  })

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())
  const [cart, setCart] = useState<CartItem[]>([])

  // Saat güncellemesi
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Electron'dan şehir gelirse kaydet
  useEffect(() => {
    if (!cityFromElectron) return
    try {
      window.localStorage.setItem('market_city', cityFromElectron)
    } catch {}
  }, [cityFromElectron])

  const categories = useMemo(() => [
    { id: 'meyve', label: 'MEYVE', icon: '🍌' },
    { id: 'sebze', label: 'SEBZE', icon: '🥕' },
    { id: 'bakliyat', label: 'BAKLİYAT', icon: '🫘' },
    { id: 'atis', label: 'ATIŞTIRMALIK', icon: '🍪' },
    { id: 'sut', label: 'SÜT ÜRÜNLERİ', icon: '🥛' },
    { id: 'temizlik', label: 'TEMİZLİK\nMALZEMELERİ', icon: '🧽' },
  ], [])

  // ====================== ÜRÜN VERİLERİ ======================
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
  } as Record<string, Array<{ name: string; price: string; art: string }>>), [])

  const activeProducts = useMemo(() => {
    if (!activeCategoryId) return []
    return productsByCategory[activeCategoryId] ?? []
  }, [activeCategoryId, productsByCategory])

  // Fiyatı sayıya çevirme
  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(',', '.').replace(' TL', ''))
  }

  // Sepete ürün ekleme
  const addToCart = (product: { name: string; price: string; art: string }) => {
    const numericPrice = parsePrice(product.price)

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.name === product.name)

      if (existingIndex !== -1) {
        // Aynı ürün varsa adet artır
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + 1
        }
        return updated
      } else {
        // Yeni ürün ekle
        return [
          ...prev,
          { name: product.name, price: product.price, numericPrice, qty: 1, art: product.art }
        ]
      }
    })
  }

  // Sepetten ürün tamamen silme
  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  // Adet değiştirme (artırma / azaltma)
  const changeQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const newCart = [...prev]
      const currentQty = newCart[index].qty
      const newQty = currentQty + delta

      if (newQty < 1) {
        return newCart.filter((_, i) => i !== index)
      }

      newCart[index] = {
        ...newCart[index],
        qty: newQty
      }

      return newCart
    })
  }

  // Toplamları hesaplama
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.numericPrice * item.qty, 0)
    const tax = subtotal * 0.08 // %8 KDV
    const discount = 0
    const total = subtotal + tax - discount

    return {
      subtotal: subtotal.toFixed(2).replace('.', ','),
      tax: tax.toFixed(2).replace('.', ','),
      discount: discount.toFixed(2).replace('.', ','),
      total: total.toFixed(2).replace('.', ',')
    }
  }, [cart])

  return (
    <div className="pos">
      <div className="posGrid">
        <aside className="left">
          {/* Brand Row */}
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

          {/* Search Row */}
          <div className="searchRow">
            <label className="field">
              <div className="fieldLabel">Ürün</div>
              <input className="fieldInput" placeholder="Ürün ara..." />
            </label>
            <div className="keypad">
              <button type="button">1</button>
              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button">5</button>
              <button type="button">6</button>
              <button type="button">7</button>
              <button type="button">8</button>
              <button type="button">9</button>
              <button type="button">0</button>
              <button type="button">C</button>
            </div>
            <button className="enterBtn" type="button">Enter</button>
          </div>

          {/* ====================== SEPET ====================== */}
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
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8a8278', fontStyle: 'italic' }}>
                  Sepetiniz boş. Ürün eklemek için kategorilerden bir ürün seçin.
                </div>
              ) : (
                cart.map((item, index) => {
                  const lineTotal = (item.numericPrice * item.qty).toFixed(2).replace('.', ',')

                  return (
                    <div className="cartRow" key={index}>
                      <button
                        className="mini deleteBtn"
                        type="button"
                        onClick={() => removeFromCart(index)}
                      >
                        ×
                      </button>

                      <div className="cartName">
                        <div className="n">{item.name}</div>
                        <div className="m">
                          <span>{item.art}</span>
                        </div>
                      </div>

                      <div className="cartControls">
                        <button
                          className="mini"
                          type="button"
                          onClick={() => changeQuantity(index, -1)}
                        >
                          −
                        </button>
                        <button
                          className="mini"
                          type="button"
                          onClick={() => changeQuantity(index, 1)}
                        >
                          ＋
                        </button>
                      </div>

                      <div className="cartCalc">
                        <div className="calc">{item.qty} × {item.price}</div>
                        <div className="sum">{lineTotal}</div>
                        <div className="try" aria-hidden="true">₺</div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

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
                <span className="payIcon" aria-hidden="true">📷</span>
                Nakit
              </button>
              <button className="payBtn card" type="button">
                <span className="payIcon" aria-hidden="true">💳</span>
                K. Kartı
              </button>
              <button className="payBtn open" type="button">
                <span className="payIcon" aria-hidden="true">🧾</span>
                Açık Hesap
              </button>
              <button className="payBtn change" type="button">
                <span className="payIcon" aria-hidden="true">🪙</span>
                Para Üstü
              </button>
            </div>
          </div>
        </aside>

        <main className="right">
          <div className="cats">
            {categories.map((c) => {
              const active = c.id === activeCategoryId
              return (
                <button
                  className={`cat ${active ? 'active' : ''}`}
                  type="button"
                  key={c.id}
                  onClick={() => setActiveCategoryId(c.id)}
                >
                  <div className="catIco" aria-hidden="true">{c.icon}</div>
                  <div className="catLbl">{c.label}</div>
                </button>
              )
            })}
          </div>

          <div className="productsWrap">
            <div className="products">
              {activeProducts.map((p, idx) => (
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
              ))}
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
  )
}

export default App