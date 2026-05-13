import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Bed,Bath,Car,MapPin,Phone,MessageCircle,Calendar,Home,Eye,ChevronLeft,ChevronRight,ArrowLeft,CheckCircle2,Video } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import PropertyMap from '../../components/shared/PropertyMap'
import BookingModal from '../../components/shared/BookingModal'
import PropertyCard from '../../components/shared/PropertyCard'
import { supabase } from '../../lib/supabase'
import { formatPrice, getWhatsAppLink } from '../../lib/utils'
import { CONTACTS } from '../../lib/constants'
import s from './PropertyDetailPage.module.css'

export default function PropertyDetailPage() {
  const {slug} = useParams()
  const [prop, setProp] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    supabase.from('properties').select('*').or(`slug.eq.${slug},id.eq.${slug}`).single()
      .then(({data}) => {
        setProp(data)
        if(data) supabase.from('properties').select('*').eq('listing_type',data.listing_type).eq('status','Available').neq('id',data.id).limit(3).then(({data:r}) => setRelated(r||[]))
        setLoading(false)
      })
  }, [slug])

  if(loading) return <PublicLayout><div className="page-loader" style={{minHeight:'80vh'}}><div className="spinner"/></div></PublicLayout>
  if(!prop) return <PublicLayout><div className={s.nf}><Home size={52}/><h2>Property Not Found</h2><p>This property may have been removed or sold.</p><Link to="/properties" className="btn btn-primary">Browse Properties</Link></div></PublicLayout>

  const imgs = prop.images?.length ? prop.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85']
  const waMsg = `Hello! I am interested in: ${prop.title} (${formatPrice(prop.price)}). Please provide more details.`
  const TB = {Sale:'b-navy',Rent:'b-red',Shortlet:'b-gold',Land:'b-green'}

  return (
    <PublicLayout>
      <div className={s.bc}><div className="container">
        <Link to="/properties" className={s.back}><ArrowLeft size={15}/>Back to Properties</Link>
        <span className={s.bsep}>/</span>
        <span className={s.bcur}>{prop.title}</span>
      </div></div>

      <div className="container" style={{paddingTop:'1.5rem',paddingBottom:'4rem'}}>
        <div className={s.layout}>
          <div className={s.main}>
            {/* Gallery */}
            <div className={s.gallery}>
              <div className={s.mimg}>
                <img src={imgs[imgIdx]} alt={prop.title}/>
                <div className={s.gbadges}>
                  <span className={`badge ${TB[prop.listing_type]||'b-navy'}`}>For {prop.listing_type}</span>
                  {prop.source==='Direct Listing' && <span className="badge b-gold">Direct Listing</span>}
                  {prop.status!=='Available' && <span className="badge b-gray">{prop.status}</span>}
                </div>
                {imgs.length>1 && <>
                  <button className={`${s.gnav} ${s.gprev}`} onClick={()=>setImgIdx(i=>i===0?imgs.length-1:i-1)}><ChevronLeft size={20}/></button>
                  <button className={`${s.gnav} ${s.gnext}`} onClick={()=>setImgIdx(i=>i===imgs.length-1?0:i+1)}><ChevronRight size={20}/></button>
                  <div className={s.gcnt}>{imgIdx+1}/{imgs.length}</div>
                </>}
              </div>
              {imgs.length>1 && (
                <div className={s.thumbs}>
                  {imgs.map((im,i)=>(
                    <button key={i} className={`${s.thumb} ${i===imgIdx?s.ta:''}`} onClick={()=>setImgIdx(i)}>
                      <img src={im} alt=""/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className={s.info}>
              <h1 className={s.ptitle}>{prop.title}</h1>
              <div className={s.pmeta}>
                <span className={s.pmc}><MapPin size={15}/>{prop.location}</span>
                <span className={s.pmc}><Home size={15}/>{prop.property_type}</span>
              </div>
              <div className={s.pprice}>{formatPrice(prop.price)}{prop.listing_type==='Rent'&&<small>/yr</small>}{prop.listing_type==='Shortlet'&&<small>/night</small>}</div>

              {prop.listing_type!=='Land' && (prop.bedrooms||prop.bathrooms||prop.parking) && (
                <div className={s.pfeats}>
                  {prop.bedrooms&&<div className={s.pf}><Bed size={20}/><strong>{prop.bedrooms}</strong><span>Bedrooms</span></div>}
                  {prop.bathrooms&&<div className={s.pf}><Bath size={20}/><strong>{prop.bathrooms}</strong><span>Bathrooms</span></div>}
                  {prop.parking&&<div className={s.pf}><Car size={20}/><strong>{prop.parking}</strong><span>Parking</span></div>}
                </div>
              )}

              {prop.description && <div className={s.psec}><h2 className={s.psh}>About This Property</h2><p className={s.pdesc}>{prop.description}</p></div>}

              {prop.features?.length>0 && (
                <div className={s.psec}>
                  <h2 className={s.psh}>Key Features</h2>
                  <div className={s.kfGrid}>{prop.features.map((f,i)=>(
                    <div key={i} className={s.kfi}><CheckCircle2 size={15} className={s.kfic}/>{f}</div>
                  ))}</div>
                </div>
              )}

              {prop.video_url && (
                <div className={s.psec}>
                  <h2 className={s.psh}><Video size={18}/>Property Video</h2>
                  <div className={s.vwrap}>
                    <iframe src={prop.video_url.includes('youtube')?prop.video_url.replace('watch?v=','embed/'):prop.video_url} frameBorder="0" allowFullScreen title="Property Video"/>
                  </div>
                </div>
              )}

              {(prop.latitude||prop.longitude) && (
                <div className={s.psec}>
                  <h2 className={s.psh}><MapPin size={18}/>Property Location</h2>
                  <PropertyMap lat={prop.latitude} lng={prop.longitude} title={prop.title} address={prop.address||prop.location}/>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className={s.sidebar}>
            <div className={s.scard}>
              <div className={s.sagent}>
                <img src="/logo.jpg" alt="Amon Heights" className={s.salogo}/>
                <div><div className={s.san}>Amon Heights Limited</div><div className={s.sas}>Verified Real Estate Agent</div></div>
              </div>
              <div className={s.sprice}>{formatPrice(prop.price)}</div>
              <div className={s.sctas}>
                <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={()=>setBooking('inspection')}>
                  <Home size={15}/>Book Inspection
                </button>
                <button className="btn btn-outline" style={{width:'100%',justifyContent:'center'}} onClick={()=>setBooking('meeting')}>
                  <Calendar size={15}/>Schedule Meeting
                </button>
                <a href={getWhatsAppLink(CONTACTS.whatsapp1,waMsg)} target="_blank" rel="noreferrer" className="btn" style={{width:'100%',justifyContent:'center',background:'#25D366',color:'white'}}>
                  <MessageCircle size={15}/>WhatsApp
                </a>
                <a href={`tel:${CONTACTS.phone1}`} className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}>
                  <Phone size={15}/>{CONTACTS.phone1}
                </a>
              </div>
              <div className={s.sdet}>
                {[['Type',prop.property_type],['Listing',`For ${prop.listing_type}`],['Location',prop.location],['Status',prop.status],prop.source&&['Source',prop.source]].filter(Boolean).map(([k,v])=>(
                  <div key={k} className={s.sdr}><span>{k}</span><strong style={v==='Available'?{color:'var(--green)'}:v==='Sold'||v==='Rented'?{color:'var(--red)'}:{}}>{v}</strong></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {related.length>0 && (
          <div style={{marginTop:'4rem'}}>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',color:'var(--navy)',marginBottom:'1.5rem'}}>Related Properties</h2>
            <div className="props-grid">{related.map(p=><PropertyCard key={p.id} property={p}/>)}</div>
          </div>
        )}
      </div>

      {booking && <BookingModal type={booking} property={prop} onClose={()=>setBooking(null)}/>}
    </PublicLayout>
  )
}
