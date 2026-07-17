import { useMemo, useState } from 'react'
import './App.css'

const postKey = 'manga-cafe-finder.ugc'
const saveKey = 'manga-cafe-finder.saved'

const cafes = [
  {
    id: 'meieki-night-booth',
    name: '名駅ナイトブース',
    area: '名古屋',
    station: '名古屋',
    type: 'ネットカフェ',
    price: 1980,
    walk: 4,
    rating: 4.3,
    status: '営業中',
    checked: '2026-07-18',
    privateRoom: true,
    shower: true,
    smoking: true,
    womenOnly: false,
    overnight: true,
    tags: ['鍵付き個室', 'シャワー', '深夜パック', '喫煙席'],
    note: '高速バス到着後の仮眠、シャワー、スマホ充電に向く駅近店舗。宿が高い日の代替ニーズを拾える。',
  },
  {
    id: 'sakae-comic-lounge',
    name: '栄コミックラウンジ',
    area: '名古屋',
    station: '栄',
    type: '漫画喫茶',
    price: 1280,
    walk: 3,
    rating: 4.1,
    status: '営業中',
    checked: '2026-07-18',
    privateRoom: false,
    shower: false,
    smoking: false,
    womenOnly: true,
    overnight: false,
    tags: ['女性専用席', '短時間', 'ドリンクバー', '駅近'],
    note: '待ち合わせ前や買い物の合間に使いやすい短時間向け。女性専用席の有無が検索流入を作りやすい。',
  },
  {
    id: 'shizuoka-bus-cafe',
    name: '静岡バスステイカフェ',
    area: '静岡',
    station: '静岡',
    type: 'ネットカフェ',
    price: 2200,
    walk: 5,
    rating: 4.0,
    status: '営業中',
    checked: '2026-07-18',
    privateRoom: true,
    shower: true,
    smoking: false,
    womenOnly: true,
    overnight: true,
    tags: ['夜行バス向け', '女性専用エリア', 'シャワー', '仮眠'],
    note: '夜行バス明けの休憩導線に強い。BusStayとの姉妹導線として宿泊比較にもつなげられる。',
  },
  {
    id: 'umeda-work-cafe',
    name: '梅田ワークコミック',
    area: '大阪',
    station: '梅田',
    type: 'ワークブース',
    price: 1680,
    walk: 6,
    rating: 4.2,
    status: '営業中',
    checked: '2026-07-18',
    privateRoom: true,
    shower: false,
    smoking: false,
    womenOnly: false,
    overnight: true,
    tags: ['鍵付き個室', '電源', 'オンライン会議', '深夜営業'],
    note: '漫画喫茶からワークブース用途へ広げられる店舗。仕事、仮眠、終電後の滞在で広告単価を上げやすい。',
  },
  {
    id: 'shinjuku-smoke-cafe',
    name: '新宿スモークネット',
    area: '東京',
    station: '新宿',
    type: 'ネットカフェ',
    price: 2480,
    walk: 7,
    rating: 3.9,
    status: '要確認',
    checked: '2026-07-18',
    privateRoom: true,
    shower: true,
    smoking: true,
    womenOnly: false,
    overnight: true,
    tags: ['喫煙可', 'シャワー', '深夜', '混雑注意'],
    note: '喫煙可・深夜営業は検索意図が強い。UGCで混雑、満席、改装、閉店の確認を集めたい。',
  },
  {
    id: 'closed-archive',
    name: '閉店アーカイブ: 駅前コミック館',
    area: '東京',
    station: '池袋',
    type: '閉店アーカイブ',
    price: 0,
    walk: 2,
    rating: 3.8,
    status: '閉店',
    checked: '2026-07-18',
    privateRoom: false,
    shower: false,
    smoking: false,
    womenOnly: false,
    overnight: false,
    tags: ['閉店情報', '思い出投稿', '代替店舗'],
    note: '閉店情報を残すことで検索流入と代替店舗送客を作る。ユーザーの思い出レビューもUGC化できる。',
  },
]

const revenuePlans = [
  ['店舗送客広告', '駅名、設備条件、深夜利用ニーズに合わせて店舗広告や優先掲載を配置。'],
  ['クーポン・会員登録', '初回30分無料、シャワー割引、深夜パックなどのクーポンでCVを作る。'],
  ['宿泊・交通連携', '夜行バス、高速バス、ホテル、カプセル、コインロッカーへ送客。'],
  ['電子書籍・動画広告', '漫画作品ランキングや読書履歴投稿から電子書籍、映像サービスへ導線化。'],
  ['確認済み掲載枠', '店舗が設備、価格、女性専用、喫煙、閉店情報を更新できる有料プラン。'],
]

const buzzIdeas = [
  '夜行バス明けに使えるシャワー付きネットカフェランキング',
  '女性専用席がある漫画喫茶マップ',
  '閉店した漫画喫茶の思い出レビュー募集',
  '終電後に泊まれる駅近ネットカフェ特集',
  '鍵付き個室・喫煙可・シャワーありの条件別まとめ',
]

const faq = [
  ['ネットカフェと漫画喫茶の違いは？', '漫画・ドリンク・個室に加え、近年は鍵付き個室、シャワー、ワークブース、仮眠用途まで含む施設が増えています。'],
  ['AIに引用されやすいページにするには？', '店名、駅、徒歩分、料金、設備、営業状況、確認日、口コミの要約を短い単位で表示します。'],
  ['UGCをどう収益化しますか？', '投稿で設備の実態を補完し、確認済み掲載、クーポン、優先表示、周辺宿泊・交通広告へつなげます。'],
]

function readArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? []
  } catch {
    return []
  }
}

function yen(value) {
  return value === 0
    ? '無料'
    : new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(value)
}

function App() {
  const [query, setQuery] = useState('名古屋')
  const [area, setArea] = useState('すべて')
  const [filters, setFilters] = useState({ privateRoom: true, shower: false, smoking: false, womenOnly: false, overnight: true })
  const [posts, setPosts] = useState(() => readArray(postKey))
  const [saved, setSaved] = useState(() => readArray(saveKey))
  const [form, setForm] = useState({ name: '', area: '', type: '設備確認', memo: '' })

  const areas = ['すべて', ...new Set(cafes.map((cafe) => cafe.area))]
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase()
    return cafes
      .filter((cafe) => area === 'すべて' || cafe.area === area)
      .filter((cafe) => !filters.privateRoom || cafe.privateRoom)
      .filter((cafe) => !filters.shower || cafe.shower)
      .filter((cafe) => !filters.smoking || cafe.smoking)
      .filter((cafe) => !filters.womenOnly || cafe.womenOnly)
      .filter((cafe) => !filters.overnight || cafe.overnight)
      .filter((cafe) => !text || `${cafe.name} ${cafe.area} ${cafe.station} ${cafe.type} ${cafe.tags.join(' ')} ${cafe.note}`.toLowerCase().includes(text))
      .sort((a, b) => Number(b.status === '営業中') - Number(a.status === '営業中') || b.rating - a.rating || a.walk - b.walk)
  }, [area, filters, query])
  const display = filtered.length ? filtered : cafes

  const submitPost = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.memo.trim()) return
    const next = [{ ...form, id: crypto.randomUUID(), status: '確認待ち', date: new Date().toLocaleDateString('ja-JP') }, ...posts].slice(0, 8)
    setPosts(next)
    localStorage.setItem(postKey, JSON.stringify(next))
    setForm({ name: '', area: '', type: '設備確認', memo: '' })
  }

  const toggleSaved = (id) => {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem(saveKey, JSON.stringify(next))
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <span className="brand">Manga Cafe Finder</span>
          <h1>漫画喫茶・ネットカフェを、設備と口コミで最短検索。</h1>
          <p>
            個室、シャワー、喫煙、女性専用、深夜滞在、閉店情報をまとめて比較。UGCで設備の実態を更新し、店舗送客・クーポン・宿泊交通連携まで収益化します。
          </p>
        </div>
        <aside className="answer-box">
          <span>AI向け即答</span>
          <strong>駅名、徒歩分、料金、設備、営業状況、確認日を1カードで提示</strong>
          <p>検索エンジンとAI回答が引用しやすいよう、店舗情報と口コミを短く構造化します。</p>
        </aside>
      </section>

      <section className="search-panel" aria-label="漫画喫茶検索">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="駅名・地域・設備で検索" />
        <select value={area} onChange={(event) => setArea(event.target.value)}>
          {areas.map((item) => <option key={item}>{item}</option>)}
        </select>
      </section>

      <section className="filter-row" aria-label="設備フィルター">
        {Object.entries({ privateRoom: '個室', shower: 'シャワー', smoking: '喫煙可', womenOnly: '女性専用', overnight: '深夜滞在' }).map(([key, label]) => (
          <button key={key} type="button" className={filters[key] ? 'active' : ''} onClick={() => setFilters({ ...filters, [key]: !filters[key] })}>
            {label}
          </button>
        ))}
      </section>

      <section className="summary-grid">
        <article><span>掲載候補</span><strong>{cafes.length}</strong><p>営業中・要確認・閉店を分けて管理</p></article>
        <article><span>検索結果</span><strong>{display.length}</strong><p>設備条件と口コミで絞り込み</p></article>
        <article><span>保存済み</span><strong>{saved.length}</strong><p>遠征前・終電後の比較に使える</p></article>
      </section>

      <section className="content-grid">
        {display.map((cafe) => (
          <article className={cafe.status === '閉店' ? 'card closed' : 'card'} key={cafe.id}>
            <div className="card-topline">
              <span>{cafe.area} / {cafe.station}</span>
              <span>{cafe.status}</span>
            </div>
            <h2>{cafe.name}</h2>
            <p>{cafe.note}</p>
            <div className="tag-row">{cafe.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="metric-row">
              <span>徒歩{cafe.walk}分</span>
              <span>{yen(cafe.price)}</span>
              <strong>{cafe.rating}</strong>
            </div>
            <small>確認日: {cafe.checked}</small>
            <button type="button" onClick={() => toggleSaved(cafe.id)}>{saved.includes(cafe.id) ? '保存済み' : '候補に保存'}</button>
          </article>
        ))}
      </section>

      <section className="ugc-section">
        <div>
          <span className="brand">UGC</span>
          <h2>設備・混雑・閉店情報を投稿</h2>
          <p>ユーザー投稿を、確認待ち情報、ランキング記事、店舗向け有料更新枠へ展開します。</p>
        </div>
        <form className="ugc-form" onSubmit={submitPost}>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="店舗名" />
          <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="駅・地域" />
          <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option>設備確認</option>
            <option>口コミ・レビュー</option>
            <option>閉店情報</option>
            <option>クーポン情報</option>
          </select>
          <input value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} placeholder="シャワー待ち・個室・喫煙・混雑など" />
          <button type="submit">投稿する</button>
        </form>
        <div className="post-grid">
          {posts.length === 0 && <p className="empty-text">まだ投稿はありません。最初の設備確認を投稿できます。</p>}
          {posts.map((post) => (
            <article key={post.id}>
              <span>{post.type} / {post.status}</span>
              <h3>{post.name}</h3>
              <p>{post.memo}</p>
              <small>{post.area || 'エリア未入力'} / {post.date}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="growth-grid">
        <div className="revenue-panel">
          <h2>収益導線</h2>
          {revenuePlans.map(([title, text]) => <article key={title}><strong>{title}</strong><p>{text}</p></article>)}
        </div>
        <div className="buzz-panel">
          <h2>バズ施策</h2>
          <ul>{buzzIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ul>
        </div>
      </section>

      <section className="seo-section">
        <div className="answer-box">
          <span className="brand">SEO / AIO / LLMO</span>
          <h2>漫画喫茶・ネットカフェは、駅名、設備、深夜利用、口コミ、閉店情報をまとめると検索にもAI回答にも強くなります。</h2>
          <p>店舗名、駅、徒歩分、料金、設備、営業状況、確認日、UGCステータスを同じ形式で表示し、AIが引用しやすい情報単位にしています。</p>
        </div>
        <div className="faq-grid">
          {faq.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}
        </div>
      </section>
    </main>
  )
}

export default App
