import { useState, useEffect } from 'react'
import { Eye, CheckCircle2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'
import { formatDateShort } from '../../lib/utils'
import s from './AdminEnquiries.module.css'

export default function AdminDirectListings() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const { data: d } = await supabase.from('direct_listing_requests').select('*').order('created_at', { ascending: false })
    setData(d || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('direct_listing_requests').update({ status }).eq('id', id)
    toast.success(`Request ${status}`)
    fetchData()
    setSelected(null)
  }

  const STATCLS = { new: 'b-gold', reviewing: 'b-navy', approved: 'b-green', rejected: 'b-gray' }

  return (
    <AdminLayout title="Direct Listing Requests">
      {loading ? <div className="page-loader"><div className="spinner"/></div> : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Owner Name</th><th>Phone</th><th>Property Type</th><th>Location</th><th>Purpose</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {data.length===0 ? (
                <tr><td colSpan={8} style={{textAlign:'center',color:'var(--gray-400)',padding:'2.5rem'}}>No direct listing requests yet</td></tr>
              ) : data.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.full_name}</strong>{r.company&&<div style={{fontSize:'.77rem',color:'var(--gray-400)'}}>{r.company}</div>}</td>
                  <td style={{fontSize:'.84rem'}}>{r.phone}</td>
                  <td style={{fontSize:'.84rem'}}>{r.property_type}</td>
                  <td style={{fontSize:'.84rem',maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.property_address}</td>
                  <td><span className={`badge ${r.property_purpose==='Sale'?'b-navy':r.property_purpose==='Rent'?'b-red':'b-gold'}`}>{r.property_purpose}</span></td>
                  <td style={{fontSize:'.82rem'}}>{formatDateShort(r.created_at)}</td>
                  <td><span className={`badge ${STATCLS[r.status]||'b-gray'}`} style={{textTransform:'capitalize'}}>{r.status}</span></td>
                  <td><button className={s.vBtn} onClick={()=>setSelected(r)}><Eye size={13}/>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="modal-box" style={{maxWidth:640}}>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',color:'var(--navy)',marginBottom:'1.25rem'}}>Direct Listing Request</h2>
            <div className={s.det}>
              {[
                ['Full Name',selected.full_name],['Company',selected.company||'—'],['Phone',selected.phone],
                ['Alt Phone',selected.phone2||'—'],['Email',selected.email],
                ['ID',selected.id_type||'—'],['Residential Address',selected.residential_address],
                ['Property Type',selected.property_type],['Purpose',selected.property_purpose],
                ['Property Address',selected.property_address],['Title Document',selected.title_document||'—'],
                ['Land Size',selected.land_size||'—'],['Rooms/Units',selected.rooms_units||'—'],
                ['Asking Price',selected.asking_price||'—'],['Rental Price',selected.rental_price||'—'],
                ['Availability',selected.availability_date||'—'],['Existing Tenants',selected.existing_tenants||'—'],
                ['Features',selected.features_facilities||'—'],['Neighbourhood',selected.neighbourhood||'—'],
                ['Road Access',selected.road_access||'—'],['Utilities',selected.utilities||'—'],
                ['Other Info',selected.other_info||'—'],['Status',selected.status],
                ['Submitted',formatDateShort(selected.created_at)],
              ].map(([k,v])=>(
                <div key={k} className={s.dr}><span>{k}</span><strong style={{maxWidth:'60%',textAlign:'right',wordBreak:'break-word'}}>{v}</strong></div>
              ))}
            </div>
            <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end',marginTop:'1.25rem',flexWrap:'wrap'}}>
              {selected.status==='new'&&<button className="btn btn-primary btn-sm" onClick={()=>updateStatus(selected.id,'reviewing')}>Start Reviewing</button>}
              {(selected.status==='new'||selected.status==='reviewing')&&<>
                <button className="btn btn-green btn-sm" onClick={()=>updateStatus(selected.id,'approved')}><CheckCircle2 size={14}/>Approve</button>
                <button className="btn btn-red btn-sm" onClick={()=>updateStatus(selected.id,'rejected')}><XCircle size={14}/>Reject</button>
              </>}
              <a href={`tel:${selected.phone}`} className="btn btn-outline btn-sm">Call Owner</a>
              <button className="btn btn-outline btn-sm" onClick={()=>setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
