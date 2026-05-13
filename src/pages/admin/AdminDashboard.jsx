import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, CalendarCheck, MessageSquare, Users, TrendingUp, Eye, ListChecks } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'
import { formatDateShort } from '../../lib/utils'
import s from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({props:0,bookings:0,enquiries:0,staff:0,directReqs:0})
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('properties').select('id',{count:'exact',head:true}),
      supabase.from('bookings').select('id',{count:'exact',head:true}),
      supabase.from('enquiries').select('id',{count:'exact',head:true}),
      supabase.from('profiles').select('id',{count:'exact',head:true}).eq('role','staff'),
      supabase.from('direct_listing_requests').select('id',{count:'exact',head:true}),
      supabase.from('bookings').select('*').order('created_at',{ascending:false}).limit(8),
    ]).then(([{count:p},{count:b},{count:e},{count:st},{count:dl},{data:rb}]) => {
      setStats({props:p||0,bookings:b||0,enquiries:e||0,staff:st||0,directReqs:dl||0})
      setRecentBookings(rb||[])
      setLoading(false)
    })
  }, [])

  const cards = [
    {label:'Total Properties',val:stats.props,icon:Building2,color:'#1a2744',link:'/admin/properties'},
    {label:'Total Bookings',val:stats.bookings,icon:CalendarCheck,color:'#c8102e',link:'/admin/bookings'},
    {label:'Enquiries',val:stats.enquiries,icon:MessageSquare,color:'#c9a84c',link:'/admin/enquiries'},
    {label:'Staff Members',val:stats.staff,icon:Users,color:'#16a34a',link:'/admin/staff'},
    {label:'Direct Listing Requests',val:stats.directReqs,icon:ListChecks,color:'#7c3aed',link:'/admin/direct-listings'},
  ]

  return (
    <AdminLayout title="Dashboard">
      {loading ? <div className="page-loader"><div className="spinner"/></div> : (
        <>
          <div className={s.statsGrid}>
            {cards.map(c=>(
              <Link key={c.label} to={c.link} className={s.statCard}>
                <div className={s.scTop}>
                  <div className={s.scIco} style={{background:c.color+'18',color:c.color}}><c.icon size={24}/></div>
                  <div className={s.scVal}>{c.val}</div>
                </div>
                <div className={s.scLbl}>{c.label}</div>
              </Link>
            ))}
          </div>

          <div className={s.section}>
            <div className={s.secHd}>
              <h2 className={s.secT}>Recent Bookings</h2>
              <Link to="/admin/bookings" className="btn btn-outline btn-sm">View All</Link>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>Name</th><th>Type</th><th>Property</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
                <tbody>
                  {recentBookings.length===0 ? (
                    <tr><td colSpan={6} style={{textAlign:'center',color:'var(--gray-400)',padding:'2rem'}}>No bookings yet</td></tr>
                  ) : recentBookings.map(b=>(
                    <tr key={b.id}>
                      <td><strong>{b.full_name}</strong><div style={{fontSize:'.77rem',color:'var(--gray-400)'}}>{b.phone}</div></td>
                      <td><span className={`badge ${b.booking_type==='inspection'?'b-red':'b-navy'}`} style={{textTransform:'capitalize'}}>{b.booking_type}</span></td>
                      <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.property_title||'—'}</td>
                      <td>{formatDateShort(b.preferred_date)}</td>
                      <td>{b.preferred_time}</td>
                      <td><span className={`badge ${b.status==='pending'?'b-gold':b.status==='confirmed'?'b-green':'b-gray'}`} style={{textTransform:'capitalize'}}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={s.quickLinks}>
            <h2 className={s.secT} style={{marginBottom:'1rem'}}>Quick Actions</h2>
            <div className={s.qlGrid}>
              {[
                {label:'Add New Property',to:'/admin/properties/new',icon:Building2},
                {label:'View All Bookings',to:'/admin/bookings',icon:CalendarCheck},
                {label:'Manage Staff',to:'/admin/staff',icon:Users},
                {label:'Write Blog Post',to:'/admin/blog/new',icon:TrendingUp},
              ].map(ql=>(
                <Link key={ql.to} to={ql.to} className={s.ql}><ql.icon size={20}/><span>{ql.label}</span></Link>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
