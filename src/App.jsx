import React, { useState, useEffect } from 'react';
import { Wallet, ArrowRightLeft, Sparkles, Banknote, Landmark, ShoppingBag, Scale, X, Check, Download, Upload, RotateCcw } from 'lucide-react';

export default function App() {
  const [wallets, setWallets] = useState(() => {
    const saved = localStorage.getItem('pm_wallets');
    return saved ? JSON.parse(saved) : [
      { id: 'bsi', name: 'BSI', balance: 1500000, color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: '🏛️' },
      { id: 'dana', name: 'DANA', balance: 250000, color: 'bg-sky-100 text-sky-800 border-sky-300', icon: '💙' },
      { id: 'cash', name: 'Cash/Dompet', balance: 85000, color: 'bg-amber-100 text-amber-800 border-amber-300', icon: '👛' },
    ];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('pm_history');
    return saved ? JSON.parse(saved) : [];
  });

  // State Maskot Reaksi Lucu
  const [mascotMessage, setMascotMessage] = useState('Yuk catat pengeluaran hari ini! 😺✨');

  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [price, setPrice] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState('cash');

  const [fromWallet, setFromWallet] = useState('dana');
  const [toWallet, setToWallet] = useState('cash');

  useEffect(() => {
    localStorage.setItem('pm_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('pm_history', JSON.stringify(history));
  }, [history]);

  // Web Audio API Sound Effect (Tanpa File Luar)
  const playAISound = (type) => {
    try {
      if (!('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();

      let textToSpeak = '';
      if (type === 'expense') {
        const phrases = [
          "Uang lagi, uang lagiii!",
          "Irit-irit woy, jajan terus!",
        ];
        textToSpeak = phrases[Math.floor(Math.random() * phrases.length)];
      } else if (type === 'income' || type === 'transfer') {
        const phrases = [
          "Asiiiik cairrr!",
          "Mantap, saldo bertambah!",
        ];
        textToSpeak = phrases[Math.floor(Math.random() * phrases.length)];
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'id-ID';
      utterance.pitch = 1.3;
      utterance.rate = 1.1;
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log("Speech error", e);
    }
  };

  const warungItems = [
    { id: 'gula', name: 'Gula Pasir', icon: '🌾', prices: { '1/4 kg': 4500, '1/2 kg': 8500, '1 kg': 17000 } },
    { id: 'tepung', name: 'Tepung Terigu', icon: '🍞', prices: { '1/4 kg': 3500, '1/2 kg': 6500, '1 kg': 12000 } },
    { id: 'telur', name: 'Telur Ayam', icon: '🥚', prices: { '1 Butir': 2000, '2 Butir': 4000, '5 Butir': 10000 } },
    { id: 'pisang', name: 'Pisang', icon: '🍌', prices: { '1 Sisir': 15000, '1/2 Sisir': 8000, 'Eceran': 3000 } },
  ];

  const quickPresets = [
    { id: 'boba', name: 'Boba / Kopi', price: 15000, icon: '🧋' },
    { id: 'nasgor', name: 'Nasi Goreng', price: 15000, icon: '🍚' },
    { id: 'parkir', name: 'Parkir', price: 2000, icon: '🅿️' },
    { id: 'esteh', name: 'Es Teh', price: 5000, icon: '🧊' },
  ];

  const handleOpenWarung = (item, size) => {
    setSelectedItem(item);
    setSelectedSize(size);
    setPrice(item.prices[size]);
    setSelectedWallet('cash');
    setActiveModal('warung');
  };

  const handleOpenJajanan = (qp) => {
    setSelectedItem(qp);
    setPrice(qp.price);
    setSelectedWallet('cash');
    setActiveModal('jajanan');
  };

  const handleOpenTarik = () => {
    setFromWallet('dana');
    setToWallet('cash');
    setPrice(100000);
    setActiveModal('tarik');
  };

  const handleOpenTransfer = () => {
    setFromWallet('bsi');
    setToWallet('dana');
    setPrice(50000);
    setActiveModal('transfer');
  };

  const handleSaveExpense = () => {
    if (price <= 0) return;

    playAISound('expense');

    setWallets(prev => prev.map(w => {
      if (w.id === selectedWallet) return { ...w, balance: w.balance - price };
      return w;
    }));

    const title = activeModal === 'warung' 
      ? `${selectedItem.name} (${selectedSize})` 
      : selectedItem.name;

    setHistory(prev => [
      {
        id: Date.now(),
        title,
        amount: price,
        type: 'expense',
        walletId: selectedWallet,
        icon: selectedItem.icon,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);

    // Respon Maskot Gemes
    if (price >= 20000) {
      setMascotMessage(`Waduh, lumayan juga nih ${title}! Tetep irit ya 😼💸`);
    } else {
      setMascotMessage(`Sip! ${title} udah dicatat. Dompet pinter! 😸✨`);
    }

    setActiveModal(null);
  };

  const handleSaveTransfer = () => {
    if (price <= 0 || fromWallet === toWallet) return;

    playAISound('transfer');

    setWallets(prev => prev.map(w => {
      if (w.id === fromWallet) return { ...w, balance: w.balance - price };
      if (w.id === toWallet) return { ...w, balance: w.balance + price };
      return w;
    }));

    const isTarik = activeModal === 'tarik';
    const title = isTarik ? 'Tarik Tunai' : 'Transfer Antar Dompet';
    const icon = isTarik ? '💸' : '🔄';

    setHistory(prev => [
      {
        id: Date.now(),
        title: `${title} (${fromWallet.toUpperCase()} ➔ ${toWallet.toUpperCase()})`,
        amount: price,
        type: 'transfer',
        icon,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);

    setMascotMessage(`Pindah saldo berhasil! Saldo ${toWallet.toUpperCase()} makin tebal 👛🔥`);
    setActiveModal(null);
  };

  const handleExportBackup = () => {
    const data = { wallets, history, exportDate: new Date().toISOString() };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\s+/g, '-').toLowerCase();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '.');
    
    const fileName = `pocketmate-backup-${dateStr}-${timeStr}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.wallets && data.history) {
          setWallets(data.wallets);
          setHistory(data.history);
          setMascotMessage('Yay! Data backup berhasil dipulihkan! 🎉');
        } else {
          alert('Format file backup tidak valid 😭');
        }
      } catch (err) {
        alert('Gagal membaca file backup 😭');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Yakin mau reset data ke awal? Catatan saat ini bakal terhapus!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-pink-50/50 text-slate-700 font-sans p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header App */}
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-pink-600 flex items-center justify-center gap-2">
            PocketMate <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
          </h1>
          <p className="text-xs text-slate-500">Catat keuangan santai & gemes ✨</p>
        </header>

        {/* Mascot Reaction Bubble */}
        <div className="bg-white border-2 border-pink-200 rounded-3xl p-3 shadow-sm flex items-center gap-3">
          <div className="text-3xl animate-bounce">🐱</div>
          <div className="text-xs font-semibold text-pink-700">
            {mascotMessage}
          </div>
        </div>

        {/* Kartu Multi-Wallet */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
            <Wallet className="w-4 h-4" /> Dompet Kamu
          </h2>
          <div className="grid grid-cols-3 gap-2.5">
            {wallets.map((w) => (
              <div 
                key={w.id} 
                className={`p-3 rounded-2xl border-2 ${w.color} shadow-sm flex flex-col justify-between h-24 transition-transform active:scale-95 cursor-pointer`}
              >
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>{w.name}</span>
                  <span>{w.icon}</span>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Saldo</div>
                  <div className="text-xs font-extrabold truncate">
                    Rp {w.balance.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Aksi Cepat / Pindah Saldo */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
            <ArrowRightLeft className="w-4 h-4" /> Aksi Cepat
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleOpenTarik} className="p-3 bg-white border-2 border-sky-200 hover:border-sky-400 rounded-2xl shadow-sm text-left flex items-center gap-3 transition-transform active:scale-95 cursor-pointer">
              <div className="p-2 bg-sky-100 rounded-xl text-sky-600"><Banknote className="w-5 h-5" /></div>
              <div>
                <div className="text-xs font-bold text-slate-700">Tarik Tunai</div>
                <div className="text-[10px] text-slate-400">DANA ➔ Cash</div>
              </div>
            </button>

            <button onClick={handleOpenTransfer} className="p-3 bg-white border-2 border-emerald-200 hover:border-emerald-400 rounded-2xl shadow-sm text-left flex items-center gap-3 transition-transform active:scale-95 cursor-pointer">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><Landmark className="w-5 h-5" /></div>
              <div>
                <div className="text-xs font-bold text-slate-700">Transfer BSI</div>
                <div className="text-[10px] text-slate-400">BSI ➔ Wallet lain</div>
              </div>
            </button>
          </div>
        </section>

        {/* Belanja Warung */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
            <Scale className="w-4 h-4" /> Belanja Warung (Takaran)
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {warungItems.map((item) => (
              <div key={item.id} className="p-3 bg-white border-2 border-pink-100 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.keys(item.prices).map((s) => (
                    <button key={s} onClick={() => handleOpenWarung(item, s)} className="text-[10px] bg-pink-50 hover:bg-pink-200 text-pink-700 font-medium px-2 py-1 rounded-lg border border-pink-200 transition-colors cursor-pointer">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Presets Jajanan */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" /> Quick Jajanan (1-Tap)
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {quickPresets.map((qp) => (
              <button key={qp.id} onClick={() => handleOpenJajanan(qp)} className="p-2 bg-white border-2 border-amber-100 hover:border-amber-300 rounded-2xl shadow-sm flex flex-col items-center gap-1 text-center transition-transform active:scale-95 cursor-pointer">
                <span className="text-xl">{qp.icon}</span>
                <span className="text-[10px] font-bold text-slate-700 leading-tight">{qp.name}</span>
                <span className="text-[9px] text-amber-600 font-semibold">{qp.price / 1000}rb</span>
              </button>
            ))}
          </div>
        </section>

        {/* Riwayat Singkat */}
        {history.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
              <span>📋</span> Catatan Terbaru
            </h2>
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-3 space-y-2 shadow-sm">
              {history.map((h) => (
                <div key={h.id} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50 last:border-none">
                  <div className="flex items-center gap-2">
                    <span>{h.icon}</span>
                    <div>
                      <div className="font-bold text-slate-700">{h.title}</div>
                      <div className="text-[9px] text-slate-400 capitalize">{h.time}</div>
                    </div>
                  </div>
                  <div className={`font-extrabold ${h.type === 'transfer' ? 'text-sky-600' : 'text-pink-600'}`}>
                    {h.type === 'transfer' ? '↔ ' : '-'}Rp {h.amount.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fitur Backup & Reset Data */}
        <section className="pt-4 border-t border-pink-100 flex justify-between items-center text-xs">
          <div className="flex gap-2">
            <button onClick={handleExportBackup} className="flex items-center gap-1 bg-white border border-pink-200 text-pink-700 px-3 py-1.5 rounded-xl font-bold hover:bg-pink-50 cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Backup
            </button>
            <label className="flex items-center gap-1 bg-white border border-pink-200 text-pink-700 px-3 py-1.5 rounded-xl font-bold hover:bg-pink-50 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Restore
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>
          <button onClick={handleResetData} className="text-slate-400 hover:text-rose-500 p-1 flex items-center gap-1 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </section>

      </div>

      {/* Pop-up Modal (Warung & Jajanan) */}
      {(activeModal === 'warung' || activeModal === 'jajanan') && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <span className="text-xl">{selectedItem?.icon}</span>
                <span>{selectedItem?.name} {selectedSize && `(${selectedSize})`}</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-pink-50/70 p-4 rounded-2xl text-center space-y-2 border border-pink-100">
              <div className="text-[10px] text-pink-600 font-bold uppercase tracking-wider">Total Harga</div>
              <div className="text-2xl font-black text-pink-600">
                Rp {price.toLocaleString('id-ID')}
              </div>
              <div className="flex justify-center gap-1.5 pt-1">
                <button onClick={() => setPrice(p => Math.max(0, p - 1000))} className="text-[10px] font-bold bg-white border border-pink-200 text-pink-700 px-2.5 py-1 rounded-xl shadow-2xs hover:bg-pink-100">-1rb</button>
                <button onClick={() => setPrice(p => Math.max(0, p - 500))} className="text-[10px] font-bold bg-white border border-pink-200 text-pink-700 px-2.5 py-1 rounded-xl shadow-2xs hover:bg-pink-100">-500</button>
                <button onClick={() => setPrice(p => p + 500)} className="text-[10px] font-bold bg-white border border-pink-200 text-pink-700 px-2.5 py-1 rounded-xl shadow-2xs hover:bg-pink-100">+500</button>
                <button onClick={() => setPrice(p => p + 1000)} className="text-[10px] font-bold bg-white border border-pink-200 text-pink-700 px-2.5 py-1 rounded-xl shadow-2xs hover:bg-pink-100">+1rb</button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500">Bayar pakai apa?</label>
              <div className="grid grid-cols-3 gap-1.5">
                {wallets.map((w) => (
                  <button key={w.id} onClick={() => setSelectedWallet(w.id)} className={`py-2 px-1 text-[11px] font-bold rounded-xl border flex flex-col items-center gap-0.5 transition-all ${selectedWallet === w.id ? 'bg-pink-500 text-white border-pink-500 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <span>{w.icon}</span>
                    <span>{w.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSaveExpense} className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 text-xs transition-transform active:scale-95 cursor-pointer">
              <Check className="w-4 h-4" /> Simpan Catatan
            </button>
          </div>
        </div>
      )}

      {/* Pop-up Modal Pindah Saldo */}
      {(activeModal === 'tarik' || activeModal === 'transfer') && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <span className="text-xl">{activeModal === 'tarik' ? '💸' : '🔄'}</span>
                <span>{activeModal === 'tarik' ? 'Tarik Tunai' : 'Transfer Antar Dompet'}</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-sky-50 p-4 rounded-2xl text-center space-y-2 border border-sky-100">
              <div className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">Nominal Saldo</div>
              <div className="text-2xl font-black text-sky-600">
                Rp {price.toLocaleString('id-ID')}
              </div>
              <div className="flex justify-center gap-1.5 pt-1">
                <button onClick={() => setPrice(p => Math.max(0, p - 50000))} className="text-[10px] font-bold bg-white border border-sky-200 text-sky-700 px-2 py-1 rounded-xl shadow-2xs">-50rb</button>
                <button onClick={() => setPrice(p => Math.max(0, p - 10000))} className="text-[10px] font-bold bg-white border border-sky-200 text-sky-700 px-2 py-1 rounded-xl shadow-2xs">-10rb</button>
                <button onClick={() => setPrice(p => p + 10000)} className="text-[10px] font-bold bg-white border border-sky-200 text-sky-700 px-2 py-1 rounded-xl shadow-2xs">+10rb</button>
                <button onClick={() => setPrice(p => p + 50000)} className="text-[10px] font-bold bg-white border border-sky-200 text-sky-700 px-2 py-1 rounded-xl shadow-2xs">+50rb</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">Dari Dompet</label>
                <select value={fromWallet} onChange={(e) => setFromWallet(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold">
                  {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">Ke Dompet</label>
                <select value={toWallet} onChange={(e) => setToWallet(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold">
                  {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            </div>

            <button onClick={handleSaveTransfer} className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-200 flex items-center justify-center gap-2 text-xs transition-transform active:scale-95 cursor-pointer">
              <Check className="w-4 h-4" /> Proses Pindah Saldo
            </button>
          </div>
        </div>
      )}

    </div>
  );
}