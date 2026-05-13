import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import { supabase } from '../../lib/supabase'
import { CONTACTS } from '../../lib/constants'
import { getWhatsAppLink } from '../../lib/utils'
import s from './ContactPage.module.css'

const schema = z.object({
  full_name: z.string().min(2,'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10,'Valid phone required'),
  subject: z.string().min(3,'Subject required'),
  message: z.string().min(10,'Message must be at least 10 characters'),
})

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState:{errors} } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { error } = await supabase.from('enquiries').insert({ ...data, status: 'new' })
      if(error) throw error
      toast.success('Your message has been sent! We will respond within 24 hours.')
      reset()
    } catch { toast.error('Failed to send. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <PublicLayout>
      <div className={s.hdr}><div className="container">
        <h1 className={s.ht}>Contact Us</h1>
        <p className={s.hs}>We are here to help you find the perfect property. Reach out and let's talk.</p>
      </div></div>

      <section className="section"><div className="container">
        <div className={s.grid}>
          <div className={s.info}>
            <h2 className={s.ih}>Get In Touch</h2>
            <p className={s.is}>Our team is available to answer your questions, schedule property inspections, and help you navigate the Abuja real estate market.</p>
            <div className={s.cards}>
              <a href={`tel:${CONTACTS.phone1}`} className={s.ccard}><div className={s.cico}><Phone size={20}/></div><div><strong>Call Us</strong><span>{CONTACTS.phone1}</span><span>{CONTACTS.phone2}</span></div></a>
              <a href={getWhatsAppLink(CONTACTS.whatsapp1,'Hello! I have an enquiry about a property.')} target="_blank" rel="noreferrer" className={`${s.ccard} ${s.wa}`}>
                <div className={s.cico}><MessageCircle size={20}/></div>
                <div><strong>WhatsApp</strong><span>Chat with us instantly</span></div>
              </a>
              <a href={`mailto:${CONTACTS.email}`} className={s.ccard}><div className={s.cico}><Mail size={20}/></div><div><strong>Email Us</strong><span>{CONTACTS.email}</span></div></a>
              <div className={s.ccard}><div className={s.cico}><MapPin size={20}/></div><div><strong>Our Office</strong><span>{CONTACTS.address}</span></div></div>
              <div className={s.ccard}><div className={s.cico}><Clock size={20}/></div><div><strong>Office Hours</strong><span>Monday – Saturday: 8am – 6pm</span></div></div>
            </div>
          </div>
          <div className={s.form}>
            <h2 className={s.fh}>Send Us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="g2">
                <div className="fg"><label className="fl">Full Name *</label>
                  <input {...register('full_name')} className={`fi ${errors.full_name?'err':''}`} placeholder="Your name"/>
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
              <div className="fg"><label className="fl">Subject *</label>
                <input {...register('subject')} className={`fi ${errors.subject?'err':''}`} placeholder="What is this about?"/>
                {errors.subject && <span className="fe">{errors.subject.message}</span>}
              </div>
              <div className="fg"><label className="fl">Message *</label>
                <textarea {...register('message')} className={`fta ${errors.message?'err':''}`} placeholder="Tell us about your property needs..." rows={5}/>
                {errors.message && <span className="fe">{errors.message.message}</span>}
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{width:'100%',justifyContent:'center'}}>
                {loading?'Sending...':'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div></section>
    </PublicLayout>
  )
}
