# 🌸 Nirka Studio — Digital Wedding Invitation

Website bisnis undangan digital dengan 5 tema template eksklusif.

---

## 📁 Struktur Folder

```
nirka-studio/
│
├── index.html                        ← Landing page utama bisnis
├── netlify.toml                      ← Konfigurasi deploy Netlify
├── README.md                         ← File ini
│
├── templates/
│   ├── elegant-gold/
│   │   └── index.html                ← Template 1: Elegant Gold
│   ├── nusantara/
│   │   └── index.html                ← Template 2: Nusantara Heritage
│   ├── floral/
│   │   └── index.html                ← Template 3: Floral Romance
│   ├── minimalist/
│   │   └── index.html                ← Template 4: Minimalist Modern
│   └── bold/
│       └── index.html                ← Template 5: Bold Contemporary
│
└── assets/
    ├── css/                          ← (opsional) CSS global
    ├── js/                           ← (opsional) JS global
    └── images/                       ← Foto & gambar
```

---

## 🚀 Cara Deploy ke Netlify (Gratis)

### Langkah 1 — Daftar Netlify
1. Buka [netlify.com](https://netlify.com)
2. Klik **Sign up** → pilih **Sign up with GitHub** (disarankan) atau email

### Langkah 2 — Upload Project
**Cara paling mudah — Drag & Drop:**
1. Setelah login, di dashboard Netlify cari tulisan:
   > *"Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"*
2. **Drag folder `nirka-studio`** dari File Explorer/Finder ke area tersebut
3. Tunggu beberapa detik → website langsung live! 🎉

### Langkah 3 — Ganti Nama Domain
1. Di dashboard site kamu, klik **Site configuration** → **Change site name**
2. Ganti jadi: `nirka-studio` (hasilnya: `nirka-studio.netlify.app`)
3. Klik **Save**

### Langkah 4 (Opsional) — Custom Domain
Kalau mau pakai `nirkastudio.com`:
1. Beli domain di [Niagahoster](https://niagahoster.co.id) atau [Domainesia](https://domainesia.com) (~Rp150rb/tahun)
2. Di Netlify: **Domain management** → **Add custom domain**
3. Ikuti instruksi DNS yang diberikan Netlify

---

## ✏️ Cara Update Konten Template untuk Klien

Setiap kali ada pesanan, edit file template yang dipilih klien:

### Yang perlu diganti:
```
- Nama mempelai
- Nama orang tua
- Tanggal & jam acara
- Nama & alamat venue
- Link Google Maps (ganti di href="https://maps.google.com/...")
- Nomor rekening
- Instagram handle
- Kisah cinta (love story)
```

### Cara ganti link Google Maps:
1. Buka Google Maps → cari lokasi venue
2. Klik **Share** → **Copy link**
3. Paste ke `href` di tombol Google Maps di template

---

## 📱 Cara Bagikan ke Klien

Setelah deploy, link undangan klien bisa berupa:
```
https://nirka-studio.netlify.app/templates/elegant-gold/
```

Atau kalau pakai custom domain:
```
https://nirkastudio.com/templates/elegant-gold/
```

---

## 💬 Nomor WhatsApp

Jangan lupa ganti semua `628XXXXXXXXX` di `index.html` dengan nomor WA bisnismu.

Format: `628` + nomor tanpa angka 0 di depan
Contoh: 0812-3456-7890 → `6281234567890`

Cari & ganti (Ctrl+H di VS Code):
- Cari: `628XXXXXXXXX`
- Ganti: `628xxxxxxxxx` (nomor kamu)

---

## 🛠️ Tips VS Code

- **Live Server**: Klik kanan `index.html` → Open with Live Server
- **Ctrl+S**: Simpan file (Live Server auto-refresh)
- **Ctrl+H**: Find & Replace di seluruh file
- **Ctrl+Shift+F**: Search di seluruh folder project

---

## 📦 Template Summary

| Nama | File | Cocok Untuk |
|------|------|-------------|
| Elegant Gold | `templates/elegant-gold/` | Pernikahan formal, mewah |
| Nusantara Heritage | `templates/nusantara/` | Pernikahan adat Jawa/Sunda |
| Floral Romance | `templates/floral/` | Pernikahan outdoor, garden |
| Minimalist Modern | `templates/minimalist/` | Pasangan muda perkotaan |
| Bold Contemporary | `templates/bold/` | Pasangan yang ingin beda |

---

**© 2025 Nirka Studio · Made with ♡ in Indonesia**
