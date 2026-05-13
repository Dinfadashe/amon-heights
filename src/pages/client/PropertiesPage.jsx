import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import SearchFilter from '../../components/shared/SearchFilter'
import PropertyCard from '../../components/shared/PropertyCard'
import { supabase } from '../../lib/supabase'
import s from './PropertiesPage.module.css'

const PAGE_SIZE = 12

export default function PropertiesPage() {
  const [sp] = useSearchParams()
  const [props, setProps] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    q: sp.get('q')||'', listingType: sp.get('type')||'',
    location: sp.get('location')||'', propertyType: sp.get('property_type')||'',
  })

  useEffect(() => { fetchProps(filters, 1) }, [])

  async function fetchProps(f, p=1) {
    setLoading(true)
    let q = supabase.from('properties').select('*',{count:'exact'})
    if(f.q) q = q.ilike('title',`%${f.q}%`)
    if(f.listingType) q = q.eq('listing_type',f.listingType)
    if(f.location) q = q.ilike('location',`%${f.location}%`)
    if(f.propertyType) q = q.eq('property_type',f.propertyType)
    if(f.minPrice) q = q.gte('price',f.minPrice)
    if(f.maxPrice) q = q.lte('price',f.maxPrice)
    q = q.eq('status','Available').order('is_featured',{ascending:false}).order('created_at',{ascending:false}).range((p-1)*PAGE_SIZE, p*PAGE_SIZE-1)
    const {data,count} = await q
    setProps(data||[]); setTotal(count||0); setPage(p); setLoading(false)
  }

  const handleFilter = (f) => { setFilters(f); fetchProps(f,1) }
  const pages = Math.ceil(total/PAGE_SIZE)

  return (
    <PublicLayout>
      <div className={s.phdr}><div className="container"><h1 className={s.ph}>Available Properties</h1><p className={s.ps}>Discover premium properties across Abuja</p></div></div>
      <div className={s.fbar}><div className="container"><SearchFilter onFilter={handleFilter} compact initial={filters}/></div></div>
      <section className="section"><div className="container">
        <div className={s.rbar}><span className={s.rc}>{loading?'Searching...':`${total} propert${total===1?'y':'ies'} found`}</span></div>
        {loading ? <div className="page-loader"><div className="spinner"/></div>
        : props.length>0 ? (
          <>
            <div className="props-grid">{props.map(p=><PropertyCard key={p.id} property={p}/>)}</div>
            {pages>1 && <div className={s.pag}>{Array.from({length:pages},(_,i)=>i+1).map(n=>(
              <button key={n} className={`${s.pb} ${n===page?s.pba:''}`} onClick={()=>fetchProps(filters,n)}>{n}</button>
            ))}</div>}
          </>
        ) : (
          <div className={s.empty}><Building2 size={52}/><h3>No properties found</h3><p>Try adjusting your search filters</p></div>
        )}
      </div></section>
    </PublicLayout>
  )
}
