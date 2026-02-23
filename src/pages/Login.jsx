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

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setErrorMSG('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
            console.error(error)
        } else {
            navigate('/')
        }

        setLoading(false)
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Yönetici Girişi</h2>
                <p className="login-subtitle">Sadece Melisa için yetkili alandır.</p>

                <form onSubmit={handleLogin} className="login-form">
                    {errorMSG && <div className="error-msg">{errorMSG}</div>}

                    <div className="form-group">
                        <label htmlFor="email">E-posta</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-posta adresiniz"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Şifre</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Şifreniz"
                            required
                        />
                    </div>

                    <button type="submit" className="btn primary-btn full-width" disabled={loading}>
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>
            </div>
        </div>
    )
}
