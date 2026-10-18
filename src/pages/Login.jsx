import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand'
import { useApp } from '../store/AppContext'

export default function Login() {
  const { signIn, user, demoMode } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState(demoMode ? 'admin@ligadosamigos.com' : '')
  const [password, setPassword] = useState(demoMode ? 'admin123' : '')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/admin" replace />

  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    try { await signIn(email, password); navigate('/admin') } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <main className="login-page">
    <div className="login-brand-panel"><div className="panel-content"><Brand /><span className="eyebrow">Área exclusiva</span><h1>O COMANDO<br />DA <em>RODADA.</em></h1><p>Atualize o ranking, publique a resenha e mantenha a história da liga viva.</p></div><span className="giant-ball" aria-hidden="true">12</span></div>
    <div className="login-form-panel"><div className="login-box"><Link to="/" className="back-link"><ArrowLeft /> Voltar para o portal</Link><span className="login-icon"><ShieldCheck /></span><h2>Bem-vindo, presidente</h2><p>Entre com suas credenciais para acessar o painel.</p>
      {demoMode && <div className="demo-notice"><strong>Modo demonstração</strong><span>Os dados de acesso já estão preenchidos.</span></div>}
      <form onSubmit={submit}>
        <label>E-mail<div className="input-wrap"><Mail /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required /></div></label>
        <label>Senha<div className="input-wrap"><LockKeyhole /><input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" required /><button type="button" onClick={() => setShow(!show)}>{show ? <EyeOff /> : <Eye />}</button></div></label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn-primary login-submit" disabled={busy}>{busy ? 'Entrando...' : 'Entrar no painel'} <ArrowRightIcon /></button>
      </form>
      <small className="secure-copy"><LockKeyhole /> Acesso seguro e protegido</small>
    </div></div>
  </main>
}

function ArrowRightIcon() { return <span aria-hidden="true">→</span> }
