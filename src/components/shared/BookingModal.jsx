import { useState } from 'react'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/utils'
import { INSPECTION_FEE } from '../../lib/constants'
import s from './BookingModal.module.css'

const schema = z.object({
  full_name: z.string().min(2,'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10,'Valid phone required'),
  preferred_date: z.string().min(1,'Date required'),
  preferred_time: z.string().min(1,'Time required'),
  message: z.string().optional(),
})

const TIMES = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']

export default function BookingModal({ property, type, onClose }) {
  const [loading, setLoading] = useState(false)
  const [feeAgreed, setFeeAgreed] = useState(false)
  const isInspection = type === 'inspection'
  const { register, handleSubmit, formState:{errors} } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    if (isInspection && !feeAgreed) { toast.error('Please agree to the inspection fee.'); return }
    setLoading(true)
    try {
      const { error } = await supabase.from('bookings').insert({
        property_id: property?.id||null,
        property_title: property?.title||null,
        booking_type: type,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        message: data.message||null,
        inspection_fee_agreed: isInspection ? feeAgreed : null,
        status: 'pending'
      })
      if (error) throw error
      toast.success(`Your ${type} request has been submitted! We will contact you shortly.`)
      onClose()
    } catch { toast.error('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="modal-ov" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className={s.hdr}>
          <div>
            <h2 className={s.htitle}>{isInspection ? '🏠 Book Inspection' : '📅 Schedule Meeting'}</h2>
            {property && <p className={s.hsub}>{property.title}</p>}
          </div>
          <button className={s.xbtn} onClick={onClose}><X size={19}/></button>
        </div>

        {isInspection && (
          <div className="alert al-warn">
            <strong>Inspection Fee Notice:</strong> A non-refundable inspection fee of <strong>{formatPrice(INSPECTION_FEE)}</strong> is required before the physical property visit.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="g2">
            <div className="fg"><label className="fl">Full Name *</label>
              <input {...register('full_name')} className={`fi ${errors.full_name?'err':''}`} placeholder="Your full name"/>
              {errors.full_name && <span className="fe">{errors.full_name.message}</span>}
            </div>
            <div className="fg"><label className="fl">Phone Number *</label>
              <input {...register('phone')} className={`fi ${errors.phone?'err':''}`} placeholder="080XXXXXXXX"/>
              {errors.phone && <span className="fe">{errors.phone.message}</span>}
            </div>
          </div>
          <div className="fg"><label className="fl">Email Address *</label>
            <input {...register('email')} type="email" className={`fi ${errors.email?'err':''}`} placeholder="your@email.com"/>
            {errors.email && <span className="fe">{errors.email.message}</span>}
          </div>
          <div className="g2">
            <div className="fg"><label className="fl">Preferred Date *</label>
              <input {...register('preferred_date')} type="date" className={`fi ${errors.preferred_date?'err':''}`} min={new Date().toISOString().split('T')[0]}/>
              {errors.preferred_date && <span className="fe">{errors.preferred_date.message}</span>}
            </div>
            <div className="fg"><label className="fl">Preferred Time *</label>
              <select {...register('preferred_time')} className={`fs ${errors.preferred_time?'err':''}`}>
                <option value="">Select time</option>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.preferred_time && <span className="fe">{errors.preferred_time.message}</span>}
            </div>
          </div>
          <div className="fg"><label className="fl">Message (Optional)</label>
            <textarea {...register('message')} className="fta" placeholder="Any special requests or questions..." rows={3}/>
          </div>

          {isInspection && (
            <div className={s.feeBox}>
              <label className="chk-label">
                <input type="checkbox" checked={feeAgreed} onChange={e=>setFeeAgreed(e.target.checked)}/>
                <span>I agree to pay the inspection fee of <strong>{formatPrice(INSPECTION_FEE)}</strong> before the physical property inspection. I understand this fee is non-refundable and confirms my serious intent to inspect the property.</span>
              </label>
            </div>
          )}

          <div className={s.acts}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading||(isInspection&&!feeAgreed)}>
              {loading ? 'Submitting...' : `Submit ${isInspection?'Inspection':'Meeting'} Request`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
