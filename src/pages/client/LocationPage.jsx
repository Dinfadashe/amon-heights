import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import PropertyCard from '../../components/shared/PropertyCard'
import { supabase } from '../../lib/supabase'
import s from './PropertiesPage.module.css'

export default function LocationPage() {
  const { location } = useParams()
  const locName = location?.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
  const [props, setProps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('properties').select('*').ilike('location',`%${locName}%`).eq('status','Available')
      .order('created_at',{ascending:false})
      .then(({data}) => { setProps(data||[]); setLoading(false) })
  }, [locName])

  return (
    <PublicLayout>
      <div className={s.phdr}><div className="container">
        <h1 className={s.ph}>Properties in {locName}</h1>
        <p className={s.ps}>Browse available properties in {locName}, Abuja</p>
      </div></div>
      <section className="section"><div className="container">
        <div className={s.rbar}><span className={s.rc}>{loading?'Loading...': `${props.length} propert${props.length===1?'y':'ies'} found in ${locName}`}</span></div>
        {loading ? <div className="page-loader"><div className="spinner"/></div>
        : props.length>0 ? <div className="props-grid">{props.map(p=><PropertyCard key={p.id} property={p}/>)}</div>
        : <div className={s.empty}><Building2 size={48}/><h3>No properties in {locName}</h3><p>Try browsing all properties</p><Link to="/properties" className="btn btn-primary" style={{marginTop:'1rem'}}>All Properties</Link></div>}
      </div></section>
    </PublicLayout>
  )
}
