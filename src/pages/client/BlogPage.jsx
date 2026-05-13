import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import { supabase } from '../../lib/supabase'
import { formatDateShort, truncate } from '../../lib/utils'
import s from './BlogPage.module.css'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('published',true).order('created_at',{ascending:false})
      .then(({data}) => { setPosts(data||[]); setLoading(false) })
  }, [])
  return (
    <PublicLayout>
      <div className={s.hdr}><div className="container">
        <h1 className={s.ht}>Blog & Resources</h1>
        <p className={s.hs}>Real estate tips, market updates and investment insights for Abuja</p>
      </div></div>
      <section className="section"><div className="container">
        {loading ? <div className="page-loader"><div className="spinner"/></div>
        : posts.length>0 ? (
          <div className={s.grid}>
            {posts.map(p => (
              <div key={p.id} className={`card ${s.post}`}>
                {p.cover_image && <Link to={`/blog/${p.slug||p.id}`} className={s.pimg}><img src={p.cover_image} alt={p.title} loading="lazy"/></Link>}
                <div className={s.pbody}>
                  {p.category && <span className={s.pcat}>{p.category}</span>}
                  <Link to={`/blog/${p.slug||p.id}`}><h2 className={s.ptitle}>{p.title}</h2></Link>
                  <p className={s.pexc}>{truncate(p.excerpt||p.content,130)}</p>
                  <div className={s.pmeta}>
                    <span><Calendar size={13}/>{formatDateShort(p.created_at)}</span>
                    {p.author && <span><User size={13}/>{p.author}</span>}
                  </div>
                  <Link to={`/blog/${p.slug||p.id}`} className="btn btn-outline btn-sm" style={{marginTop:'.85rem'}}>Read More</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={s.empty}><h3>No blog posts yet</h3><p>Check back soon for real estate tips and market insights!</p></div>
        )}
      </div></section>
    </PublicLayout>
  )
}
