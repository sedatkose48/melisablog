import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Upload({ user }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Sadece yetkililerin görmesi gerek
    if (!user) {
        return (
            <div className="main-content">
                <div className="empty-state">
                    <h2>Bu sayfayı görüntüleme yetkiniz yok.</h2>
                </div>
            </div>
        )
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) return alert('Lütfen bir dosya seçin!')

        setLoading(true)

        // 1. Resmi/Videoyu Supabase Storage'a Yükleme
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('blog_media')
            .upload(filePath, file)

        if (uploadError) {
            console.error(uploadError)
            alert('Dosya yüklenirken bir hata oluştu!')
            setLoading(false)
            return
        }

        // 2. Public URL'yi Alma
        const { data: { publicUrl } } = supabase.storage
            .from('blog_media')
            .getPublicUrl(filePath)

        // 3. Veritabanına (posts tablosuna) kayıt ekleme
        const mediaType = file.type.startsWith('video/') ? 'video' : 'image'

        const { error: dbError } = await supabase
            .from('posts')
            .insert([
                {
                    title,
                    description,
                    media_url: publicUrl,
                    media_type: mediaType,
                    user_id: user.id
                }
            ])

        if (dbError) {
            console.error(dbError)
            alert('Kayıt oluşturulurken bir hata oluştu!')
        } else {
            alert('Başarıyla eklendi!')
            navigate('/') // Ana sayfaya yönlendir
        }

        setLoading(false)
    }

    return (
        <div className="main-content">
            <div className="upload-container">
                <h2>Yeni Çalışma Ekle</h2>
                <form onSubmit={handleUpload} className="upload-form">
                    <div className="form-group">
                        <label>Başlık</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Çalışmanın adı"
                        />
                    </div>

                    <div className="form-group">
                        <label>Açıklama / Not</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Bu çalışma hakkında kısaca düşünceleriniz..."
                            rows={4}
                        />
                    </div>

                    <div className="form-group file-group">
                        <label>Dosya Seç (Fotoğraf veya Video)</label>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </div>

                    <button type="submit" className="btn primary-btn" disabled={loading}>
                        {loading ? 'Yükleniyor...' : 'Paylaş'}
                    </button>
                </form>
            </div>
        </div>
    )
}
