import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

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

                            <div className="post-media">
                                {post.media_type === 'video' ? (
                                    <video src={post.media_url} controls playsInline />
                                ) : (
                                    <img src={post.media_url} alt={post.title} loading="lazy" />
                                )}
                            </div>

                            <div className="post-content">
                                <h3>{post.title}</h3>
                                {post.description && <p>{post.description}</p>}
                                <div className="post-date">
                                    {formatDate(post.created_at)}
                                </div>
                            </div>

                        </article>
                    ))}
                </div>
            )}
        </main>
    )
}
