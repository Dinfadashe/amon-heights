import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import StaffLayout from '../../components/layout/StaffLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { formatPrice, formatDateShort } from '../../lib/utils'
import s from '../admin/AdminProperties.module.css'

export default function StaffProperties() {
  const { user } = useAuth()
  const [props, setProps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProps() }, [user])

  async function fetchProps() {
    if (!user) return
    const { data } = await supabase.from('properties').select('*').eq('created_by', user.id).order('created_at', { ascending: false })
    setProps(data || [])
    setLoading(false)
  }

  async function deleteProperty(id) {
    if (!confirm('Delete this property?')) return
    await supabase.from('properties').delete().eq('id', id)
    toast.success('Property deleted')
    fetchProps()
  }

  const TB = {Sale:'b-navy',Rent:'b-red',Shortlet:'b-gold',Land:'b-green'}

  return (
    <StaffLayout title="My Properties">
      <div className={s.topBar}>
        <span style={{fontSize:'.87rem',color:'var(--gray-500)'}}>{props.length} propert{props.length!==1?'ies':'y'}</span>
        <Link to="/staff/properties/new" className="btn btn-primary"><Plus size={16}/>Add Property</Link>
      </div>
      {loading ? <div className="page-loader"><div className="spinner"/></div> : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Property</th><th>Type</th><th>Price</th><th>Location</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {props.length===0 ? (
                <tr><td colSpan={7} style={{textAlign:'center',color:'var(--gray-400)',padding:'2.5rem'}}>
                  No properties yet. <Link to="/staff/properties/new" style={{color:'var(--navy)',fontWeight:600}}>Add your first property →</Link>
                </td></tr>
              ) : props.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className={s.propCell}>
                      {p.images?.[0] && <img src={p.images[0]} alt="" className={s.thumb}/>}
                      <strong style={{fontSize:'.87rem'}}>{p.title}</strong>
                    </div>
                  </td>
                  <td><span className={`badge ${TB[p.listing_type]||'b-navy'}`}>{p.listing_type}</span></td>
                  <td style={{fontSize:'.84rem',fontWeight:600,color:'var(--red)'}}>{formatPrice(p.price)}</td>
                  <td style={{fontSize:'.83rem'}}>{p.location}</td>
                  <td><span className={`badge ${p.status==='Available'?'b-green':'b-gray'}`}>{p.status}</span></td>
                  <td style={{fontSize:'.82rem'}}>{formatDateShort(p.created_at)}</td>
                  <td>
                    <div className={s.acts}>
                      <Link to={`/staff/properties/edit/${p.id}`} className={s.editBtn}><Pencil size={13}/>Edit</Link>
                      <button className={s.delBtn} onClick={()=>deleteProperty(p.id)}><Trash2 size={13}/>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StaffLayout>
  )
}
