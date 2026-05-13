import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../lib/utils'
import { BLOG_CATEGORIES } from '../../lib/constants'
import { useAuth } from '../../context/AuthContext'
import s from '../../components/shared/PropertyForm.module.css'

const schema = z.object({
  title: z.string().min(3,'Title required'),
  slug: z.string().min(3,'Slug required'),
  category: z.string().optional(),
  author: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10,'Content required'),
  cover_image: z.string().optional(),
  published: z.boolean().optional(),
})

export default function AdminBlogForm() {
  const { id } = useParams()
  const isEdit = !!id
  const nav = useNavigate()
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, setValue, formState:{errors} } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { published: false, author: profile?.full_name||'' }
  })
  const title = watch('title')
  useEffect(() => { if(title && !isEdit) setValue('slug', slugify(title)) }, [title])
  useEffect(() => {
    if(!isEdit) return
    supabase.from('blog_posts').select('*').eq('id',id).single().then(({data}) => {
      if(!data) return
      Object.entries(data).forEach(([k,v]) => { if(v!==null) setValue(k,v) })
    })
  }, [id])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = { ...data, published: data.published||false }
      let error
      if(isEdit) { ({error}=await supabase.from('blog_posts').update(payload).eq('id',id)) }
      else { ({error}=await supabase.from('blog_posts').insert(payload)) }
      if(error) throw error
      toast.success(`Post ${isEdit?'updated':'created'}!`)
      nav('/admin/blog')
    } catch(err) { toast.error(err.message||'Failed to save') }
    finally { setLoading(false) }
  }

  return (
    <AdminLayout title={isEdit?'Edit Blog Post':'New Blog Post'}>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <div className={s.sec}>
          <h3 className={s.sh}>Post Details</h3>
          <div className="fg"><label className="fl">Title *</label>
            <input {...register('title')} className={`fi ${errors.title?'err':''}`} placeholder="Blog post title"/>
            {errors.title && <span className="fe">{errors.title.message}</span>}
          </div>
          <div className="g2">
            <div className="fg"><label className="fl">Slug *</label>
              <input {...register('slug')} className={`fi ${errors.slug?'err':''}`}/>
              {errors.slug && <span className="fe">{errors.slug.message}</span>}
            </div>
            <div className="fg"><label className="fl">Category</label>
              <select {...register('category')} className="fs">
                <option value="">Select category</option>
                {BLOG_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="g2">
            <div className="fg"><label className="fl">Author</label>
              <input {...register('author')} className="fi" placeholder="Author name"/>
            </div>
            <div className="fg"><label className="fl">Cover Image URL</label>
              <input {...register('cover_image')} className="fi" placeholder="https://..."/>
            </div>
          </div>
          <div className="fg"><label className="fl">Excerpt (short description)</label>
            <textarea {...register('excerpt')} className="fta" rows={2} placeholder="Brief summary shown in blog listing"/>
          </div>
          <div className="fg"><label className="fl">Content *</label>
            <textarea {...register('content')} className={`fta ${errors.content?'err':''}`} rows={14} placeholder="Full blog post content..."/>
            {errors.content && <span className="fe">{errors.content.message}</span>}
          </div>
          <div className="fg">
            <label className="chk-label">
              <input type="checkbox" {...register('published')}/>
              <span><strong>Publish immediately</strong> — Uncheck to save as draft</span>
            </label>
          </div>
        </div>
        <div className={s.actBar}>
          <button type="button" className="btn btn-outline" onClick={()=>nav('/admin/blog')}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>{loading?'Saving...':isEdit?'Update Post':'Publish Post'}</button>
        </div>
      </form>
    </AdminLayout>
  )
}
