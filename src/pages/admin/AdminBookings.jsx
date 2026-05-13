import { useState, useEffect } from 'react'
import { Search, Filter, CheckCircle2, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'
import { formatDate, formatDateShort } from '../../lib/utils'
import s from './AdminBookings.module.css'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchBookings() }, [])

  async function fetchBookings() {
    const { data } = await supabase.from('bookings').select('*').order('created_at',{ascending:false})
    setBookings(data||[])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    const { error } = await supabase.from('bookings').update({status}).eq('id',id)
    if(error) { toast.error('Failed to update'); return }
    toast.success(`Booking marked as ${status}`)
    fetchBookings()
    setSelected(null)
  }

  const filtered = bookings.filter(b => {
    const matchStatus = filter==='all' || b.status===filter
    const matchType = typeFilter==='all' || b.booking_type===typeFilter
    const matchSearch = !search || b.full_name?.toLowerCase().includes(search.toLowerCase()) || b.phone?.includes(search) || b.email?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchType && matchSearch
  })

  const statCls = {pending:'b-gold',confirmed:'b-green',cancelled:'b-gray',completed:'b-navy'}

  return (
    <AdminLayout title="Bookings">
      <div className={s.topBar}>
        <div className={s.filters}>
          <div className={s.searchBox}><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, phone, email..."/></div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} className={s.sel}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className={s.sel}>
            <option value="all">All Types</option>
            <option value="meeting">Meeting</option>
            <option value="inspection">Inspection</option>
          </select>
        </div>
        <div className={s.total}>{filtered.length} booking{filtered.length!==1?'s':''}</div>
      </div>

      {loading ? <div className="page-loader"><div className="spinner"/></div> : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Client</th><th>Type</th><th>Property</th><th>Date & Time</th><th>Fee Agreed</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={7} style={{textAlign:'center',color:'var(--gray-400)',padding:'2.5rem'}}>No bookings found</td></tr>
              ) : filtered.map(b=>(
                <tr key={b.id}>
                  <td>
                    <strong style={{display:'block'}}>{b.full_name}</strong>
                    <span style={{fontSize:'.77rem',color:'var(--gray-400)'}}>{b.phone}</span>
                    <span style={{fontSize:'.77rem',color:'var(--gray-400)',display:'block'}}>{b.email}</span>
                  </td>
                  <td><span className={`badge ${b.booking_type==='inspection'?'b-red':'b-navy'}`} style={{textTransform:'capitalize'}}>{b.booking_type}</span></td>
                  <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'.84rem'}}>{b.property_title||<em style={{color:'var(--gray-400)'}}>General</em>}</td>
                  <td><strong style={{display:'block',fontSize:'.84rem'}}>{formatDateShort(b.preferred_date)}</strong><span style={{fontSize:'.77rem',color:'var(--gray-400)'}}>{b.preferred_time}</span></td>
                  <td>{b.booking_type==='inspection' ? (b.inspection_fee_agreed?<span style={{color:'var(--green)',fontWeight:600,fontSize:'.82rem'}}>Yes</span>:<span style={{color:'var(--red)',fontSize:'.82rem'}}>No</span>) : <span style={{color:'var(--gray-300)'}}>—</span>}</td>
                  <td><span className={`badge ${statCls[b.status]||'b-gray'}`} style={{textTransform:'capitalize'}}>{b.status}</span></td>
                  <td>
                    <div className={s.acts}>
                      <button className={s.vBtn} onClick={()=>setSelected(b)}>View</button>
                      {b.status==='pending' && <>
                        <button className={s.confBtn} onClick={()=>updateStatus(b.id,'confirmed')}><CheckCircle2 size={13}/>Confirm</button>
                        <button className={s.canBtn} onClick={()=>updateStatus(b.id,'cancelled')}><XCircle size={13}/>Cancel</button>
                      </>}
                      {b.status==='confirmed' && <button className={s.compBtn} onClick={()=>updateStatus(b.id,'completed')}><CheckCircle2 size={13}/>Complete</button>}
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
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',color:'var(--navy)',marginBottom:'1.25rem'}}>
              Booking Details – <span style={{textTransform:'capitalize'}}>{selected.booking_type}</span>
            </h2>
            <div className={s.det}>
              {[['Name',selected.full_name],['Phone',selected.phone],['Email',selected.email],
                ['Type',selected.booking_type],['Property',selected.property_title||'General enquiry'],
                ['Preferred Date',formatDate(selected.preferred_date)],['Preferred Time',selected.preferred_time],
                ['Inspection Fee Agreed',selected.booking_type==='inspection'?(selected.inspection_fee_agreed?'Yes ✓':'No ✗'):'N/A'],
                ['Status',selected.status],['Submitted',formatDate(selected.created_at)],
              ].map(([k,v])=>(
                <div key={k} className={s.dr}><span>{k}</span><strong style={{textTransform:'capitalize'}}>{v}</strong></div>
              ))}
              {selected.message && <div className={s.dr} style={{flexDirection:'column',alignItems:'flex-start',gap:'.35rem'}}><span>Message</span><p style={{fontSize:'.87rem',color:'var(--gray-600)',lineHeight:1.6}}>{selected.message}</p></div>}
            </div>
            <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end',marginTop:'1.25rem',flexWrap:'wrap'}}>
              {selected.status==='pending' && <>
                <button className="btn btn-green" onClick={()=>updateStatus(selected.id,'confirmed')}>Confirm</button>
                <button className="btn btn-red" onClick={()=>updateStatus(selected.id,'cancelled')}>Cancel</button>
              </>}
              {selected.status==='confirmed' && <button className="btn btn-primary" onClick={()=>updateStatus(selected.id,'completed')}>Mark Completed</button>}
              <button className="btn btn-outline" onClick={()=>setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
