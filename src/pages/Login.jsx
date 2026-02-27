import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMSG, setErrorMSG] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMSG('')

        const { error, data } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setErrorMSG(`Hata: ${error.message}`)
            console.error("Giriş Hatası:", error.message, error.status)
        } else {
            console.log("Giriş Başarılı:", data)
            navigate('/')
        }

        setLoading(false)
    }

    // Profil resmini güvenli bir şekilde LocalStorage'dan veya varsayılan public dosyasından al
    const getAvatarSrc = () => {
        const stored = localStorage.getItem('site_avatar_data')
        if (stored) {
            try { return JSON.parse(stored).url } catch (e) { /* ignore */ }
        }
        const oldStored = localStorage.getItem('site_avatar')
        if (oldStored) return oldStored
        return '/profile-pic.jpg'
    }

    return (
        <div className="st-login-wrapper">
            <video
                className="st-login-bg-video"
                src="/login_animation.mp4"
                autoPlay
                muted
                loop
                playsInline
            />
            <div className="st-login-card">

                <div className="st-login-avatar">
                    <img src={getAvatarSrc()} alt="Admin Avatar" />
                </div>

                <form onSubmit={handleLogin} className="st-login-form">
                    {errorMSG && <div className="st-error-msg">{errorMSG}</div>}

                    <div className="st-input-wrap delay-1">
                        <input
                            id="email"
                            type="email"
                            className="st-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-posta"
                            required
                        />
                    </div>

                    <div className="st-input-wrap delay-2">
                        <input
                            id="password"
                            type="password"
                            className="st-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Şifre"
                            required
                        />
                    </div>

                    <button type="submit" className="st-go-btn delay-3" disabled={loading}>
                        {loading ? '...' : 'GO!'}
                    </button>
                </form>
            </div>
        </div>
    )
}
