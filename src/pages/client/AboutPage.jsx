import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, TrendingUp, Users, Zap, Award, Target,
  CheckCircle2, Download, FileText, X, Phone, MessageCircle,
  Building2, Star, BarChart3
} from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import { CONTACTS } from '../../lib/constants'
import { getWhatsAppLink } from '../../lib/utils'
import s from './AboutPage.module.css'

const TEAM = [
  { name: 'Mr Wale Akinmeji', role: 'CEO / Lead Developer', exp: '15+ yrs', desc: 'Strategic oversight and investor relations. Over a decade of premium real estate development across Abuja.' },
  { name: 'Arc Samuel Ojukwu Mcdallas', role: 'Lead Architect (MNIA)', exp: '12+ yrs', desc: 'Design and aesthetics. Delivers award-worthy architectural concepts that meet global standards.' },
  { name: 'Mr Itoro', role: 'Quantity Surveyor', exp: '8+ yrs', desc: 'Cost management and budget control ensuring every project is delivered within financial targets.' },
  { name: 'Ms Adeola', role: 'Sales & Marketing Manager', exp: '10+ yrs', desc: 'Client acquisition and sales. Has closed hundreds of millions in property transactions across Abuja.' },
  { name: 'Mr Toyosi Akinwunmi', role: 'Finance & Compliance Officer (CPA)', exp: '7+ yrs', desc: 'Accounting, investor payouts and regulatory compliance ensuring transparency at every step.' },
  { name: 'Project Engineer', role: 'Structural Engineer', exp: '10+ yrs', desc: 'Structural integrity and compliance. Ensures every development meets the highest safety standards.' },
]

const TRACK_RECORD = [
  { title: 'Wuse II Commercial Plaza', type: 'Commercial', desc: 'A multi-level retail and office complex — fully sold and occupied.' },
  { title: 'Staff Housing Units', type: 'Residential', desc: 'Federal Ministry of Agriculture — terrace duplexes and apartments, delivered on time.' },
  { title: 'Staff Housing Units', type: 'Residential', desc: 'Federal Ministry of Science & Technology — serviced apartment complex, 100% occupancy.' },
  { title: 'Asokoro Villas', type: 'Luxury', desc: 'Semi-detached and terraced luxury villas — managed, marketed and fully sold to high-end buyers.' },
]

const CORE_VALUES = [
  { icon: ShieldCheck, title: 'Integrity', desc: 'Every transaction and partnership is handled with full transparency and accountability.' },
  { icon: Award, title: 'Excellence', desc: 'Commitment to top-tier quality and timely project delivery on every development.' },
  { icon: Zap, title: 'Innovation', desc: 'Adoption of modern building technologies and cutting-edge marketing approaches.' },
  { icon: Users, title: 'Partnership', desc: 'Prioritizing shared success and long-term investor and client relationships.' },
]

export default function AboutPage() {
  const [profileModal, setProfileModal] = useState(false)

  return (
    <PublicLayout>
      {/* HERO */}
      <div className={s.hero}>
        <div className={s.hOv}/>
        <div className={`container ${s.hContent}`}>
          <div className={s.hBadge}><Star size={13}/>Est. 2019 — Abuja, Nigeria</div>
          <h1 className={s.hTitle}>About Amon Heights<br/><em>Limited</em></h1>
          <p className={s.hSub}>A premier real estate development and construction company headquartered in Abuja, with over 6 billion Naira worth of delivered projects.</p>
          <div className={s.hBtns}>
            <button className="btn btn-gold btn-lg" onClick={() => setProfileModal(true)}>
              <FileText size={17}/>View Company Profile
            </button>
            <a href="/company-profile.pdf" download="Amon-Heights-Company-Profile.pdf" className="btn btn-outline-white btn-lg">
              <Download size={17}/>Download Profile PDF
            </a>
          </div>
        </div>
      </div>

      {/* STATS */}
      <section className={s.statsBar}>
        <div className="container">
          <div className={s.statsGrid}>
            {[
              { val: '6B+', label: 'Naira in Properties Delivered' },
              { val: '2019', label: 'Year Founded' },
              { val: '12+', label: 'Team Members' },
              { val: '100%', label: 'Sales and Occupancy Rate' },
            ].map(st => (
              <div key={st.label} className={s.statItem}>
                <div className={s.statVal}>{st.val}</div>
                <div className={s.statLbl}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD BANNER */}
      <section className={s.dlBanner}>
        <div className="container">
          <div className={s.dlInner}>
            <div className={s.dlLeft}>
              <FileText size={40} className={s.dlIco}/>
              <div>
                <h3 className={s.dlT}>Company Profile and Investment Prospectus</h3>
                <p className={s.dlS}>Download our full business plan and investment opportunity document. Includes financial projections, ROI details, team profiles, track record and project pipeline.</p>
              </div>
            </div>
            <div className={s.dlBtns}>
              <button className="btn btn-primary" onClick={() => setProfileModal(true)}>
                <FileText size={15}/>Read Online
              </button>
              <a href="/company-profile.pdf" download="Amon-Heights-Company-Profile.pdf" className="btn btn-gold">
                <Download size={15}/>Download PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="section">
        <div className="container">
          <div className={s.aboutGrid}>
            <div className={s.aImg}>
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=85" alt="Amon Heights office"/>
              <div className={s.aImgBadge}>
                <Award size={18} style={{color:'var(--gold)'}}/>
                <div><strong>Trusted Since 2019</strong><span>Abuja, Nigeria</span></div>
              </div>
            </div>
            <div className={s.aTxt}>
              <div className={s.lbl}>Who We Are</div>
              <h2 className={s.th2}>Amon Heights Limited</h2>
              <p className={s.tp}>Amon Heights Limited is a premier real estate development and construction company headquartered in Abuja, Nigeria. The company has built a reputation for integrity, innovation, and excellence, with a portfolio that includes over <strong>6 billion Naira worth of delivered real estate developments</strong> across Abuja's most desirable districts.</p>
              <p className={s.tp} style={{marginTop:'.85rem'}}>Our integrated approach — combining in-house expertise with strategic partnerships — ensures cost efficiency, timely delivery, and premium market positioning.</p>
              <div className={s.compDetails}>
                {[
                  ['Industry', 'Real Estate Marketing, Development and Construction'],
                  ['Head Office', 'Suite 106, Holborn House, Zone E, Apo, Abuja'],
                  ['Founded', '2019'],
                  ['Business Model', 'Property Development, Sales, Facility Management and Investment Partnerships'],
                  ['Team Size', '12+ professionals including architects, engineers and project managers'],
                ].map(([k, v]) => (
                  <div key={k} className={s.cdr}><span>{k}</span><strong>{v}</strong></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className={`section ${s.mvSec}`}>
        <div className="container">
          <div className={s.mvGrid}>
            <div className={s.mvCard}>
              <div className={s.mvIco}><Target size={28}/></div>
              <h3>Mission Statement</h3>
              <p>To build enduring value in the real estate sector by delivering exceptional developments, maximizing investor returns, and promoting sustainable urban growth.</p>
            </div>
            <div className={s.mvCard}>
              <div className={s.mvIco}><TrendingUp size={28}/></div>
              <h3>Vision Statement</h3>
              <p>To become one of Nigeria's most trusted and innovative real estate firms, recognized for excellence, transparency, and mutually beneficial partnerships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
            <div className={s.lbl}>What Drives Us</div>
            <h2 className={s.th2}>Our Core Values</h2>
          </div>
          <div className={s.valGrid}>
            {CORE_VALUES.map(v => (
              <div key={v.title} className={s.valCard}>
                <div className={s.valIco}><v.icon size={26}/></div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACK RECORD */}
      <section className={`section ${s.trackSec}`}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
            <div className={s.lbl} style={{color:'var(--gold)'}}>Proven Results</div>
            <h2 className={s.th2} style={{color:'var(--white)'}}>Track Record Highlights</h2>
            <p style={{color:'rgba(255,255,255,.6)',marginTop:'.5rem'}}>Over 6 billion Naira in successfully delivered and sold real estate developments</p>
          </div>
          <div className={s.trackGrid}>
            {TRACK_RECORD.map((t, i) => (
              <div key={i} className={s.trackCard}>
                <div className={s.tcTop}>
                  <span className={`badge ${t.type==='Luxury'?'b-gold':t.type==='Commercial'?'b-red':'b-navy'}`}>{t.type}</span>
                </div>
                <Building2 size={28} className={s.tcIco}/>
                <h3 className={s.tcT}>{t.title}</h3>
                <p className={s.tcD}>{t.desc}</p>
                <div className={s.tcCheck}><CheckCircle2 size={14}/> 100% Sold and Occupied</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className={`section ${s.teamSec}`}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
            <div className={s.lbl}>Our People</div>
            <h2 className={s.th2}>Meet the Leadership Team</h2>
            <p style={{color:'var(--gray-500)',marginTop:'.5rem'}}>Experienced professionals delivering excellence across every project</p>
          </div>
          <div className={s.teamGrid}>
            {TEAM.map(tm => (
              <div key={tm.name} className={s.teamCard}>
                <div className={s.tmAvatar}>{tm.name.split(' ').slice(-1)[0][0]}</div>
                <div className={s.tmExp}>{tm.exp}</div>
                <h3 className={s.tmName}>{tm.name}</h3>
                <div className={s.tmRole}>{tm.role}</div>
                <p className={s.tmDesc}>{tm.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INVESTMENT SECTION */}
      <section className={s.investSec}>
        <div className="container">
          <div className={s.investGrid}>
            <div className={s.investTxt}>
              <div className={s.lbl} style={{color:'var(--gold)'}}>Investment Opportunity</div>
              <h2 className={s.th2} style={{color:'var(--white)'}}>Profit-Sharing Partnership Model</h2>
              <p style={{color:'rgba(255,255,255,.72)',lineHeight:1.85,marginBottom:'1.25rem',fontSize:'.95rem'}}>
                We offer a structured real estate investment opportunity where investors participate in project funding and share in profits from sales. Amon Heights handles all design, construction, and marketing — you provide the capital and share the profits.
              </p>
              <div className={s.investPoints}>
                {[
                  ['42.5%+', 'Minimum projected ROI within 18 months'],
                  ['50 / 50', 'Equal profit-sharing ratio between investors and Amon Heights'],
                  ['100M min', 'Minimum investment per investor in pooled JV funding'],
                  ['12-18 Months', 'Project duration from capital injection to investor payout'],
                ].map(([val, desc]) => (
                  <div key={val} className={s.ipt}>
                    <div className={s.iptVal}>{val}</div>
                    <div className={s.iptDesc}>{desc}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginTop:'1.75rem'}}>
                <a href="/company-profile.pdf" download="Amon-Heights-Company-Profile.pdf" className="btn btn-gold btn-lg">
                  <Download size={16}/>Download Investment Prospectus
                </a>
                <a href={getWhatsAppLink(CONTACTS.whatsapp1,'Hello! I am interested in the investment partnership opportunity at Amon Heights.')}
                  target="_blank" rel="noreferrer" className="btn btn-outline-white">
                  <MessageCircle size={16}/>Discuss Investment
                </a>
              </div>
            </div>
            <div className={s.investImg}>
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=85" alt="Investment properties"/>
              <div className={s.investBadge}>
                <BarChart3 size={20} style={{color:'var(--gold)'}}/>
                <div><strong>Asset-Backed Security</strong><span>Legal JV Agreement and Project Lien</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={s.ctaSec}>
        <div className="container">
          <div className={s.ctaInner}>
            <div>
              <h2 className={s.ctaT}>Ready to Work With Us?</h2>
              <p className={s.ctaS}>Whether you are buying, renting, listing a property or exploring investment opportunities — we are here to help.</p>
            </div>
            <div className={s.ctaBtns}>
              <Link to="/properties" className="btn btn-gold btn-lg">Browse Properties</Link>
              <Link to="/contact" className="btn btn-outline-white btn-lg">Contact Us</Link>
              <a href={`tel:${CONTACTS.phone1}`} className="btn btn-outline-white btn-lg"><Phone size={16}/>{CONTACTS.phone1}</a>
            </div>
          </div>
        </div>
      </section>

      {/* PDF MODAL */}
      {profileModal && (
        <div className={s.pdfModal} onClick={e => e.target === e.currentTarget && setProfileModal(false)}>
          <div className={s.pdfBox}>
            <div className={s.pdfHdr}>
              <div>
                <h2 className={s.pdfT}>Amon Heights — Company Profile</h2>
                <p className={s.pdfS}>Business Plan for Real Estate Investment Partnership</p>
              </div>
              <div className={s.pdfHdrBtns}>
                <a href="/company-profile.pdf" download="Amon-Heights-Company-Profile.pdf" className="btn btn-gold btn-sm">
                  <Download size={14}/>Download
                </a>
                <button className={s.pdfClose} onClick={() => setProfileModal(false)}><X size={20}/></button>
              </div>
            </div>
            <div className={s.pdfContent}>
              <iframe
                src="/company-profile.pdf"
                title="Amon Heights Company Profile"
                className={s.pdfFrame}
              />
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  )
}