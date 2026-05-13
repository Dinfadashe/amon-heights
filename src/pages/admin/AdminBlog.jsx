import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'
import { formatDateShort } from '../../lib/utils'
import s from './AdminProperties.module.css'

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPosts() }, [])
  async function fetchPosts() {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }
  async function deletePost(id) {
    if (!confirm('Delete this blog post?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    toast.success('Post deleted')
    fetchPosts()
  }
  async function togglePublish(id, current) {
    await supabase.from('blog_posts').update({ published: !current }).eq('id', id)
    fetchPosts()
  }

  return (
    <AdminLayout title="Blog Posts">
      <div className={s.topBar}>
        <span style={{fontSize:'.87rem',color:'var(--gray-500)'}}>{posts.length} post{posts.length!==1?'s':''}</span>
        <Link to="/admin/blog/new" className="btn btn-primary"><Plus size={16}/>New Post</Link>
      </div>
      {loading ? <div className="page-loader"><div className="spinner"/></div> : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Date</th><th>Published</th><th>Actions</th></tr></thead>
            <tbody>
              {posts.length===0 ? (
                <tr><td colSpan={6} style={{textAlign:'center',color:'var(--gray-400)',padding:'2.5rem'}}>No blog posts yet</td></tr>
              ) : posts.map(p => (
                <tr key={p.id}>
                  <td><strong style={{fontSize:'.87rem'}}>{p.title}</strong></td>
                  <td style={{fontSize:'.83rem'}}>{p.category||'—'}</td>
                  <td style={{fontSize:'.83rem'}}>{p.author||'—'}</td>
                  <td style={{fontSize:'.82rem'}}>{formatDateShort(p.created_at)}</td>
                  <td>
                    <button onClick={()=>togglePublish(p.id,p.published)} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'.3rem',fontSize:'.82rem',color:p.published?'var(--green)':'var(--gray-400)'}}>
                      {p.published?<Eye size={15}/>:<EyeOff size={15}/>}{p.published?'Live':'Draft'}
                    </button>
                  </td>
                  <td>
                    <div className={s.acts}>
                      <Link to={`/admin/blog/edit/${p.id}`} className={s.editBtn}><Pencil size={13}/>Edit</Link>
                      <button className={s.delBtn} onClick={()=>deletePost(p.id)}><Trash2 size={13}/>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
