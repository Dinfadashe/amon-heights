import { Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Car, Eye } from 'lucide-react'
import { formatPrice } from '../../lib/utils'
import s from './PropertyCard.module.css'

const TYPE_BADGE = {Sale:'b-navy',Rent:'b-red',Shortlet:'b-gold',Land:'b-green'}

export default function PropertyCard({ property }) {
  const { id, title, slug, price, listing_type, property_type, location, bedrooms, bathrooms, parking, images, status, source, is_featured } = property
  const img = images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'
  const href = `/properties/${slug||id}`

  return (
    <div className={`card ${s.card}`}>
      <Link to={href} className={s.imgW}>
        <img src={img} alt={title} className={s.img} loading="lazy"/>
        <div className={s.badges}>
          <span className={`badge ${TYPE_BADGE[listing_type]||'b-navy'}`}>{listing_type}</span>
          {source==='Direct Listing' && <span className="badge b-gold">Direct</span>}
          {is_featured && <span className="badge b-gold">Featured</span>}
        </div>
        {status !== 'Available' && <div className={s.sold}>{status}</div>}
        <div className={s.ov}><span className={s.vb}><Eye size={14}/>View Details</span></div>
      </Link>
      <div className={s.body}>
        <div className={s.loc}><MapPin size={12}/><span>{location}</span></div>
        <Link to={href}><h3 className={s.title}>{title}</h3></Link>
        <div className={s.price}>{formatPrice(price)}</div>
        {listing_type !== 'Land' && (
          <div className={s.feats}>
            {bedrooms && <span className={s.feat}><Bed size={13}/>{bedrooms} Bed</span>}
            {bathrooms && <span className={s.feat}><Bath size={13}/>{bathrooms} Bath</span>}
            {parking && <span className={s.feat}><Car size={13}/>{parking} Park</span>}
          </div>
        )}
        <div className={s.foot}>
          <span className="tag">{property_type}</span>
          <Link to={href} className="btn btn-primary btn-sm">Details</Link>
        </div>
      </div>
    </div>
  )
}
