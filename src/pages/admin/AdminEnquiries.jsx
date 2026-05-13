import { useState, useEffect } from 'react'
import { Search, Eye, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'
import { formatDateShort } from '../../lib/utils'
import s from './AdminEnquiries.module.css'

export default function AdminEnquiries() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetch() }, [])

  async function fetch() {
    const { data: d } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false })
    setData(d || [])
    setLoading(false)
  }

  async function markRead(id) {
    await supabase.from('enquiries').update({ status: 'read' }).eq('id', id)
    toast.success('Marked as read')
    fetch()
    setSelected(null)
  }

  const filtered = data.filter(e =>
    !search || e.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase()) ||
    e.subject?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Enquiries">
      <div className={s.topBar}>
        <div className={s.sb}><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search enquiries..."/></div>
        <span className={s.cnt}>{filtered.length} enquir{filtered.length===1?'y':'ies'}</span>
      </div>
      {loading ? <div className="page-loader"><div className="spinner"/></div> : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Subject</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{textAlign:'center',color:'var(--gray-400)',padding:'2.5rem'}}>No enquiries found</td></tr>
              ) : filtered.map(e => (
                <tr key={e.id} style={e.status==='new'?{background:'#fffbeb'}:{}}>
                  <td><strong>{e.full_name}</strong>{e.status==='new'&&<span className="badge b-gold" style={{marginLeft:'.4rem',fontSize:'.65rem'}}>New</span>}</td>
                  <td style={{fontSize:'.84rem'}}>{e.email}</td>
                  <td style={{fontSize:'.84rem'}}>{e.phone}</td>
                  <td style={{fontSize:'.84rem',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.subject}</td>
                  <td style={{fontSize:'.82rem'}}>{formatDateShort(e.created_at)}</td>
                  <td><span className={`badge ${e.status==='new'?'b-gold':'b-gray'}`}>{e.status}</span></td>
                  <td>
                    <div className={s.acts}>
                      <button className={s.vBtn} onClick={()=>setSelected(e)}><Eye size={13}/>View</button>
                      {e.status==='new' && <button className={s.rBtn} onClick={()=>markRead(e.id)}><CheckCircle2 size={13}/>Read</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="modal-box">
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',color:'var(--navy)',marginBottom:'1.25rem'}}>Enquiry Details</h2>
            <div className={s.det}>
              {[['Name',selected.full_name],['Email',selected.email],['Phone',selected.phone],['Subject',selected.subject],['Date',formatDateShort(selected.created_at)]].map(([k,v])=>(
                <div key={k} className={s.dr}><span>{k}</span><strong>{v}</strong></div>
              ))}
            </div>
            <div style={{marginTop:'1rem',background:'var(--gray-50)',borderRadius:'var(--radius)',padding:'1rem'}}>
              <p style={{fontWeight:600,fontSize:'.82rem',color:'var(--gray-600)',marginBottom:'.4rem'}}>MESSAGE</p>
              <p style={{fontSize:'.9rem',color:'var(--gray-700)',lineHeight:1.75}}>{selected.message}</p>
            </div>
            <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end',marginTop:'1.25rem'}}>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn btn-primary btn-sm">Reply via Email</a>
              {selected.status==='new' && <button className="btn btn-gold btn-sm" onClick={()=>markRead(selected.id)}>Mark as Read</button>}
              <button className="btn btn-outline btn-sm" onClick={()=>setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
