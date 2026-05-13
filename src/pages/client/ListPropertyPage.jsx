import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { CheckSquare, Home, Upload, X, Image, Video } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import { supabase } from '../../lib/supabase'
import s from './ListPropertyPage.module.css'

const schema = z.object({
  full_name: z.string().min(2,'Name required'),
  company: z.string().optional(),
  phone: z.string().min(10,'Valid phone required'),
  phone2: z.string().optional(),
  email: z.string().email('Valid email required'),
  residential_address: z.string().min(5,'Address required'),
  id_type: z.string().optional(),
  property_type: z.string().min(1,'Select property type'),
  property_purpose: z.string().min(1,'Select purpose'),
  property_address: z.string().min(5,'Property address required'),
  title_document: z.string().optional(),
  land_size: z.string().optional(),
  rooms_units: z.string().optional(),
  features_facilities: z.string().optional(),
  asking_price: z.string().optional(),
  rental_price: z.string().optional(),
  availability_date: z.string().optional(),
  existing_tenants: z.string().optional(),
  tenant_until: z.string().optional(),
  special_conditions: z.string().optional(),
  neighbourhood: z.string().optional(),
  road_access: z.string().optional(),
  utilities: z.string().optional(),
  other_info: z.string().optional(),
  declaration: z.boolean().refine(v=>v===true,'You must accept the declaration'),
})

const TITLE_DOCS = ['C of O','Governors Consent','Deed of Assignment','Statutory Right of Occupancy','Other']
const PROP_TYPES = ['Land','Residential - Duplex','Residential - Detached','Residential - Semi-Detached','Residential - Terrace','Residential - Bungalow','Residential - Apartment','Commercial']

export default function ListPropertyPage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [imageError, setImageError] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)

  const [video, setVideo] = useState(null)
  const [videoPreview, setVideoPreview] = useState('')
  const [uploadingVideo, setUploadingVideo] = useState(false)

  const { register, handleSubmit, watch, formState:{errors} } = useForm({ resolver: zodResolver(schema) })
  const hasTenants = watch('existing_tenants') === 'yes'

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const total = images.length + files.length
    if (total > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    const newPreviews = files.map(f => URL.createObjectURL(f))
    setImages(prev => [...prev, ...files])
    setImagePreviews(prev => [...prev, ...newPreviews])
    setImageError('')
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_,i) => i !== index))
    setImagePreviews(prev => prev.filter((_,i) => i !== index))
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Video must be under 100MB')
      return
    }
    setVideo(file)
    setVideoPreview(URL.createObjectURL(file))
  }

  const removeVideo = () => {
    setVideo(null)
    setVideoPreview('')
  }

  const uploadFiles = async () => {
    const uploadedImageUrls = []
    let uploadedVideoUrl = ''

    if (images.length > 0) {
      setUploadingImages(true)
      for (const file of images) {
        const ext = file.name.split('.').pop()
        const path = `listing-requests/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error } = await supabase.storage.from('property-images').upload(path, file)
        if (error) throw new Error('Image upload failed: ' + error.message)
        const { data } = supabase.storage.from('property-images').getPublicUrl(path)
        uploadedImageUrls.push(data.publicUrl)
      }
      setUploadingImages(false)
    }

    if (video) {
      setUploadingVideo(true)
      const ext = video.name.split('.').pop()
      const path = `listing-requests/videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('property-images').upload(path, video)
      if (error) throw new Error('Video upload failed: ' + error.message)
      const { data } = supabase.storage.from('property-images').getPublicUrl(path)
      uploadedVideoUrl = data.publicUrl
      setUploadingVideo(false)
    }

    return { uploadedImageUrls, uploadedVideoUrl }
  }

  const onSubmit = async (data) => {
    if (images.length < 3) {
      setImageError('Please upload at least 3 images of the property')
      window.scrollTo({ top: document.getElementById('image-upload-section').offsetTop - 100, behavior: 'smooth' })
      return
    }

    setLoading(true)
    try {
      const { uploadedImageUrls, uploadedVideoUrl } = await uploadFiles()

      const { error } = await supabase.from('direct_listing_requests').insert({
        full_name: data.full_name,
        company: data.company || null,
        phone: data.phone,
        phone2: data.phone2 || null,
        email: data.email,
        residential_address: data.residential_address,
        id_type: data.id_type || null,
        property_type: data.property_type,
        property_purpose: data.property_purpose,
        property_address: data.property_address,
        title_document: data.title_document || null,
        land_size: data.land_size || null,
        rooms_units: data.rooms_units || null,
        features_facilities: data.features_facilities || null,
        asking_price: data.asking_price || null,
        rental_price: data.rental_price || null,
        availability_date: data.availability_date || null,
        existing_tenants: data.existing_tenants || null,
        tenant_until: data.tenant_until || null,
        special_conditions: data.special_conditions || null,
        neighbourhood: data.neighbourhood || null,
        road_access: data.road_access || null,
        utilities: data.utilities || null,
        other_info: data.other_info || null,
        images: uploadedImageUrls,
        video_url: uploadedVideoUrl || null,
        status: 'new'
      })

      if (error) throw error
      setDone(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast.error(err.message || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <PublicLayout>
      <div className={s.success}>
        <CheckSquare size={56} className={s.sico}/>
        <h2>Listing Request Submitted!</h2>
        <p>Thank you! Our team will review your property details and contact you within 24 hours to proceed with listing your property.</p>
        <a href="/" className="btn btn-primary" style={{marginTop:'1rem'}}>Back to Home</a>
      </div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      <div className={s.hdr}>
        <div className="container">
          <div className={s.hico}><Home size={28}/></div>
          <h1 className={s.ht}>List Your Property With Us</h1>
          <p className={s.hs}>Fill in the form below and our team will contact you to get your property listed and marketed professionally.</p>
        </div>
      </div>

      <section className="section"><div className="container">
        <div className={s.formWrap}>
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* SECTION 1: Owner Info */}
            <div className={s.fsec}>
              <h3 className={s.fsh}><span>1</span>Owner Information</h3>
              <div className="g2">
                <div className="fg"><label className="fl">Full Name *</label>
                  <input {...register("full_name")} className={`fi ${errors.full_name?"err":""}`} placeholder="Your legal full name"/>
                  {errors.full_name && <span className="fe">{errors.full_name.message}</span>}
                </div>
                <div className="fg"><label className="fl">Company (optional)</label>
                  <input {...register("company")} className="fi" placeholder="Company name"/>
                </div>
              </div>
              <div className="g2">
                <div className="fg"><label className="fl">Primary Phone *</label>
                  <input {...register("phone")} className={`fi ${errors.phone?"err":""}`} placeholder="080XXXXXXXX"/>
                  {errors.phone && <span className="fe">{errors.phone.message}</span>}
                </div>
                <div className="fg"><label className="fl">Secondary Phone</label>
                  <input {...register("phone2")} className="fi" placeholder="Alternative number"/>
                </div>
              </div>
              <div className="g2">
                <div className="fg"><label className="fl">Email Address *</label>
                  <input {...register("email")} type="email" className={`fi ${errors.email?"err":""}`} placeholder="your@email.com"/>
                  {errors.email && <span className="fe">{errors.email.message}</span>}
                </div>
                <div className="fg"><label className="fl">ID Type and Number</label>
                  <input {...register("id_type")} className="fi" placeholder="e.g. NIN: 12345678901"/>
                </div>
              </div>
              <div className="fg"><label className="fl">Residential Address *</label>
                <input {...register("residential_address")} className={`fi ${errors.residential_address?"err":""}`} placeholder="Your current home address"/>
                {errors.residential_address && <span className="fe">{errors.residential_address.message}</span>}
              </div>
            </div>

            {/* SECTION 2: Property Info */}
            <div className={s.fsec}>
              <h3 className={s.fsh}><span>2</span>Property Information</h3>
              <div className="g2">
                <div className="fg"><label className="fl">Property Type *</label>
                  <select {...register("property_type")} className={`fs ${errors.property_type?"err":""}`}>
                    <option value="">Select property type</option>
                    {PROP_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.property_type && <span className="fe">{errors.property_type.message}</span>}
                </div>
                <div className="fg"><label className="fl">Purpose *</label>
                  <select {...register("property_purpose")} className={`fs ${errors.property_purpose?"err":""}`}>
                    <option value="">Select purpose</option>
                    <option value="Sale">For Sale</option>
                    <option value="Rent">For Rent / Lease</option>
                    <option value="Both">Both Sale and Rent</option>
                  </select>
                  {errors.property_purpose && <span className="fe">{errors.property_purpose.message}</span>}
                </div>
              </div>
              <div className="fg"><label className="fl">Property Address / Location *</label>
                <input {...register("property_address")} className={`fi ${errors.property_address?"err":""}`} placeholder="Full address or location of the property"/>
                {errors.property_address && <span className="fe">{errors.property_address.message}</span>}
              </div>
              <div className="g2">
                <div className="fg"><label className="fl">Title Document</label>
                  <select {...register("title_document")} className="fs">
                    <option value="">Select title document</option>
                    {TITLE_DOCS.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="fg"><label className="fl">Land Size / Measurement</label>
                  <input {...register("land_size")} className="fi" placeholder="e.g. 500 sqm, 1 acre"/>
                </div>
              </div>
              <div className="g2">
                <div className="fg"><label className="fl">Number of Rooms / Units</label>
                  <input {...register("rooms_units")} className="fi" placeholder="e.g. 4 bedrooms, 3 bathrooms"/>
                </div>
                <div className="fg"><label className="fl">Availability Date</label>
                  <input {...register("availability_date")} type="date" className="fi"/>
                </div>
              </div>
              <div className="fg"><label className="fl">Property Features and Facilities</label>
                <textarea {...register("features_facilities")} className="fta" placeholder="e.g. Swimming pool, BQ, Security, Generator, etc." rows={3}/>
              </div>
              <div className="g2">
                <div className="fg"><label className="fl">Asking Sale Price (NGN)</label>
                  <input {...register("asking_price")} type="number" className="fi" placeholder="e.g. 50000000"/>
                </div>
                <div className="fg"><label className="fl">Rental Price (NGN/year)</label>
                  <input {...register("rental_price")} type="number" className="fi" placeholder="e.g. 2000000"/>
                </div>
              </div>
              <div className="fg"><label className="fl">Existing Tenants?</label>
                <select {...register("existing_tenants")} className="fs">
                  <option value="">Select</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {hasTenants && (
                <div className="fg"><label className="fl">Tenancy Ends</label>
                  <input {...register("tenant_until")} type="date" className="fi"/>
                </div>
              )}
              <div className="fg"><label className="fl">Special Conditions</label>
                <textarea {...register("special_conditions")} className="fta" placeholder="Any special conditions or requirements..." rows={2}/>
              </div>
            </div>

            {/* SECTION 3: Additional Info */}
            <div className={s.fsec}>
              <h3 className={s.fsh}><span>3</span>Additional Details (Optional)</h3>
              <div className="g2">
                <div className="fg"><label className="fl">Neighbourhood / Landmark</label>
                  <input {...register("neighbourhood")} className="fi" placeholder="e.g. Opposite Shoprite"/>
                </div>
                <div className="fg"><label className="fl">Road Access</label>
                  <input {...register("road_access")} className="fi" placeholder="e.g. Tarred road"/>
                </div>
              </div>
              <div className="g2">
                <div className="fg"><label className="fl">Utilities</label>
                  <input {...register("utilities")} className="fi" placeholder="e.g. Borehole, AEDC, Generator"/>
                </div>
                <div className="fg"><label className="fl">Other Information</label>
                  <input {...register("other_info")} className="fi" placeholder="Any other relevant details"/>
                </div>
              </div>
            </div>

            {/* SECTION 4: Images */}
            <div className={s.fsec} id="image-upload-section">
              <h3 className={s.fsh}><span>4</span>Property Images <span className={s.req}>Minimum 3 required</span></h3>
              <p className={s.mediaNote}>Upload clear photos of the property — exterior, interior, rooms, compound, etc. Minimum 3, maximum 10 images.</p>

              <div className={`${s.uploadBox} ${imageError ? s.uploadBoxError : ''}`}>
                <input
                  type="file"
                  id="img-upload"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  multiple
                  onChange={handleImageChange}
                  className={s.fileInput}
                />
                <label htmlFor="img-upload" className={s.uploadLbl}>
                  <Image size={32} className={s.uploadIco}/>
                  <span className={s.uploadTxt}>Click to upload property images</span>
                  <span className={s.uploadSub}>JPG, PNG, WebP — Up to 10 images — {images.length}/10 uploaded</span>
                  {images.length < 3 && (
                    <span className={s.uploadReq}>At least {3 - images.length} more image{3 - images.length > 1 ? 's' : ''} required</span>
                  )}
                  {images.length >= 3 && (
                    <span className={s.uploadOk}>Minimum requirement met</span>
                  )}
                </label>
              </div>

              {imageError && <p className={s.imgError}>{imageError}</p>}

              {imagePreviews.length > 0 && (
                <div className={s.previewGrid}>
                  {imagePreviews.map((src, i) => (
                    <div key={i} className={s.previewItem}>
                      <img src={src} alt={`Property ${i+1}`}/>
                      <button type="button" className={s.removeBtn} onClick={() => removeImage(i)}>
                        <X size={13}/>
                      </button>
                      {i === 0 && <span className={s.mainTag}>Main Photo</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 5: Video */}
            <div className={s.fsec}>
              <h3 className={s.fsh}><span>5</span>Property Video <span className={s.opt}>Optional</span></h3>
              <p className={s.mediaNote}>Upload a walkthrough or showcase video of the property. Max 100MB. Supported formats: MP4, MOV, AVI.</p>

              {!videoPreview ? (
                <div className={s.uploadBox}>
                  <input
                    type="file"
                    id="vid-upload"
                    accept="video/mp4,video/mov,video/avi,video/quicktime"
                    onChange={handleVideoChange}
                    className={s.fileInput}
                  />
                  <label htmlFor="vid-upload" className={s.uploadLbl}>
                    <Video size={32} className={s.uploadIco}/>
                    <span className={s.uploadTxt}>Click to upload a property video</span>
                    <span className={s.uploadSub}>MP4, MOV, AVI — Maximum 100MB — Optional</span>
                  </label>
                </div>
              ) : (
                <div className={s.videoPreview}>
                  <video src={videoPreview} controls className={s.videoEl}/>
                  <div className={s.videoInfo}>
                    <span>{video?.name}</span>
                    <span>{(video?.size / (1024*1024)).toFixed(1)} MB</span>
                  </div>
                  <button type="button" className={s.removeVideoBtn} onClick={removeVideo}>
                    <X size={15}/> Remove Video
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 6: Declaration */}
            <div className={s.fsec}>
              <h3 className={s.fsh}><span>6</span>Declaration</h3>
              <div className={s.decl}>
                <label className="chk-label">
                  <input type="checkbox" {...register("declaration")}/>
                  <span>I declare that the information provided is true and accurate. I authorize Amon Heights Limited to market my property and understand that a commission of <strong>5% (for sale)</strong> or <strong>10% (for rent)</strong> of the agreed transaction value is payable upon successful completion.</span>
                </label>
                {errors.declaration && <span className="fe" style={{marginTop:'.4rem',display:'block'}}>{errors.declaration.message}</span>}
              </div>

              {(uploadingImages || uploadingVideo) && (
                <div className={s.uploadStatus}>
                  <div className="spinner" style={{width:24,height:24,borderWidth:2}}/>
                  <span>{uploadingImages ? 'Uploading images...' : 'Uploading video...'}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading || uploadingImages || uploadingVideo}
                style={{marginTop:'1rem',width:'100%',justifyContent:'center'}}>
                {loading ? 'Submitting...' : 'Submit Property Listing Request'}
              </button>
            </div>

          </form>
        </div>
      </div></section>
    </PublicLayout>
  )
}