
## 🎨 Stitch Tema & Animasyon Guncellemeleri (27 Subat 2026)

### Arka Plan Efektleri (BackgroundFx.jsx, index.css)
- Sayfanin arkasindaki yildizlar ve pariltilarin pozisyonu scroll ile birlikte hareket edecek sekilde position: fixed olarak guncellendi.
- background-fx sinifi inline style'dan temizlenerek index.css'e tasindi; width/height 100vw/100vh, z-index: 0, pointer-events: none olarak duzenlendi.
- Yildizlarin kontrast sorunu giderildi (dusuk opakliktan dolayi bilgisayar ekraninda gorunmuyorlardi).

### Hareketli Giris Sayfasi (Login.jsx, App.css)
- Standart giris formu tamamen yenilendi; yerine Stitch temine uygun animasyonlu Bebek Mavisi kart tasarimi eklendi.
- Kart (st-login-card): st-fade-up animasyonu ile yukari kayarak acilir.
- Avatar (st-login-avatar): Kartin uzerinde beyaz kenarlikli daire seklinde; st-pop-in animasyonu ile firlar gibi yerlesir.
- E-posta ve Sifre kutucuklari: st-slide-in-left animasyonu ile soldan sirayla kayarak gelir.
- GO! butonu: En son st-fade-up ile asagidan belirir.
- Tum @keyframes animasyonlari 0% baslangic noktasiyla duzeltilerek masaustu tarayici uyumu saglandi.
- Video Arka Plan: login_animation.mp4 dosyasi public/ klasorune eklendi; login sayfasinda opacity: 0.3 ile arka plan videosu olarak oynatiliyor.

### Profil Fotografi Degistirme (Home.jsx, App.css)
- Ana sayfadaki avatara tiklama ozelligi eklendi (yalnizca giris yapan kullanici icin aktif).
- Tiklandiginda gizli input[type=file] acilir; gorsel veya video secilebilir.
- Secilen dosya Supabase Storage blog_media bucket'ina yuklenir, URL localStorage'a (site_avatar_data) kaydedilir.
- Hover'da kamera ikonu overlay'i gosterilir; yukleme sirasinda pulsating loader animasyonu calisir.

### Mobil Uyum Duzeltmeleri (App.css)
- @media (max-width: 600px) bloguna login karti, avatar ve input'lar icin kucultme kurallari eklendi.
- body, html icin overflow-x: hidden eklenerek telefonda yatay tasma engellendi.

## Stitch Tema and Animasyon Guncellemeleri (27 Subat 2026)

### Arka Plan Efektleri (BackgroundFx.jsx, index.css)
- Yildizlar ve pariltilarin pozisyonu scroll ile birlikte hareket etmesi icin 'position: fixed' yapildi.
- background-fx sinifi index.css'e tasindi: width/height 100vw/100vh, z-index: 0, pointer-events: none.
- Yildizlarin kontrast sorunu giderildi (masaustu ekraninda gorunmuyorlardi).

### Hareketli Giris Sayfasi (Login.jsx, App.css)
- Standart giris formu silindi; Stitch temine uygun animasyonlu Bebek Mavisi kart tasarimi eklendi.
- Kart: fade-up animasyonu ile yukari kayarak acilir.
- Avatar: Kartin ustunde, beyaz kenarlikli daire; pop-in animasyonu ile yerlesir. localStorage veya profile-pic.jpg kullanilir.
- E-posta ve Sifre kutulari: slide-in-left animasyonu ile soldan sirayla gelir.
- GO! butonu: En son asagidan belirir.
- Tum @keyframes 0% baslangic noktasiyla duzeltildi (masaustu uyumu).
- login_animation.mp4 dosyasi public/ klasorune eklendi; login sayfasinda opacity 0.3 ile arka plan videosu olarak oynatiliyor.

### Profil Fotografi Degistirme (Home.jsx, App.css)
- Avatara tiklama ozelligi eklendi (yalnizca giris yapan kullanici icin aktif).
- Secilen dosya Supabase Storage blog_media bucket'ina yuklenir.
- URL localStorage'a (site_avatar_data) kaydedilir.
- Hover'da kamera ikonu, yukleme sirasinda pulsating loader gosterilir.

### Mobil Uyum Duzeltmeleri (App.css)
- @media (max-width: 600px) bloguna login karti, avatar ve input'lar icin kucultme kurallari eklendi.
- body, html icin overflow-x: hidden eklenerek telefonda yatay tasma engellendi.
