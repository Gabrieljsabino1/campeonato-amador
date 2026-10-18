import { Menu, Shield, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from './Brand'

export default function Header() {
  const [open, setOpen] = useState(false)
  const links = [['#ranking', 'Classificação'], ['#resenha', 'Resenha'], ['#galeria', 'Galeria']]
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Brand />
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {links.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <Link to="/login" className="admin-link"><Shield size={15} /> Área do presidente</Link>
        </nav>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Abrir menu">{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  )
}
