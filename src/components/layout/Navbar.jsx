import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { CONTACTS } from '../../lib/constants'
import s from './Navbar.module.css'

const NAV = [
  {label:'Home',to:'/'},
  {label:'Properties',to:'/properties'},
  {label:'Direct Listings',to:'/direct-listings'},
  {label:'Blog',to:'/blog'},
  {label:'About',to:'/about'},
  {label:'Contact',to:'/contact'},
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => setOpen(false), [location])

  const cls = isHome ? (scrolled ? s.solid : s.transparent) : s.solid

  return (
    <nav className={`${s.nav} ${cls}`}>
      <div className={s.inner}>
        <Link to="/" className={s.logo}>
          <img src="/logo.jpg" alt="Amon Heights" className={s.logoImg} />
          <span className={s.logoTxt}><span className={s.la}>Amon</span><span className={s.lh}>Heights</span></span>
        </Link>
        <div className={s.links}>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to==='/'} className={({isActive}) => `${s.lnk} ${isActive?s.active:''}`}>{n.label}</NavLink>
          ))}
        </div>
        <div className={s.actions}>
          <a href={`tel:${CONTACTS.phone1}`} className={s.callBtn}><Phone size={14}/>{CONTACTS.phone1}</a>
          <Link to="/list-property" className="btn btn-red btn-sm">List Property</Link>
        </div>
        <button className={s.ham} onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
      {open && (
        <div className={s.mobile}>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to==='/'} onClick={() => setOpen(false)}
              className={({isActive}) => `${s.mlnk} ${isActive?s.mactive:''}`}>{n.label}</NavLink>
          ))}
          <div className={s.mctAs}>
            <a href={`tel:${CONTACTS.phone1}`} className="btn btn-outline btn-sm"><Phone size={13}/>{CONTACTS.phone1}</a>
            <Link to="/list-property" className="btn btn-red btn-sm">List Property</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
