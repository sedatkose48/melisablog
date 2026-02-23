import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Trash2, X } from 'lucide-react'

export default function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedMedia, setSelectedMedia] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

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
            // Örnek URL: https://ikibkyntszqeujpyqrqx.supabase.co/storage/v1/object/public/blog_media/UUID/dosya.jpg
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

    // Tarihi Türkçe formatta göstermek için
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }

    if (loading) {
        return <main className="main-content"><p style={{ textAlign: 'center' }}>Yükleniyor...</p></main>
    }

    return (
        <main className="main-content">
            {posts.length === 0 ? (
                <div className="empty-state">
                    <p>Henüz içerik eklenmemiş.</p>
                </div>
            ) : (
                <div className="posts-grid">
                    {posts.map((post) => (
                        <article key={post.id} className="post-card">

                            <div
                                className={`post-media ${post.media_type === 'image' ? 'clickable-media' : ''}`}
                                onClick={() => post.media_type === 'image' && setSelectedMedia(post.media_url)}
                            >
                                {post.media_type === 'video' ? (
                                    <video src={post.media_url} controls playsInline />
                                ) : (
                                    <img src={post.media_url} alt={post.title} loading="lazy" />
                                )}
                            </div>

                            <div className="post-content">
                                <h3>{post.title}</h3>
                                {post.description && <p>{post.description}</p>}

                                <div className="post-footer">
                                    <span className="post-date">
                                        {formatDate(post.created_at)}
                                    </span>

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

                        </article>
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
