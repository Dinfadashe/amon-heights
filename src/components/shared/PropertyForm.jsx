import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Plus, X, MapPin } from 'lucide-react'
import { MapPicker } from './PropertyMap'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../lib/utils'
import { PROPERTY_TYPES, LISTING_TYPES, ABUJA_LOCATIONS, PROPERTY_STATUS, LISTING_SOURCES } from '../../lib/constants'
import { useAuth } from '../../context/AuthContext'
import s from './PropertyForm.module.css'

const schema = z.object({
  title: z.string().min(5,'Title must be at least 5 characters'),
  slug: z.string().min(3,'Slug required'),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  property_type: z.string().min(1,'Select property type'),
  listing_type: z.string().min(1,'Select listing type'),
  price: z.string().min(1,'Price required'),
  location: z.string().min(1,'Location required'),
  address: z.string().optional(),
  description: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  parking: z.string().optional(),
  status: z.string().min(1,'Select status'),
  source: z.string().optional(),
  video_url: z.string().optional(),
  is_featured: z.boolean().optional(),
})

export default function PropertyForm({ backPath, successPath }) {
  const { id } = useParams()
  const isEdit = !!id
  const { user } = useAuth()
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [images, setImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [features, setFeatures] = useState([''])
  const [uploading, setUploading] = useState(false)
  const [mapCoords, setMapCoords] = useState({ lat: 9.0765, lng: 7.3986 })

  const { register, handleSubmit, watch, setValue, formState:{errors} } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'Available', source: 'Direct Listing', is_featured: false, listing_type: 'Sale', property_type: 'Duplex' }
  })

  const titleVal = watch('title')
  useEffect(() => {
    if(titleVal && !isEdit) setValue('slug', slugify(titleVal))
  }, [titleVal])

  useEffect(() => {
    if(!isEdit) return
    supabase.from('properties').select('*').eq('id',id).single().then(({data}) => {
      if(!data) return
      Object.entries(data).forEach(([k,v]) => {
        if(v !== null && v !== undefined) setValue(k, String(v))
      })
      setValue('is_featured', data.is_featured||false)
      setValue('price', String(data.price||''))
      setImageUrls(data.images||[])
      setFeatures(data.features?.length ? data.features : [''])
      if(data.latitude && data.longitude) setMapCoords({lat:parseFloat(data.latitude),lng:parseFloat(data.longitude)})
      setFetching(false)
    })
  }, [id])

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if(!files.length) return
    setUploading(true)
    try {
      const urls = []
      for(const file of files) {
        const ext = file.name.split('.').pop()
        const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error } = await supabase.storage.from('property-images').upload(path, file)
        if(error) throw error
        const { data } = supabase.storage.from('property-images').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
      setImageUrls(prev => [...prev, ...urls])
      toast.success(`${urls.length} image(s) uploaded`)
    } catch { toast.error('Image upload failed') }
    finally { setUploading(false) }
  }

  const removeImage = (i) => setImageUrls(prev => prev.filter((_,idx)=>idx!==i))

  const addFeature = () => setFeatures(prev => [...prev,''])
  const updateFeature = (i,v) => setFeatures(prev => prev.map((f,idx)=>idx===i?v:f))
  const removeFeature = (i) => setFeatures(prev => prev.filter((_,idx)=>idx!==i))

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        title: data.title, slug: data.slug,
        meta_title: data.meta_title||data.title,
        meta_description: data.meta_description||null,
        property_type: data.property_type, listing_type: data.listing_type,
        price: parseFloat(data.price)||null,
        location: data.location, address: data.address||null,
        description: data.description||null,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
        parking: data.parking ? parseInt(data.parking) : null,
        status: data.status, source: data.source||null,
        video_url: data.video_url||null,
        is_featured: data.is_featured||false,
        images: imageUrls,
        features: features.filter(f=>f.trim()),
        latitude: mapCoords.lat, longitude: mapCoords.lng,
        created_by: user?.id,
      }
      let error
      if(isEdit) {
        ({error} = await supabase.from('properties').update(payload).eq('id',id))
      } else {
        ({error} = await supabase.from('properties').insert(payload))
      }
      if(error) throw error
      toast.success(`Property ${isEdit?'updated':'created'} successfully!`)
      nav(successPath)
    } catch(err) { toast.error(err.message||'Failed to save property') }
    finally { setLoading(false) }
  }

  if(fetching) return <div className="page-loader"><div className="spinner"/></div>

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      {/* Basic Info */}
      <div className={s.sec}>
        <h3 className={s.sh}>Basic Information</h3>
        <div className="fg"><label className="fl">Property Title *</label>
          <input {...register('title')} className={`fi ${errors.title?'err':''}`} placeholder="e.g. Luxurious 4 Bedroom Duplex in Guzape"/>
          {errors.title && <span className="fe">{errors.title.message}</span>}
        </div>
        <div className="g2">
          <div className="fg"><label className="fl">URL Slug *</label>
            <input {...register('slug')} className={`fi ${errors.slug?'err':''}`} placeholder="auto-generated from title"/>
            {errors.slug && <span className="fe">{errors.slug.message}</span>}
          </div>
          <div className="fg"><label className="fl">Price (₦) *</label>
            <input {...register('price')} type="number" className={`fi ${errors.price?'err':''}`} placeholder="e.g. 85000000"/>
            {errors.price && <span className="fe">{errors.price.message}</span>}
          </div>
        </div>
        <div className="g2">
          <div className="fg"><label className="fl">SEO Meta Title</label>
            <input {...register('meta_title')} className="fi" placeholder="Defaults to property title"/>
          </div>
          <div className="fg"><label className="fl">Source</label>
            <select {...register('source')} className="fs">
              {LISTING_SOURCES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="fg"><label className="fl">Meta Description (SEO)</label>
          <textarea {...register('meta_description')} className="fta" rows={2} placeholder="Short description for search engines (150-160 chars)"/>
        </div>
      </div>

      {/* Type & Status */}
      <div className={s.sec}>
        <h3 className={s.sh}>Property Details</h3>
        <div className="g3">
          <div className="fg"><label className="fl">Property Type *</label>
            <select {...register('property_type')} className={`fs ${errors.property_type?'err':''}`}>
              {PROPERTY_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            {errors.property_type && <span className="fe">{errors.property_type.message}</span>}
          </div>
          <div className="fg"><label className="fl">Listing Type *</label>
            <select {...register('listing_type')} className={`fs ${errors.listing_type?'err':''}`}>
              {LISTING_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            {errors.listing_type && <span className="fe">{errors.listing_type.message}</span>}
          </div>
          <div className="fg"><label className="fl">Status *</label>
            <select {...register('status')} className={`fs ${errors.status?'err':''}`}>
              {PROPERTY_STATUS.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            {errors.status && <span className="fe">{errors.status.message}</span>}
          </div>
        </div>
        <div className="g3">
          <div className="fg"><label className="fl">Bedrooms</label>
            <input {...register('bedrooms')} type="number" min="0" className="fi" placeholder="e.g. 4"/>
          </div>
          <div className="fg"><label className="fl">Bathrooms</label>
            <input {...register('bathrooms')} type="number" min="0" className="fi" placeholder="e.g. 3"/>
          </div>
          <div className="fg"><label className="fl">Parking Spaces</label>
            <input {...register('parking')} type="number" min="0" className="fi" placeholder="e.g. 2"/>
          </div>
        </div>
        <div className="fg"><label className="fl">Description</label>
          <textarea {...register('description')} className="fta" rows={5} placeholder="Detailed property description..."/>
        </div>
        <div className="fg">
          <label className="chk-label">
            <input type="checkbox" {...register('is_featured')}/>
            <span><strong>Mark as Featured</strong> — Featured properties appear prominently on the homepage</span>
          </label>
        </div>
      </div>

      {/* Location */}
      <div className={s.sec}>
        <h3 className={s.sh}>Location</h3>
        <div className="g2">
          <div className="fg"><label className="fl">Area / Location *</label>
            <select {...register('location')} className={`fs ${errors.location?'err':''}`}>
              <option value="">Select location</option>
              {ABUJA_LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}
              <option value="Other">Other</option>
            </select>
            {errors.location && <span className="fe">{errors.location.message}</span>}
          </div>
          <div className="fg"><label className="fl">Full Address</label>
            <input {...register('address')} className="fi" placeholder="e.g. Plot 5, Crescent Drive, Guzape"/>
          </div>
        </div>
        <div className="fg"><label className="fl"><MapPin size={14}/>Pin Property on Map</label>
          <p style={{fontSize:'.8rem',color:'var(--gray-400)',marginBottom:'.65rem'}}>Click on the map or drag the pin to set the exact property location. Clients will use this to get directions.</p>
          <MapPicker lat={mapCoords.lat} lng={mapCoords.lng} onChange={setMapCoords}/>
          <div className={s.coords}>
            <span>Lat: {mapCoords.lat?.toFixed(6)}</span>
            <span>Lng: {mapCoords.lng?.toFixed(6)}</span>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className={s.sec}>
        <h3 className={s.sh}>Images & Media</h3>
        <div className="fg">
          <label className="fl">Property Images</label>
          <div className={s.uploadArea}>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} id="imgs" className={s.fileInput}/>
            <label htmlFor="imgs" className={s.uploadLbl}>
              <Plus size={22}/>
              <span>{uploading?'Uploading...':'Click to upload images'}</span>
              <small>JPG, PNG, WebP – Multiple files supported</small>
            </label>
          </div>
          {imageUrls.length>0 && (
            <div className={s.imgGrid}>
              {imageUrls.map((url,i)=>(
                <div key={i} className={s.imgItem}>
                  <img src={url} alt=""/>
                  <button type="button" className={s.rmImg} onClick={()=>removeImage(i)}><X size={13}/></button>
                  {i===0 && <span className={s.mainBadge}>Main</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="fg"><label className="fl">Video URL (YouTube / Vimeo)</label>
          <input {...register('video_url')} className="fi" placeholder="https://youtube.com/watch?v=..."/>
        </div>
      </div>

      {/* Key Features */}
      <div className={s.sec}>
        <h3 className={s.sh}>Key Features</h3>
        <div className={s.feats}>
          {features.map((f,i)=>(
            <div key={i} className={s.featRow}>
              <input value={f} onChange={e=>updateFeature(i,e.target.value)} className="fi" placeholder={`Feature ${i+1}, e.g. Swimming Pool`}/>
              {features.length>1 && <button type="button" className={s.rmFeat} onClick={()=>removeFeature(i)}><X size={15}/></button>}
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={addFeature}><Plus size={14}/>Add Feature</button>
        </div>
      </div>

      {/* Actions */}
      <div className={s.actBar}>
        <button type="button" className="btn btn-outline" onClick={()=>nav(backPath)}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading||uploading}>
          {loading ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  )
}
