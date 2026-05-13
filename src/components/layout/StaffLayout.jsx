import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Building2, LogOut, Menu, X, ChevronRight, Home } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import s from './AdminLayout.module.css'

const NAV = [
  {label:'Dashboard',to:'/staff',icon:LayoutDashboard,end:true},
  {label:'My Properties',to:'/staff/properties',icon:Building2},
]

export default function StaffLayout({ children, title }) {
  const [open, setOpen] = useState(false)
  const { profile, signOut } = useAuth()
  const nav = useNavigate()
  const handleSignOut = async () => { await signOut(); nav('/login') }

  return (
    <div className={s.layout}>
      <aside className={`${s.sidebar} ${open?s.open:''}`}>
        <div className={s.sh}>
          <Link to="/" className={s.slogo}><img src="/logo.jpg" alt=""/><span>Amon Heights</span></Link>
          <button className={s.close} onClick={() => setOpen(false)}><X size={18}/></button>
        </div>
        <div className={s.user}>
          <div className={s.av}>{profile?.full_name?.[0]||'S'}</div>
          <div><div className={s.un}>{profile?.full_name||'Staff'}</div><div className={s.ur}>Staff Member</div></div>
        </div>
        <nav className={s.snav}>
          {NAV.map(it => (
            <NavLink key={it.to} to={it.to} end={it.end} onClick={() => setOpen(false)}
              className={({isActive}) => `${s.ni} ${isActive?s.na:''}`}>
              <it.icon size={17}/><span>{it.label}</span><ChevronRight size={12} className={s.arr}/>
            </NavLink>
          ))}
        </nav>
        <div className={s.sf}>
          <Link to="/" className={s.vs}><Home size={14}/>View Website</Link>
          <button className={s.so} onClick={handleSignOut}><LogOut size={15}/>Sign Out</button>
        </div>
      </aside>
      {open && <div className={s.ov} onClick={() => setOpen(false)}/>}
      <div className={s.main}>
        <header className={s.header}>
          <div className={s.hl}><button className={s.mb} onClick={() => setOpen(true)}><Menu size={21}/></button><h1 className={s.pt}>{title}</h1></div>
          <span className={s.hr2}>Staff Portal</span>
        </header>
        <div className={s.content}>{children}</div>
      </div>
    </div>
  )
}
