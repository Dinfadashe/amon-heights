import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { PROPERTY_TYPES, LISTING_TYPES, ABUJA_LOCATIONS } from '../../lib/constants'
import s from './SearchFilter.module.css'

export default function SearchFilter({ onFilter, compact=false, initial={} }) {
  const [q, setQ] = useState(initial.q||'')
  const [lt, setLt] = useState(initial.listingType||'')
  const [pt, setPt] = useState(initial.propertyType||'')
  const [loc, setLoc] = useState(initial.location||'')
  const [min, setMin] = useState(initial.minPrice||'')
  const [max, setMax] = useState(initial.maxPrice||'')
  const [adv, setAdv] = useState(false)

  const submit = (e) => { e?.preventDefault(); onFilter({q,listingType:lt,propertyType:pt,location:loc,minPrice:min,maxPrice:max}) }
  const clear = () => { setQ('');setLt('');setPt('');setLoc('');setMin('');setMax(''); onFilter({}) }
  const has = q||lt||pt||loc||min||max

  return (
    <div className={`${s.wrap} ${compact?s.cmp:''}`}>
      <form onSubmit={submit}>
        <div className={s.row}>
          <div className={s.sb}><Search size={17} className={s.si}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by title, location, type..." className={s.inp}/></div>
          <select value={lt} onChange={e=>setLt(e.target.value)} className={s.sel}>
            <option value="">All Types</option>
            {LISTING_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <select value={loc} onChange={e=>setLoc(e.target.value)} className={s.sel}>
            <option value="">All Locations</option>
            {ABUJA_LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}
          </select>
          <button type="submit" className="btn btn-primary"><Search size={15}/>Search</button>
          <button type="button" className={`btn btn-outline ${s.advBtn}`} onClick={()=>setAdv(!adv)}><SlidersHorizontal size={15}/></button>
        </div>
        {adv && (
          <div className={s.advRow}>
            <select value={pt} onChange={e=>setPt(e.target.value)} className={s.sel}>
              <option value="">All Property Types</option>
              {PROPERTY_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <input type="number" value={min} onChange={e=>setMin(e.target.value)} placeholder="Min Price (₦)" className={s.pi}/>
            <input type="number" value={max} onChange={e=>setMax(e.target.value)} placeholder="Max Price (₦)" className={s.pi}/>
          </div>
        )}
        {has && <button type="button" className={s.clr} onClick={clear}><X size={13}/>Clear Filters</button>}
      </form>
    </div>
  )
}
