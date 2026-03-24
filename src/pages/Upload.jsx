import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Upload({ user }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [file, setFile] = useState(null)
    const [link, setLink] = useState('')
    const [uploadType, setUploadType] = useState('file')
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
        if (uploadType === 'file' && !file) return alert('Lütfen bir dosya seçin!')
        if (uploadType === 'link' && !link) return alert('Lütfen bir bağlantı (URL) girin!')

        setLoading(true)

        let mediaUrl = ''
        let mediaType = ''

        if (uploadType === 'file') {
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
                
            mediaUrl = publicUrl
            mediaType = file.type === 'application/pdf' ? 'pdf' : file.type.startsWith('video/') ? 'video' : 'image'
        } else {
            mediaUrl = link
            mediaType = 'link'
            
            // URL düzeltme
            if (!mediaUrl.startsWith('http://') && !mediaUrl.startsWith('https://')) {
                mediaUrl = 'https://' + mediaUrl
            }
        }

        // 3. Veritabanına (posts tablosuna) kayıt ekleme
        const { error: dbError } = await supabase
            .from('posts')
            .insert([
                {
                    title,
                    description,
                    media_url: mediaUrl,
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
                
                <div className="upload-mode-toggle">
                    <button type="button" className={`toggle-btn ${uploadType === 'file' ? 'active' : ''}`} onClick={() => setUploadType('file')}>Dosya Yükle</button>
                    <button type="button" className={`toggle-btn ${uploadType === 'link' ? 'active' : ''}`} onClick={() => setUploadType('link')}>Bağlantı Ekle</button>
                </div>

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

                    {uploadType === 'file' ? (
                        <div className="form-group file-group">
                            <label>Dosya Seç (Fotoğraf, Video veya PDF)</label>
                            <input
                                type="file"
                                accept="image/*,video/*,application/pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                                required
                            />
                        </div>
                    ) : (
                        <div className="form-group">
                            <label>Çalışma Bağlantısı (URL)</label>
                            <input
                                type="url"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                required
                                placeholder="Örn: https://www.canva.com/..."
                            />
                        </div>
                    )}

                    <button type="submit" className="btn primary-btn" disabled={loading}>
                        {loading ? 'Yükleniyor...' : 'Paylaş'}
                    </button>
                </form>
            </div>
        </div>
    )
}
