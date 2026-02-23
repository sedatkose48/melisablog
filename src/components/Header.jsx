import { LogIn, LogOut, PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Header({ user }) {
    const handleLogout = async () => {
        await supabase.auth.signOut()
        // Sayfayı yenileyerek Auth state'i sıfırlama (basit yaklaşım)
        window.location.reload()
    }

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div className="logo-area">
                        <h1>Melisa'nın Çalışmaları</h1>
                        <p className="subtitle">Portfolyo & Blog</p>
                    </div>
                </Link>

                <div className="actions">
                    {user ? (
                        <>
                            <Link to="/upload" className="btn primary-btn" style={{ textDecoration: 'none' }}>
                                <PlusCircle size={18} /> Yeni Ekle
                            </Link>
                            <button className="btn secondary-btn" onClick={handleLogout}>
                                <LogOut size={18} /> Çıkış
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn secondary-btn" style={{ textDecoration: 'none' }}>
                            <LogIn size={18} /> Giriş Yap
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
