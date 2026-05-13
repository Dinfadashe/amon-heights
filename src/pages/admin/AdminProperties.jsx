import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/utils'
import s from './AdminProperties.module.css'

export default function AdminProperties() {
  const [props, setProps] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeF, setTypeF] = useState('')

  useEffect(() => { fetchProps() }, [])

  async function fetchProps() {
    const {data} = await supabase.from('properties').select('*, profiles(full_name)').order('created_at',{ascending:false})
    setProps(data||[])
    setLoading(false)
  }

  async function deleteProperty(id) {
    if(!confirm('Delete this property? This cannot be undone.')) return
    const {error} = await supabase.from('properties').delete().eq('id',id)
    if(error) { toast.error('Failed to delete'); return }
    toast.success('Property deleted')
    fetchProps()
  }

  async function toggleFeatured(id, current) {
    await supabase.from('properties').update({is_featured:!current}).eq('id',id)
    fetchProps()
  }

  const filtered = props.filter(p => {
    const ms = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.location?.toLowerCase().includes(search.toLowerCase())
    const mt = !typeF || p.listing_type===typeF
    return ms && mt
  })

  const TB = {Sale:'b-navy',Rent:'b-red',Shortlet:'b-gold',Land:'b-green'}

  return (
    <AdminLayout title="Properties">
      <div className={s.topBar}>
        <div className={s.filters}>
          <div className={s.sb}><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search properties..."/></div>
          <select value={typeF} onChange={e=>setTypeF(e.target.value)} className={s.sel}>
            <option value="">All Types</option>
            {['Sale','Rent','Shortlet','Land'].map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Link to="/admin/properties/new" className="btn btn-primary"><Plus size={16}/>Add Property</Link>
      </div>

      {loading ? <div className="page-loader"><div className="spinner"/></div> : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Property</th><th>Type</th><th>Price</th><th>Location</th><th>Status</th><th>Source</th><th>Listed By</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={9} style={{textAlign:'center',color:'var(--gray-400)',padding:'2.5rem'}}>No properties found</td></tr>
              ) : filtered.map(p=>(
                <tr key={p.id}>
                  <td>
                    <div className={s.propCell}>
                      {p.images?.[0] && <img src={p.images[0]} alt="" className={s.thumb}/>}
                      <div><strong style={{fontSize:'.87rem'}}>{p.title}</strong></div>
                    </div>
                  </td>
                  <td><span className={`badge ${TB[p.listing_type]||'b-navy'}`}>{p.listing_type}</span></td>
                  <td style={{fontSize:'.84rem',fontWeight:600,color:'var(--red)'}}>{formatPrice(p.price)}</td>
                  <td style={{fontSize:'.83rem'}}>{p.location}</td>
                  <td><span className={`badge ${p.status==='Available'?'b-green':p.status==='Sold'?'b-navy':'b-gray'}`}>{p.status}</span></td>
                  <td style={{fontSize:'.82rem'}}>{p.source||'—'}</td>
                  <td style={{fontSize:'.82rem'}}>{p.profiles?.full_name||'Admin'}</td>
                  <td>
                    <button className={s.starBtn} onClick={()=>toggleFeatured(p.id,p.is_featured)} title={p.is_featured?'Remove featured':'Mark featured'}>
                      <Star size={16} fill={p.is_featured?'var(--gold)':'none'} color={p.is_featured?'var(--gold)':'var(--gray-300)'}/>
                    </button>
                  </td>
                  <td>
                    <div className={s.acts}>
                      <Link to={`/admin/properties/edit/${p.id}`} className={s.editBtn}><Pencil size={13}/>Edit</Link>
                      <button className={s.delBtn} onClick={()=>deleteProperty(p.id)}><Trash2 size={13}/>Delete</button>
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
