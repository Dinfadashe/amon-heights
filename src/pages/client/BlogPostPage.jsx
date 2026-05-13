import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/utils'
import s from './BlogPostPage.module.css'

export default function BlogPostPage() {
  const {slug} = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.from('blog_posts').select('*').or(`slug.eq.${slug},id.eq.${slug}`).single()
      .then(({data}) => { setPost(data); setLoading(false) })
  }, [slug])
  if(loading) return <PublicLayout><div className="page-loader" style={{minHeight:'80vh'}}><div className="spinner"/></div></PublicLayout>
  if(!post) return <PublicLayout><div className={s.nf}><h2>Post Not Found</h2><Link to="/blog" className="btn btn-primary">Back to Blog</Link></div></PublicLayout>
  return (
    <PublicLayout>
      <div className={s.hero} style={post.cover_image?{backgroundImage:`url(${post.cover_image})`}:{}}>
        <div className={s.hov}/>
        <div className={`container ${s.hcont}`}>
          {post.category && <span className={s.cat}>{post.category}</span>}
          <h1 className={s.ht}>{post.title}</h1>
          <div className={s.meta}>
            <span><Calendar size={14}/>{formatDate(post.created_at)}</span>
            {post.author && <span><User size={14}/>{post.author}</span>}
          </div>
        </div>
      </div>
      <section className="section"><div className="container">
        <div className={s.layout}>
          <div className={s.content}>
            <Link to="/blog" className={s.back}><ArrowLeft size={15}/>Back to Blog</Link>
            <div className={s.body} dangerouslySetInnerHTML={{__html: post.content?.replace(/\n/g,'<br/>')||''}}/>
          </div>
          <aside className={s.aside}>
            <div className={s.acard}>
              <h3 className={s.ah}>About Amon Heights</h3>
              <img src="/logo.jpg" alt="Amon Heights" className={s.alogo}/>
              <p className={s.ap}>Your trusted real estate partner in Abuja. Browse our verified property listings.</p>
              <Link to="/properties" className="btn btn-primary btn-sm" style={{width:'100%',justifyContent:'center',marginTop:'.75rem'}}>View Properties</Link>
            </div>
          </aside>
        </div>
      </div></section>
    </PublicLayout>
  )
}
