# 👛 PocketMate ✨
> **Catat keuangan santai, praktis, & gemes!**

PocketMate adalah aplikasi pemantau keuangan harian (*personal finance tracker*) berbasis web yang dirancang ringan, cepat, dan menyenangkan. Dilengkapi fitur *1-tap input*, opsi takaran belanja warung, aksi cepat pindah saldo, serta respon suara AI yang lucu! 🐱💸

---

### 🌟 Fitur Utama

* **🏛️ Multi-Wallet Tracking**: Pantau saldo BSI, DANA, dan Cash/Dompet secara terpisah.
* **⚡ Aksi Cepat (Pindah Saldo)**: Fitur *1-tap* untuk Tarik Tunai (DANA ➔ Cash) dan Transfer BSI.
* **🌾 Belanja Warung (Takaran Flexibility)**: Preset catat bahan pokok (gula, tepung, telur) berdasarkan takaran nyata (1/4 kg, 1/2 kg, per-butir) dengan tombol penyesuaian harga (`+500` / `-500`).
* **🧋 Quick Presets Jajanan**: Catat pengeluaran harian seperti boba, nasi goreng, atau parkir cukup dengan satu klik.
* **🗣️ Voice AI & Mascot Reactions**: Respon suara AI lucu (*"Uang lagi, uang lagiii!"* vs *"Asiiiik cairrr!"*) serta gelembung ekspresi maskot kucing.
* **🔒 Keamanan Data**: Auto-save ke LocalStorage + fitur ekspor & impor *backup* file JSON berkala.

---

### 🛠️ Tech Stack

* **Frontend**: React.js + Vite
* **Styling**: Tailwind CSS v4
* **Icons**: Lucide React
* **Audio**: Web Speech API (Text-to-Speech)
* **Storage**: Browser LocalStorage & JSON File Management

---

### 🚀 Cara Menjalankan Proyek (Lokal)

```bash
# Clone repository
git clone [https://github.com/cutzhraa/pocket-mate.git](https://github.com/cutzhraa/pocket-mate.git)

# Masuk ke folder proyek
cd pocket-mate

# Install dependency
npm install

# Jalankan server lokal
npm run dev