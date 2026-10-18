import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { initialMedia, initialPlayers, initialPosts } from '../data/mockData'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const AppContext = createContext(null)
const readLocal = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback }
}

export function AppProvider({ children }) {
  const [players, setPlayers] = useState(() => readLocal('liga_players', initialPlayers))
  const [posts, setPosts] = useState(() => readLocal('liga_posts', initialPosts))
  const [media, setMedia] = useState(() => readLocal('liga_media', initialMedia))
  const [user, setUser] = useState(() => readLocal('liga_user', null))
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return
    const load = async () => {
      const [playersResult, postsResult, mediaResult, sessionResult] = await Promise.all([
        supabase.from('players').select('*').order('points', { ascending: false }),
        supabase.from('posts').select('*').order('published_at', { ascending: false }),
        supabase.from('media').select('*').order('created_at', { ascending: false }),
        supabase.auth.getSession(),
      ])
      if (playersResult.data?.length) setPlayers(playersResult.data)
      if (postsResult.data?.length) setPosts(postsResult.data)
      if (mediaResult.data?.length) setMedia(mediaResult.data)
      setUser(sessionResult.data.session?.user || null)
      setLoading(false)
    }
    load()
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => { if (!isSupabaseConfigured) localStorage.setItem('liga_players', JSON.stringify(players)) }, [players])
  useEffect(() => { if (!isSupabaseConfigured) localStorage.setItem('liga_posts', JSON.stringify(posts)) }, [posts])
  useEffect(() => { if (!isSupabaseConfigured) localStorage.setItem('liga_media', JSON.stringify(media)) }, [media])

  const signIn = async (email, password) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setUser(data.user)
      return
    }
    if (email !== 'admin@ligadosamigos.com' || password !== 'admin123') throw new Error('E-mail ou senha incorretos.')
    const demoUser = { email, id: 'demo-admin' }
    localStorage.setItem('liga_user', JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut()
    localStorage.removeItem('liga_user')
    setUser(null)
  }

  const updatePlayer = async (updated) => {
    if (supabase) {
      const { error } = await supabase.from('players').update(updated).eq('id', updated.id)
      if (error) throw error
    }
    setPlayers((current) => current.map((p) => p.id === updated.id ? updated : p))
  }

  const addPost = async (post) => {
    const record = { ...post, published_at: new Date().toISOString() }
    if (supabase) {
      const { data, error } = await supabase.from('posts').insert(record).select().single()
      if (error) throw error
      setPosts((current) => [data, ...current])
    } else setPosts((current) => [{ ...record, id: Date.now() }, ...current])
  }

  const addMedia = async (item) => {
    if (supabase) {
      const { data, error } = await supabase.from('media').insert(item).select().single()
      if (error) throw error
      setMedia((current) => [data, ...current])
    } else setMedia((current) => [{ ...item, id: Date.now(), date: 'AGORA' }, ...current])
  }

  const uploadMediaFile = async (file) => {
    if (!supabase) {
      return await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'))
        reader.readAsDataURL(file)
      })
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filePath = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`
    const { error } = await supabase.storage.from('media').upload(filePath, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    })
    if (error) throw error
    const { data } = supabase.storage.from('media').getPublicUrl(filePath)
    return data.publicUrl
  }

  const value = useMemo(() => ({ players, posts, media, user, loading, signIn, signOut, updatePlayer, addPost, addMedia, uploadMediaFile, demoMode: !isSupabaseConfigured }), [players, posts, media, user, loading])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// The provider and its hook intentionally live together as one public store module.
// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext)
