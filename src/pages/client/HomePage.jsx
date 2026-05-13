import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Home, Building2, Trees, Star, ShieldCheck, Users, Phone, MessageCircle, ChevronRight, MapPin, TrendingUp, Award, CheckCircle2 } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import SearchFilter from '../../components/shared/SearchFilter'
import PropertyCard from '../../components/shared/PropertyCard'
import BookingModal from '../../components/shared/BookingModal'
import { supabase } from '../../lib/supabase'
import { CONTACTS, ABUJA_LOCATIONS } from '../../lib/constants'
import { getWhatsAppLink } from '../../lib/utils'
import s from './HomePage.module.css'

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    supabase.from('properties').select('*').eq('status','Available')
      .order('is_featured',{ascending:false}).order('created_at',{ascending:false}).limit(6)
      .then(({data}) => { setFeatured(data||[]); setLoading(false) })
  }, [])

  const handleFilter = (f) => {
    const p = new URLSearchParams()
    if(f.q) p.set('q',f.q)
    if(f.listingType) p.set('type',f.listingType)
    if(f.location) p.set('location',f.location)
    if(f.propertyType) p.set('property_type',f.propertyType)
    nav(`/properties?${p.toString()}`)
  }

  return (
    <PublicLayout>
      {/* HERO */}
      <section className={s.hero}>
        <div className={s.hbg}/>
        <div className={s.hov}/>
        <div className={`container ${s.hcontent}`}>
          <div className={s.htext}>
            <div className={s.hbadge}><Star size={13}/>Premium Real Estate in Abuja</div>
            <h1 className={s.ht1}>Find Your Perfect<br/><em>Dream Property</em></h1>
            <p className={s.hsub}>Amon Heights connects you with premium verified properties across Abuja — from luxury homes to prime investment land. Trusted. Transparent. Exceptional.</p>
            <div className={s.hstats}>
              <div className={s.hstat}><strong>500+</strong><span>Properties Listed</span></div>
              <div className={s.hdiv}/>
              <div className={s.hstat}><strong>1,000+</strong><span>Happy Clients</span></div>
              <div className={s.hdiv}/>
              <div className={s.hstat}><strong>10+</strong><span>Areas Covered</span></div>
            </div>
          </div>
          <div className={s.hsearch}>
            <h3 className={s.hstitle}>Search Properties</h3>
            <SearchFilter onFilter={handleFilter} compact/>
            <div className={s.qtypes}>
              {['Sale','Rent','Shortlet','Land'].map(t => (
                <button key={t} className={s.qbtn} onClick={()=>nav(`/properties?type=${t}`)}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className={s.wave}><svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f8f7f4"/></svg></div>
      </section>

      {/* CATEGORIES */}
      <section className={s.cats}>
        <div className="container">
          <div className={s.catGrid}>
            {[
              {icon:Home,label:'Buy',sub:'Find your forever home',link:'/properties?type=Sale',c:'#1a2744'},
              {icon:Building2,label:'Rent',sub:'Flexible living options',link:'/properties?type=Rent',c:'#c8102e'},
              {icon:Star,label:'Shortlet',sub:'Furnished & move-in ready',link:'/properties?type=Shortlet',c:'#c9a84c'},
              {icon:Trees,label:'Land',sub:'Prime plots & acres',link:'/properties?type=Land',c:'#16a34a'},
            ].map(cat => (
              <Link key={cat.label} to={cat.link} className={s.catCard}>
                <div className={s.catIcon} style={{background:cat.c+'18',color:cat.c}}><cat.icon size={26}/></div>
                <div><div className={s.catL}>{cat.label}</div><div className={s.catS}>{cat.sub}</div></div>
                <ArrowRight size={17} className={s.catArr} style={{color:cat.c}}/>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className={`section ${s.featSec}`}>
        <div className="container">
          <div className={s.secHd}>
            <div>
              <div className={s.secLbl}>Premium Listings</div>
              <h2 className={s.secTtl}>Featured Properties</h2>
              <p className={s.secSub}>Handpicked properties from Abuja's finest neighbourhoods</p>
            </div>
            <Link to="/properties" className="btn btn-outline">View All<ArrowRight size={15}/></Link>
          </div>
          {loading ? <div className="page-loader"><div className="spinner"/></div> :
           featured.length > 0 ? <div className="props-grid">{featured.map(p=><PropertyCard key={p.id} property={p}/>)}</div> :
           <div className={s.empty}><Building2 size={44}/><p>Properties coming soon — check back shortly!</p></div>}
        </div>
      </section>

      {/* DIRECT LISTINGS BAND */}
      <section className={s.directSec}>
        <div className="container">
          <div className={s.dGrid}>
            <div className={s.dText}>
              <div className={s.secLbl} style={{color:'var(--gold)'}}>Exclusive Advantage</div>
              <h2 className={s.secTtl} style={{color:'var(--white)'}}>Direct Listings</h2>
              <p style={{color:'rgba(255,255,255,.72)',marginBottom:'1.5rem',lineHeight:1.8,fontSize:'.95rem'}}>
                We work directly with property owners — no unnecessary middlemen, no inflated prices. Our direct listings give you access to verified properties at the most competitive rates.
              </p>
              <div className={s.dPts}>
                {['No hidden agent fees','Verified property owners','Faster closing transactions','Priority dedicated support'].map(p=>(
                  <div key={p} className={s.dPt}><CheckCircle2 size={15} style={{color:'var(--gold)'}}/>{p}</div>
                ))}
              </div>
              <div className={s.dActs}>
                <Link to="/direct-listings" className="btn btn-gold">Browse Direct Listings<ArrowRight size={15}/></Link>
                <Link to="/list-property" className="btn btn-outline-white">List My Property</Link>
              </div>
            </div>
            <div className={s.dImg}>
              <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=700&q=85" alt="Direct listing premium property"/>
              <div className={s.dBadge}><Award size={18} style={{color:'var(--gold)'}}/><div><strong>Verified Properties</strong><span>100% Authentic Listings</span></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="section">
        <div className="container">
          <div className={s.secHd} style={{marginBottom:'1.5rem'}}>
            <div><div className={s.secLbl}>Browse by Area</div><h2 className={s.secTtl}>Popular Locations in Abuja</h2></div>
          </div>
          <div className={s.locGrid}>
            {ABUJA_LOCATIONS.slice(0,10).map(loc=>(
              <Link key={loc} to={`/location/${loc.toLowerCase().replace(/ /g,'-')}`} className={s.locCard}>
                <MapPin size={16} className={s.locPin}/><span>{loc}</span><ChevronRight size={13} className={s.locArr}/>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className={`section ${s.whySec}`}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'2.75rem'}}>
            <div className={s.secLbl}>Why Amon Heights</div>
            <h2 className={s.secTtl}>The Smarter Way to Find Property</h2>
          </div>
          <div className={s.whyGrid}>
            {[
              {icon:ShieldCheck,t:'Verified Listings',d:'Every property is personally verified by our team for authenticity and accuracy before going live.'},
              {icon:Users,t:'Expert Agents',d:'Our professional agents guide you through every step — from search to successful handover.'},
              {icon:TrendingUp,t:'Best Market Prices',d:'We negotiate on your behalf to ensure you get outstanding value for your investment.'},
              {icon:Award,t:'Trusted by Thousands',d:'Over 1,000 families and investors have trusted Amon Heights to find their perfect property.'},
            ].map(w=>(
              <div key={w.t} className={s.whyCard}>
                <div className={s.whyIco}><w.icon size={26}/></div>
                <h3 className={s.whyT}>{w.t}</h3>
                <p className={s.whyD}>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SNIPPET */}
      <section className={s.aboutSnip}>
        <div className="container">
          <div className={s.aGrid}>
            <div className={s.aImg}><img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=85" alt="Amon Heights team"/></div>
            <div className={s.aText}>
              <div className={s.secLbl}>About Us</div>
              <h2 className={s.secTtl}>Your Trusted Real Estate Partner</h2>
              <p style={{color:'var(--gray-600)',lineHeight:1.85,marginBottom:'1rem',fontSize:'.95rem'}}>
                Amon Heights Limited is a dynamic real estate company based in Abuja, Nigeria, specializing in property sales, rentals, shortlets, and real estate investment solutions.
              </p>
              <p style={{color:'var(--gray-600)',lineHeight:1.85,marginBottom:'1.5rem',fontSize:'.95rem'}}>
                Our mission: To provide reliable, transparent, and efficient real estate services that connect clients with the right property opportunities. We prioritize direct listings to reduce middlemen and ensure faster, better-value transactions.
              </p>
              <Link to="/about" className="btn btn-primary">Learn More About Us<ArrowRight size={15}/></Link>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className={s.ctaBand}>
        <div className="container">
          <div className={s.ctaInner}>
            <div>
              <h2 className={s.ctaT}>Ready to Find Your Dream Property?</h2>
              <p className={s.ctaS}>Book a meeting or property inspection today — our dedicated team is ready for you.</p>
            </div>
            <div className={s.ctaBtns}>
              <button className="btn btn-gold btn-lg" onClick={()=>setBooking('meeting')}>📅 Book a Meeting</button>
              <button className="btn btn-outline-white btn-lg" onClick={()=>setBooking('inspection')}>🏠 Book Inspection</button>
              <a href={getWhatsAppLink(CONTACTS.whatsapp1,'Hello! I want to enquire about properties.')} target="_blank" rel="noreferrer" className="btn btn-outline-white btn-lg">
                <MessageCircle size={17}/>WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className={s.cStrip}>
        <div className="container">
          <div className={s.csInner}>
            <div><h3 className={s.csT}>Speak to an Agent Now</h3><p className={s.csS}>Available Monday – Saturday, 8am – 6pm</p></div>
            <div className={s.csBtns}>
              <a href={`tel:${CONTACTS.phone1}`} className="btn btn-primary"><Phone size={15}/>{CONTACTS.phone1}</a>
              <a href={`tel:${CONTACTS.phone2}`} className="btn btn-outline"><Phone size={15}/>{CONTACTS.phone2}</a>
              <a href={getWhatsAppLink(CONTACTS.whatsapp1)} target="_blank" rel="noreferrer" className="btn" style={{background:'#25D366',color:'white'}}><MessageCircle size={15}/>WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {booking && <BookingModal type={booking} property={null} onClose={()=>setBooking(null)}/>}
    </PublicLayout>
  )
}
