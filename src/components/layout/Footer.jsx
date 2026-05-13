import { Link } from 'react-router-dom'
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react'
import { CONTACTS, ABUJA_LOCATIONS } from '../../lib/constants'
import { getWhatsAppLink } from '../../lib/utils'
import s from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.top}><div className="container">
        <div className={s.grid}>
          <div className={s.brand}>
            <Link to="/" className={s.logo}>
              <img src="/logo.jpg" alt="Amon Heights" className={s.li}/>
              <div><div className={s.ln}>Amon<span>Heights</span></div><div className={s.ls}>Limited</div></div>
            </Link>
            <p className={s.tagline}>Your trusted real estate partner in Abuja. We connect you to verified premium properties with transparency and professionalism.</p>
            <div className={s.address}><MapPin size={14}/>{CONTACTS.address}</div>
            <div className={s.socials}>
              <a href="#" className={s.soc}><span style={{fontWeight:700,fontSize:".85rem"}}>f</span></a>
              <a href="#" className={s.soc}><span style={{fontWeight:700,fontSize:".85rem"}}>in</span></a>
              <a href="#" className={s.soc}><span style={{fontWeight:700,fontSize:".9rem"}}>𝕏</span></a>
              <a href={getWhatsAppLink(CONTACTS.whatsapp1)} target="_blank" rel="noreferrer" className={`${s.soc} ${s.wa}`}><MessageCircle size={16}/></a>
            </div>
          </div>
          <div className={s.col}>
            <h4 className={s.ch}>Quick Links</h4>
            <ul className={s.ul}>
              {[['Buy Property','/properties?type=Sale'],['Rent Property','/properties?type=Rent'],
                ['Shortlet','/properties?type=Shortlet'],['Direct Listings','/direct-listings'],
                ['List Your Property','/list-property'],['Blog & Resources','/blog'],
                ['About Us','/about'],['Contact Us','/contact'],
                ['Privacy Policy','/privacy'],['Terms & Conditions','/terms'],
              ].map(([l,to]) => <li key={to}><Link to={to} className={s.fl}>{l}</Link></li>)}
            </ul>
          </div>
          <div className={s.col}>
            <h4 className={s.ch}>Popular Locations</h4>
            <ul className={s.ul}>
              {ABUJA_LOCATIONS.slice(0,10).map(loc => (
                <li key={loc}><Link to={`/location/${loc.toLowerCase().replace(/ /g,'-')}`} className={s.fl}>Properties in {loc}</Link></li>
              ))}
            </ul>
          </div>
          <div className={s.col}>
            <h4 className={s.ch}>Contact Us</h4>
            <div className={s.contacts}>
              {[[CONTACTS.phone1,'tel'],[CONTACTS.phone2,'tel']].map(([p]) => (
                <a key={p} href={`tel:${p}`} className={s.ci}><Phone size={14}/>{p}</a>
              ))}
              <a href={getWhatsAppLink(CONTACTS.whatsapp1,'Hello! I am interested in a property.')} target="_blank" rel="noreferrer" className={s.ci}><MessageCircle size={14}/>WhatsApp Us</a>
              <a href={`mailto:${CONTACTS.email}`} className={s.ci}><Mail size={14}/>{CONTACTS.email}</a>
            </div>
            <div className={s.footCtas}>
              <a href={getWhatsAppLink(CONTACTS.whatsapp1,'Hello! I want to enquire about properties.')} target="_blank" rel="noreferrer"
                className="btn btn-gold btn-sm" style={{justifyContent:'center'}}>
                <MessageCircle size={14}/>Chat on WhatsApp
              </a>
              <Link to="/list-property" className="btn btn-outline-white btn-sm" style={{justifyContent:'center',marginTop:'.5rem'}}>
                List My Property
              </Link>
            </div>
          </div>
        </div>
      </div></div>
      <div className={s.bottom}><div className="container">
        <div className={s.bi}>
          <p>&copy; {new Date().getFullYear()} Amon Heights Limited. All rights reserved.</p>
          <p>Abuja, Nigeria &bull; <a href={`https://www.${CONTACTS.website}`}>{CONTACTS.website}</a></p>
        </div>
      </div></div>
    </footer>
  )
}
