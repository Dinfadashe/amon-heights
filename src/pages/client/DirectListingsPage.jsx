import { useState, useEffect } from 'react'
import { CheckCircle2, Star } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import PropertyCard from '../../components/shared/PropertyCard'
import { supabase } from '../../lib/supabase'
import s from './DirectListingsPage.module.css'

export default function DirectListingsPage() {
  const [props, setProps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('properties').select('*').eq('source','Direct Listing').eq('status','Available')
      .order('created_at',{ascending:false})
      .then(({data}) => { setProps(data||[]); setLoading(false) })
  }, [])

  return (
    <PublicLayout>
      <div className={s.hdr}>
        <div className="container">
          <div className={s.hbadge}><Star size={13}/>Exclusive Listings</div>
          <h1 className={s.ht}>Direct Property Listings</h1>
          <p className={s.hs}>Properties listed directly with us — no middlemen, no inflated prices. Get verified properties at the best market rates.</p>
          <div className={s.pts}>
            {['Verified property owners','No hidden charges','Faster closing process','Direct negotiation'].map(p=>(
              <div key={p} className={s.pt}><CheckCircle2 size={14}/>{p}</div>
            ))}
          </div>
        </div>
      </div>
      <section className="section"><div className="container">
        {loading ? <div className="page-loader"><div className="spinner"/></div>
        : props.length>0 ? <div className="props-grid">{props.map(p=><PropertyCard key={p.id} property={p}/>)}</div>
        : <div className={s.empty}><p>No direct listings available at the moment. Check back soon!</p></div>}
      </div></section>
    </PublicLayout>
  )
}
