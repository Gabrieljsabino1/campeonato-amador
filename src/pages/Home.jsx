import { ArrowDown, ArrowRight, ArrowUp, CalendarDays, ChevronRight, CirclePlay, Crown, Minus, Newspaper, Sparkles, Trophy } from 'lucide-react'
import Header from '../components/Header'
import SectionTitle from '../components/SectionTitle'
import Brand from '../components/Brand'
import { useApp } from '../store/AppContext'

const initials = (name) => name.split(' ').map((word) => word[0]).join('').slice(0, 2)

function Ranking({ players }) {
  const sorted = [...players].sort((a, b) => b.points - a.points)
  return (
    <section id="ranking" className="section container">
      <SectionTitle eyebrow="Temporada 2026" title="Classificação geral" description="Pontuação atualizada após a última rodada." action={<span className="live-pill"><i /> Atualizado agora</span>} />
      <div className="ranking-card">
        <div className="ranking-head"><span>POS</span><span>JOGADOR</span><span>J</span><span>V</span><span>GOLS</span><span>PTS</span></div>
        {sorted.map((player, index) => {
          const position = index + 1
          return <div className={`ranking-row ${position <= 3 ? `top-${position}` : ''}`} key={player.id}>
            <div className="position">{position === 1 ? <Crown size={18} /> : String(position).padStart(2, '0')}<span className={`trend ${player.trend > 0 ? 'up' : player.trend < 0 ? 'down' : ''}`}>{player.trend > 0 ? <ArrowUp /> : player.trend < 0 ? <ArrowDown /> : <Minus />}</span></div>
            <div className="player-cell"><span className="avatar">{initials(player.name)}</span><span><strong>{player.name}</strong><small>{player.nickname}</small></span></div>
            <span data-label="Jogos">{player.games}</span><span data-label="Vitórias">{player.wins}</span><span data-label="Gols">{player.goals}</span><strong className="points">{player.points}</strong>
          </div>
        })}
        <div className="ranking-note"><span><i className="legend gold" /> Pódio</span><span><i className="legend green" /> Em ascensão</span><small>J = Jogos &nbsp; V = Vitórias &nbsp; PTS = Pontos</small></div>
      </div>
    </section>
  )
}

function WeeklyPost({ post }) {
  if (!post) return null
  return (
    <section id="resenha" className="recap-section">
      <div className="container recap-grid">
        <div>
          <span className="eyebrow"><Sparkles size={14} /> Resenha da semana</span>
          <p className="round-label"><CalendarDays size={15} /> {post.round}</p>
          <h2>{post.title}</h2>
          <p className="recap-lead">{post.excerpt}</p>
          <p className="recap-copy">{post.content}</p>
          <span className="ai-label"><Sparkles size={13} /> Resenha turbinada com IA</span>
        </div>
        <div className="quote-card">
          <Newspaper size={30} />
          <blockquote>“A bola pune. Mas o grupo do WhatsApp pune ainda mais.”</blockquote>
          <span>Frase da rodada</span>
          <div className="score-stamp"><Trophy /><strong>14</strong><small>gols na rodada</small></div>
        </div>
      </div>
    </section>
  )
}

function Gallery({ media }) {
  return (
    <section id="galeria" className="section container gallery-section">
      <SectionTitle eyebrow="Momentos da liga" title="Galeria da resenha" description="Fotos dos campeões e os lances que merecem replay." />
      <div className="gallery-grid">
        {media.slice(0, 3).map((item, i) => <a className={`media-card media-${i + 1}`} href={item.url} target="_blank" rel="noreferrer" key={item.id}>
          <img src={item.thumbnail || item.url} alt={item.title} />
          <span className="shade" />
          {item.type === 'video' && <span className="play"><CirclePlay /></span>}
          <span className="media-copy"><small>{item.type === 'video' ? 'VÍDEO' : 'FOTO'} · {item.date}</small><strong>{item.title}</strong><em>Ver agora <ChevronRight /></em></span>
        </a>)}
      </div>
    </section>
  )
}

export default function Home() {
  const { players, posts, media } = useApp()
  return <>
    <Header />
    <main>
      <section className="hero">
        <div className="hero-texture" />
        <div className="container hero-content">
          <span className="season-tag">TEMPORADA 2026 <i /> RODADA 12</span>
          <h1>FUTEBOL DE <span>AMIGOS.</span><br />COMPETIÇÃO DE VERDADE.</h1>
          <p>O portal oficial da nossa liga. Classificação, resenha e os melhores momentos de cada rodada.</p>
          <div className="hero-actions"><a className="btn-primary" href="#ranking">Ver classificação <ArrowRight /></a><a className="text-link" href="#resenha">Ler a última resenha <ArrowDown /></a></div>
          <div className="hero-stats"><span><strong>{players.length}</strong><small>JOGADORES</small></span><span><strong>12</strong><small>RODADAS</small></span><span><strong>{players.reduce((sum, player) => sum + player.goals, 0)}</strong><small>GOLS</small></span></div>
        </div>
        <div className="hero-number">12</div>
      </section>
      <Ranking players={players} />
      <WeeklyPost post={posts[0]} />
      <Gallery media={media} />
    </main>
    <footer><div className="container footer-inner"><Brand compact /><p>Feito para quem leva a resenha a sério.</p><span>© 2026 Liga dos Amigos</span></div></footer>
  </>
}
