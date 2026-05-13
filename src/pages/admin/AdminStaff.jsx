import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { UserPlus, Trash2, Building2, Eye } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'
import { formatDateShort } from '../../lib/utils'
import s from './AdminStaff.module.css'

const schema = z.object({
  full_name: z.string().min(2,'Name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8,'Minimum 8 characters'),
  phone: z.string().optional(),
})

export default function AdminStaff() {
  const [staff, setStaff] = useState([])
  const [staffProps, setStaffProps] = useState({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [viewStaff, setViewStaff] = useState(null)
  const { register, handleSubmit, reset, formState:{errors} } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => { fetchStaff() }, [])

  async function fetchStaff() {
    const { data } = await supabase.from('profiles').select('*').eq('role','staff').order('created_at',{ascending:false})
    setStaff(data||[])
    // Fetch property counts per staff
    if(data?.length) {
      const counts = {}
      await Promise.all(data.map(async s => {
        const {count} = await supabase.from('properties').select('id',{count:'exact',head:true}).eq('created_by',s.id)
        counts[s.id] = count||0
      }))
      setStaffProps(counts)
    }
    setLoading(false)
  }

  async function fetchStaffProperties(staffId) {
    const { data } = await supabase.from('properties').select('*').eq('created_by',staffId).order('created_at',{ascending:false})
    return data||[]
  }

  const onInvite = async (data) => {
    setSubmitting(true)
    try {
      // Create auth user via admin API would be done server-side
      // For now we use supabase admin signup approach
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: data.email, password: data.password,
        options: { data: { full_name: data.full_name, role: 'staff' } }
      })
      if(authErr) throw authErr
      // Create profile
      if(authData.user) {
        await supabase.from('profiles').upsert({
          id: authData.user.id, full_name: data.full_name,
          email: data.email, phone: data.phone||null, role: 'staff'
        })
      }
      toast.success(`Staff member ${data.full_name} invited! They will receive a confirmation email.`)
      reset(); setShowForm(false); fetchStaff()
    } catch(err) { toast.error(err.message||'Failed to invite staff') }
    finally { setSubmitting(false) }
  }

  async function removeStaff(id) {
    if(!confirm('Remove this staff member? Their properties will remain.')) return
    await supabase.from('profiles').update({role:'viewer'}).eq('id',id)
    toast.success('Staff access removed')
    fetchStaff()
  }

  const handleViewStaff = async (member) => {
    const props = await fetchStaffProperties(member.id)
    setViewStaff({...member, properties: props})
  }

  return (
    <AdminLayout title="Staff Management">
      <div className={s.topBar}>
        <div><h2 className={s.sh}>Staff Members</h2><p className={s.ss}>{staff.length} active staff member{staff.length!==1?'s':''}</p></div>
        <button className="btn btn-primary" onClick={()=>setShowForm(true)}><UserPlus size={16}/>Invite Staff</button>
      </div>

      {loading ? <div className="page-loader"><div className="spinner"/></div> : (
        <div className={s.grid}>
          {staff.length===0 ? (
            <div className={s.empty}><UserPlus size={44}/><p>No staff members yet. Invite your first staff member to get started.</p></div>
          ) : staff.map(m=>(
            <div key={m.id} className={s.card}>
              <div className={s.cavatar}>{m.full_name?.[0]?.toUpperCase()||'S'}</div>
              <div className={s.cinfo}>
                <div className={s.cname}>{m.full_name}</div>
                <div className={s.cemail}>{m.email}</div>
                {m.phone && <div className={s.cphone}>{m.phone}</div>}
                <div className={s.cdate}>Joined {formatDateShort(m.created_at)}</div>
              </div>
              <div className={s.cstats}>
                <div className={s.cstat}><Building2 size={15}/><span>{staffProps[m.id]||0} Properties</span></div>
              </div>
              <div className={s.cacts}>
                <button className="btn btn-outline btn-sm" onClick={()=>handleViewStaff(m)}><Eye size={14}/>View Properties</button>
                <button className="btn btn-sm" style={{background:'#fef2f2',color:'#991b1b',border:'none'}} onClick={()=>removeStaff(m.id)}><Trash2 size={14}/>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal-box">
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',color:'var(--navy)',marginBottom:'1.25rem'}}>Invite Staff Member</h2>
            <div className="alert al-info">The invited staff member will receive an email to confirm their account. They will have access to upload and manage properties.</div>
            <form onSubmit={handleSubmit(onInvite)}>
              <div className="fg"><label className="fl">Full Name *</label>
                <input {...register('full_name')} className={`fi ${errors.full_name?'err':''}`} placeholder="Staff member's name"/>
                {errors.full_name && <span className="fe">{errors.full_name.message}</span>}
              </div>
              <div className="fg"><label className="fl">Email Address *</label>
                <input {...register('email')} type="email" className={`fi ${errors.email?'err':''}`} placeholder="staff@amonheights.online"/>
                {errors.email && <span className="fe">{errors.email.message}</span>}
              </div>
              <div className="fg"><label className="fl">Phone Number</label>
                <input {...register('phone')} className="fi" placeholder="Phone number (optional)"/>
              </div>
              <div className="fg"><label className="fl">Temporary Password *</label>
                <input {...register('password')} type="password" className={`fi ${errors.password?'err':''}`} placeholder="Minimum 8 characters"/>
                {errors.password && <span className="fe">{errors.password.message}</span>}
              </div>
              <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end',marginTop:'.5rem'}}>
                <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}><UserPlus size={15}/>{submitting?'Inviting...':'Send Invitation'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewStaff && (
        <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setViewStaff(null)}>
          <div className="modal-box" style={{maxWidth:680}}>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',color:'var(--navy)',marginBottom:'1rem'}}>{viewStaff.full_name}'s Properties</h2>
            {viewStaff.properties?.length===0 ? (
              <p style={{color:'var(--gray-400)',textAlign:'center',padding:'2rem'}}>No properties listed yet</p>
            ) : (
              <div className={s.propList}>
                {viewStaff.properties.map(p=>(
                  <div key={p.id} className={s.propItem}>
                    <div className={s.piInfo}>
                      <div className={s.piTitle}>{p.title}</div>
                      <div className={s.piMeta}>{p.location} • {p.listing_type}</div>
                    </div>
                    <span className={`badge ${p.status==='Available'?'b-green':'b-gray'}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:'1rem'}}>
              <button className="btn btn-outline" onClick={()=>setViewStaff(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
