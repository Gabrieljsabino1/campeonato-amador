import { BarChart3, Check, ExternalLink, ImagePlus, LayoutDashboard, LogOut, Menu, Newspaper, Pencil, Plus, Save, Trophy, UploadCloud, Users, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'
import { useApp } from '../store/AppContext'

const nav = [
  { id: 'overview', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'ranking', label: 'Classificação', icon: Trophy },
  { id: 'post', label: 'Nova resenha', icon: Newspaper },
  { id: 'media', label: 'Galeria de mídia', icon: ImagePlus },
]

export default function Admin() {
  const { players, posts, media, signOut, demoMode } = useApp()
  const [view, setView] = useState('overview')
  const [menu, setMenu] = useState(false)
  return <div className="admin-shell">
    <aside className={menu ? 'admin-sidebar open' : 'admin-sidebar'}>
      <div className="sidebar-top"><Brand compact /><button onClick={() => setMenu(false)}><X /></button></div>
      <div className="admin-badge"><span>P</span><div><strong>Presidente</strong><small>Administrador</small></div></div>
      <nav>{nav.map((item) => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => { setView(item.id); setMenu(false) }}><item.icon />{item.label}</button>)}</nav>
      <div className="sidebar-foot"><Link to="/" target="_blank"><ExternalLink /> Ver portal público</Link><button onClick={signOut}><LogOut /> Sair da conta</button></div>
    </aside>
    <main className="admin-main">
      <header className="admin-header"><button className="admin-menu" onClick={() => setMenu(true)}><Menu /></button><div><span>PAINEL ADMINISTRATIVO</span><strong>Olá, Presidente</strong></div>{demoMode && <span className="demo-chip">Modo demo</span>}</header>
      <div className="admin-content">
        {view === 'overview' && <Overview players={players} posts={posts} media={media} setView={setView} />}
        {view === 'ranking' && <RankingEditor />}
        {view === 'post' && <PostEditor setView={setView} />}
        {view === 'media' && <MediaEditor setView={setView} media={media} />}
      </div>
    </main>
  </div>
}

function PageTitle({ eyebrow, title, text }) {
  return <div className="admin-title"><span>{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>
}

function Overview({ players, posts, media, setView }) {
  const leader = [...players].sort((a, b) => b.points - a.points)[0]
  return <>
    <PageTitle eyebrow="RESUMO DA LIGA" title="Visão geral" text="Tudo o que está acontecendo na temporada." />
    <div className="stat-grid">
      <div className="stat-card"><span><Users /></span><small>JOGADORES</small><strong>{players.length}</strong><em>ativos na temporada</em></div>
      <div className="stat-card gold"><span><Trophy /></span><small>LÍDER ATUAL</small><strong>{leader?.nickname}</strong><em>{leader?.points} pontos</em></div>
      <div className="stat-card"><span><Newspaper /></span><small>RESENHAS</small><strong>{posts.length}</strong><em>publicadas</em></div>
      <div className="stat-card"><span><ImagePlus /></span><small>MÍDIAS</small><strong>{media.length}</strong><em>na galeria</em></div>
    </div>
    <div className="admin-grid-2">
      <section className="admin-card"><div className="card-head"><div><span>AÇÕES RÁPIDAS</span><h2>O que vamos atualizar?</h2></div></div><div className="quick-actions"><button onClick={() => setView('ranking')}><Trophy /><span><strong>Atualizar classificação</strong><small>Edite pontos, jogos e gols</small></span><b>→</b></button><button onClick={() => setView('post')}><Newspaper /><span><strong>Publicar resenha</strong><small>Conte como foi a rodada</small></span><b>→</b></button><button onClick={() => setView('media')}><ImagePlus /><span><strong>Adicionar mídia</strong><small>Fotos e vídeos da rodada</small></span><b>→</b></button></div></section>
      <section className="admin-card"><div className="card-head"><div><span>TOP 3</span><h2>Pódio da temporada</h2></div><BarChart3 /></div><div className="mini-ranking">{[...players].sort((a,b) => b.points-a.points).slice(0,3).map((p,i) => <div key={p.id}><b>{i+1}</b><span><strong>{p.name}</strong><small>{p.goals} gols em {p.games} jogos</small></span><em>{p.points} <small>PTS</small></em></div>)}</div></section>
    </div>
  </>
}

function RankingEditor() {
  const { players, updatePlayer } = useApp()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)
  const start = (player) => { setEditing(player.id); setForm({ ...player }); setSaved(false) }
  const save = async () => { await updatePlayer(form); setEditing(null); setSaved(true); setTimeout(() => setSaved(false), 2500) }
  return <>
    <div className="title-row"><PageTitle eyebrow="GESTÃO DE PONTOS" title="Classificação" text="Edite os números de cada jogador após a rodada." />{saved && <span className="success-toast"><Check /> Alterações salvas</span>}</div>
    <section className="admin-card table-card"><div className="editor-head"><span>POS</span><span>JOGADOR</span><span>JOGOS</span><span>VITÓRIAS</span><span>GOLS</span><span>PONTOS</span><span /></div>{[...players].sort((a,b) => b.points-a.points).map((player,i) => {
      const active = editing === player.id
      return <div className="editor-row" key={player.id}><b>{String(i+1).padStart(2,'0')}</b><span className="editor-player"><i>{player.name[0]}</i><strong>{player.name}<small>{player.nickname}</small></strong></span>{['games','wins','goals','points'].map((field) => active ? <input key={field} type="number" min="0" value={form[field]} onChange={(e) => setForm({ ...form, [field]: Number(e.target.value) })} /> : <span key={field}>{player[field]}</span>)}<button className={active ? 'save-row' : 'edit-row'} onClick={() => active ? save() : start(player)}>{active ? <Save /> : <Pencil />}</button></div>
    })}</section>
  </>
}

function PostEditor({ setView }) {
  const { addPost } = useApp()
  const [form, setForm] = useState({ round: 'Rodada 13', title: '', excerpt: '', content: '' })
  const [busy, setBusy] = useState(false)
  const submit = async (e) => { e.preventDefault(); setBusy(true); await addPost(form); setBusy(false); setView('overview') }
  return <><PageTitle eyebrow="CONTE A HISTÓRIA" title="Nova resenha" text="Publique o resumo da rodada para todo mundo ver." /><form className="admin-card editor-form" onSubmit={submit}><div className="form-grid"><label>Rodada<input value={form.round} onChange={(e) => setForm({...form, round:e.target.value})} required /></label><label className="wide">Título da resenha<input value={form.title} onChange={(e) => setForm({...form, title:e.target.value})} placeholder="Ex: Virada histórica no campo 2" required /></label><label className="full">Chamada curta<textarea rows="2" value={form.excerpt} onChange={(e) => setForm({...form, excerpt:e.target.value})} placeholder="Um resumo que vai aparecer em destaque..." required /></label><label className="full">Resenha completa<textarea rows="9" value={form.content} onChange={(e) => setForm({...form, content:e.target.value})} placeholder="Conte os destaques, as polêmicas e os momentos da rodada..." required /></label></div><div className="form-footer"><small>{form.content.length} caracteres</small><button className="btn-primary" disabled={busy}><Newspaper /> {busy ? 'Publicando...' : 'Publicar resenha'}</button></div></form></>
}

function MediaEditor({ setView, media }) {
  const { addMedia, uploadMediaFile } = useApp()
  const [form, setForm] = useState({ type: 'photo', title: '', url: '', thumbnail: '' })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const selectFile = (event) => {
    const selected = event.target.files?.[0]
    setError('')
    if (!selected) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
      setError('Escolha uma imagem JPEG, PNG ou WebP.')
      event.target.value = ''
      return
    }
    if (selected.size > 8 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 8 MB.')
      event.target.value = ''
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (form.type === 'photo' && !file) { setError('Selecione uma imagem para publicar.'); return }
    setBusy(true); setError('')
    try {
      const url = form.type === 'photo' ? await uploadMediaFile(file) : form.url
      await addMedia({ ...form, url })
      if (preview) URL.revokeObjectURL(preview)
      setForm({ type: 'photo', title: '', url: '', thumbnail: '' })
      setFile(null); setPreview(''); setView('overview')
    } catch (err) { setError(err.message || 'Não foi possível publicar a mídia.') }
    finally { setBusy(false) }
  }

  const changeType = (type) => { setForm({ ...form, type }); setError('') }
  return <><PageTitle eyebrow="MELHORES MOMENTOS" title="Galeria de mídia" text={`${media.length} itens publicados. Envie fotos do dispositivo ou adicione links de vídeos.`} /><form className="admin-card editor-form" onSubmit={submit}><div className="type-picker"><button type="button" className={form.type==='photo'?'active':''} onClick={() => changeType('photo')}><ImagePlus /> Foto</button><button type="button" className={form.type==='video'?'active':''} onClick={() => changeType('video')}><Plus /> Vídeo</button></div><div className="form-grid"><label className="full">Título<input value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} placeholder="Ex: Campeões da Rodada 13" required /></label>{form.type === 'photo' ? <label className="full upload-field"><span>Imagem</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectFile} /><span className={preview ? 'upload-zone has-preview' : 'upload-zone'}>{preview ? <img src={preview} alt="Prévia da imagem selecionada" /> : <><UploadCloud /><strong>Escolher imagem</strong><small>JPEG, PNG ou WebP · máximo 8 MB</small></>}</span></label> : <><label className="full">Link do YouTube ou Instagram<input type="url" value={form.url} onChange={(e) => setForm({...form,url:e.target.value})} placeholder="https://..." required /></label><label className="full">URL da capa do vídeo (opcional)<input type="url" value={form.thumbnail} onChange={(e) => setForm({...form,thumbnail:e.target.value})} placeholder="https://..." /></label></>}</div>{error && <p className="upload-error">{error}</p>}<div className="form-footer"><small>{form.type === 'photo' ? 'A imagem será armazenada no Supabase.' : 'O vídeo continuará hospedado na plataforma original.'}</small><button className="btn-primary" disabled={busy}><Plus /> {busy ? 'Enviando...' : 'Adicionar à galeria'}</button></div></form></>
}
