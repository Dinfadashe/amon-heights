import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Plus, Eye } from 'lucide-react'
import StaffLayout from '../../components/layout/StaffLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { formatPrice, formatDateShort } from '../../lib/utils'
import s from '../admin/AdminDashboard.module.css'

export default function StaffDashboard() {
  const { user, profile } = useAuth()
  const [props, setProps] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [available, setAvailable] = useState(0)

  useEffect(() => {
    if (!user) return
    supabase.from('properties').select('*').eq('created_by', user.id).order('created_at', { ascending: false })
      .then(({ data }) => {
        setProps(data || [])
        setTotal(data?.length || 0)
        setAvailable(data?.filter(p => p.status === 'Available').length || 0)
        setLoading(false)
      })
  }, [user])

  return (
    <StaffLayout title="Staff Dashboard">
      <div style={{marginBottom:'1.5rem'}}>
        <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',color:'var(--navy)'}}>Welcome, {profile?.full_name || 'Staff'}!</h2>
        <p style={{color:'var(--gray-500)',fontSize:'.9rem',marginTop:'.3rem'}}>Manage your property listings from here.</p>
      </div>
      {loading ? <div className="page-loader"><div className="spinner"/></div> : (
        <>
          <div className={s.statsGrid} style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <div className={s.statCard} style={{cursor:'default'}}>
              <div className={s.scTop}><div className={s.scIco} style={{background:'#1a274418',color:'#1a2744'}}><Building2 size={22}/></div><div className={s.scVal}>{total}</div></div>
              <div className={s.scLbl}>My Properties</div>
            </div>
            <div className={s.statCard} style={{cursor:'default'}}>
              <div className={s.scTop}><div className={s.scIco} style={{background:'#16a34a18',color:'#16a34a'}}><Eye size={22}/></div><div className={s.scVal}>{available}</div></div>
              <div className={s.scLbl}>Available Listings</div>
            </div>
            <div className={s.statCard} style={{cursor:'default'}}>
              <div className={s.scTop}><div className={s.scIco} style={{background:'#c8102e18',color:'#c8102e'}}><Building2 size={22}/></div><div className={s.scVal}>{total-available}</div></div>
              <div className={s.scLbl}>Sold / Rented</div>
            </div>
          </div>
          <div className={s.section}>
            <div className={s.secHd}>
              <h2 className={s.secT}>My Recent Properties</h2>
              <Link to="/staff/properties/new" className="btn btn-primary btn-sm"><Plus size={15}/>Add New</Link>
            </div>
            {props.length === 0 ? (
              <div style={{textAlign:'center',padding:'3rem',color:'var(--gray-400)'}}>
                <Building2 size={44} style={{margin:'0 auto 1rem'}}/>
                <p>No properties yet. Add your first listing!</p>
                <Link to="/staff/properties/new" className="btn btn-primary" style={{marginTop:'1rem'}}>Add Property</Link>
              </div>
            ) : (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>Title</th><th>Type</th><th>Price</th><th>Location</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {props.slice(0,10).map(p => (
                      <tr key={p.id}>
                        <td><strong style={{fontSize:'.87rem'}}>{p.title}</strong></td>
                        <td><span className={`badge ${p.listing_type==='Sale'?'b-navy':p.listing_type==='Rent'?'b-red':p.listing_type==='Shortlet'?'b-gold':'b-green'}`}>{p.listing_type}</span></td>
                        <td style={{fontSize:'.84rem',fontWeight:600,color:'var(--red)'}}>{formatPrice(p.price)}</td>
                        <td style={{fontSize:'.83rem'}}>{p.location}</td>
                        <td><span className={`badge ${p.status==='Available'?'b-green':'b-gray'}`}>{p.status}</span></td>
                        <td style={{fontSize:'.82rem'}}>{formatDateShort(p.created_at)}</td>
                        <td><Link to={`/staff/properties/edit/${p.id}`} className="btn btn-outline btn-sm">Edit</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </StaffLayout>
  )
}
