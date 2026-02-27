# Melisa Blog - Değişiklik Kaydı (Changelog)

Bu dosyada projeye eklenen son özellikler, düzeltmeler ve sistemsel güncellemeler listelenmektedir.

## 🛠 Sistem ve Altyapı Düzeltmeleri
1. **GitHub Depo Değişikliği & Vercel Bağlantı Düzeltmesi:** 
   - Hatalı (403 Forbidden) yetkilendirme sorunları nedeniyle GitHub deposu önce `sedatkose48/mel-saablog` adlı kilitlenmeyen ana hesaba taşındı.
   - **Kritik Düzeltme (27 Şubat 2026):** Yerel kodun `mel-saablog` reposuna gönderildiği, ancak Vercel'in `melisablog` reposunu takip ettiği keşfedildi. Bu yüzden hiçbir değişiklik canlı siteye yansımıyordu. Git remote URL'si `https://github.com/sedatkose48/melisablog.git` olarak güncellendi ve tüm son değişiklikler doğru repoya force-push yapıldı. Artık `git push` doğrudan Vercel'in izlediği `sedatkose48/melisablog` reposuna gidiyor.
2. **Vercel 404 Hatası Çözümü:** 
   - Proje ana dizinine `vercel.json` dosyası eklendi. (React Router'ın Vercel ortamında sayfalar arası geçişte veya sayfayı yenilerken çıkardığı 404 hatası sonsuza dek çözüldü).
3. **Supabase Veritabanı Yenilemesi:** 
   - Projenin yanlışlıkla silinmesi üzerine Local ortamdaki (`.env`) bağlantı ayarları yeni `ikibkyntszqeujpyqrqx` numaralı Supabase id'si ve yeni Anon Key ile değiştirildi.
4. **Giriş (Auth) Hata Ayıklaması:**
   - `Login.jsx` sayfasına, şifre/kullanıcı adı hatası olduğunda veya sistemden bir ret geldiğinde "Genel hata" yerine problemin **tam detayını** (örn: Kullanıcı bulunamadı) gösteren hata denetimi (error tracking) eklendi.

## ✨ Yeni Frontend (Arayüz) Özellikleri
1. **🖼 Görsel Büyütme (Image Modal):**
   - Ana sayfadaki fotoğraflara tıklama özelliği eklendi (`clickable-media`).
   - Fotoğrafa tıklandığında ekranı siyah/şeffaf bir arkaplanla (Modal overlay) kaplayıp orijinal veya büyük boyutunu gösteren özellik eklendi (`App.css` ve `Home.jsx` güncellendi). 
   - Büyütülen fotoğrafın yanına kapatma butonu (`X`) eklendi ve ekrana veya butona dışarı tıklanınca kapanması sağlandı.
2. **🗑 İçerik Silme Fonksiyonu (Delete Action):**
   - Ziyaretçilerin göremediği, **sadece giriş yapmış (admin)** kişinin görebileceği bir Çöp Kutusu (Sil) butonu eklendi.
   - Kazayla silinmeye karşı "Emin misiniz?" şekline Alert onayı eklendi.
   - Silinen gönderiler sadece arayüzden ve veritabanından (`posts` table) değil, aynı zamanda **Supabase Storage** (dosya depolama) alanından da temizlenecek şekilde bağlandı. Böylece Vercel veya Supabase gereksiz depolama kotası harcamayacak.
