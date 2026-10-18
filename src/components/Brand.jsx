import { Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Brand({ compact = false }) {
  return (
    <Link to="/" className="brand" aria-label="Liga dos Amigos - início">
      <span className={`brand-mark ${compact ? 'small' : ''}`}><Trophy size={compact ? 19 : 24} strokeWidth={2.4} /></span>
      <span><strong>LIGA DOS</strong><em>AMIGOS</em></span>
    </Link>
  )
}
