import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { Trash2, X, Camera } from 'lucide-react'

export default function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedMedia, setSelectedMedia] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    // Avatar upload states
    const [avatarUrl, setAvatarUrl] = useState(() => {
        const stored = localStorage.getItem('site_avatar_data')
        if (stored) {
            try { return JSON.parse(stored) } catch (e) { /* ignore old format */ }
        }
        const oldStored = localStorage.getItem('site_avatar')
        if (oldStored) return { url: oldStored, type: 'image' }
        return { url: '/profile-pic.jpg', type: 'image' }
    })
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        fetchPosts()
        checkUser()
    }, [])

    async function checkUser() {
        const { data: { session } } = await supabase.auth.getSession()
        setIsLoggedIn(!!session)
    }

    async function fetchPosts() {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
        } else {
            setPosts(data)
        }
        setLoading(false)
    }

    const handleDelete = async (postId, mediaUrl) => {
        if (!window.confirm("Bu gönderiyi ve dosyasını tamamen silmek istediğinizden emin misiniz?")) return;

        setDeletingId(postId)

        try {
            // 1. Veritabanından satırı sil
            const { error: dbError } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId)

            if (dbError) throw dbError

            // 2. Storage'dan dosyayı sil (URL'den dosya yolunu çıkartarak)
            const urlParts = mediaUrl.split('/blog_media/')
            if (urlParts.length > 1) {
                const filePath = urlParts[1]
                const { error: storageError } = await supabase.storage
                    .from('blog_media')
                    .remove([filePath])

                if (storageError) console.error("Storage'dan silinirken hata:", storageError)
            }

            // Arayüzden anında kaldır
            setPosts(posts.filter(post => post.id !== postId))

        } catch (error) {
            console.error(error)
            alert("Silinirken bir hata oluştu: " + error.message)
        } finally {
            setDeletingId(null)
        }
    }

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Lütfen geçerli bir resim dosyası seçin.');
            return;
        }

        setIsUploadingAvatar(true);

        try {
            // "blog_media" bucketına admin_avatar adında kaydet/üzerine yaz
            const fileExt = file.name.split('.').pop();
            const filePath = `admin_avatar_${Date.now()}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('blog_media')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false // always create new to beat browser cache
                });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('blog_media')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);
            localStorage.setItem('site_avatar', publicUrl);

        } catch (err) {
            console.error(err);
            alert('Fotoğraf güncellenirken bir hata oluştu.');
        } finally {
            setIsUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        }
    };

    // Tarihi Türkçe formatta göstermek için
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }

    if (loading) {
        return <main className="container"><p style={{ textAlign: 'center' }}>Yükleniyor...</p></main>
    }

    return (
        <main className="container">

            <div className="profile-card">
                <div
                    className={`avatar-container ${isLoggedIn ? 'clickable-avatar' : ''}`}
                    onClick={() => isLoggedIn && !isUploadingAvatar && fileInputRef.current?.click()}
                >
                    {avatarUrl.type === 'video' ? (
                        <video
                            src={avatarUrl.url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={`profile-img ${isUploadingAvatar ? 'uploading' : ''}`}
                        />
                    ) : (
                        <img
                            src={avatarUrl.url}
                            alt="Profil Fotoğrafı"
                            className={`profile-img ${isUploadingAvatar ? 'uploading' : ''}`}
                        />
                    )}
                    {isLoggedIn && (
                        <div className="avatar-overlay">
                            {isUploadingAvatar ? <span className="loader">...</span> : <Camera size={24} color="white" />}
                        </div>
                    )}
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*,video/*"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                />

                <h2>Hakkımda</h2>
                <p>Ben Melisa Melda Köse, 2311216005 numaralı, 2. sınıf İngilizce Öğretmenliği öğrencisiyim. Bu site, Öğretim Teknolojileri ve Materyal Tasarımı dersi kapsamında hazırladığım ödev ve öğretim materyallerini paylaşmak amacıyla oluşturulmuştur.</p>
            </div>

            <h2 className="section-title">My Works (Çalışmalarım)</h2>

            {posts.length === 0 ? (
                <div className="empty-state">
                    <p>Henüz içerik eklenmemiş.</p>
                </div>
            ) : (
                <div className="works-grid">
                    {posts.map((post) => (
                        <div key={post.id} className="work-card">

                            <div
                                className={`work-media ${post.media_type === 'image' ? 'clickable-media' : ''} ${post.media_type === 'pdf' ? 'pdf-media clickable-media' : ''}`}
                                onClick={() => {
                                    if (post.media_type === 'image') setSelectedMedia(post.media_url)
                                    if (post.media_type === 'pdf') window.open(post.media_url, '_blank')
                                }}
                            >
                                {post.media_type === 'video' ? (
                                    <video src={post.media_url} controls playsInline className="work-img" />
                                ) : post.media_type === 'pdf' ? (
                                    <div className="pdf-preview">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className="pdf-icon">
                                            <rect width="64" height="64" rx="10" fill="#ff5252" />
                                            <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="bold" fill="white" fontFamily="Arial">PDF</text>
                                        </svg>
                                        <span className="pdf-label">PDF dosyasını açmak için tıkla</span>
                                    </div>
                                ) : (
                                    <img src={post.media_url} alt={post.title} loading="lazy" className="work-img" />
                                )}
                            </div>

                            <div className="work-info">
                                <span className="work-date">
                                    {formatDate(post.created_at)}
                                </span>
                                <h3>{post.title}</h3>
                                {post.description && <p>{post.description}</p>}

                                <div className="post-footer">
                                    {isLoggedIn && (
                                        <button
                                            onClick={() => handleDelete(post.id, post.media_url)}
                                            className="delete-btn"
                                            disabled={deletingId === post.id}
                                            title="Bu gönderiyi sil"
                                        >
                                            <Trash2 size={16} />
                                            {deletingId === post.id ? '...' : 'Sil'}
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* Resim Görüntüleme Modalı */}
            {selectedMedia && (
                <div className="modal-overlay" onClick={() => setSelectedMedia(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedMedia(null)}>
                            <X size={32} />
                        </button>
                        <img src={selectedMedia} alt="Büyütülmüş Görsel" />
                    </div>
                </div>
            )}
        </main>
    )
}
