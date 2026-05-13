import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { MapPin, Car, PersonStanding, Navigation } from 'lucide-react'
import { getMapsDirectionsUrl } from '../../lib/utils'
import s from './PropertyMap.module.css'

const ABUJA = { lat: 9.0765, lng: 7.3986 }
const GMAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export default function PropertyMap({ lat, lng, title, address }) {
  const ref = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [err, setErr] = useState(false)
  const la = parseFloat(lat) || ABUJA.lat
  const lo = parseFloat(lng) || ABUJA.lng

  useEffect(() => {
    if (!GMAP_KEY || GMAP_KEY === 'placeholder_maps_key') { setErr(true); return }
    const loader = new Loader({ apiKey: GMAP_KEY, version: 'weekly' })
    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary('maps')
      const map = new Map(ref.current, {
        center: { lat: la, lng: lo }, zoom: 15,
        mapTypeControl: false, streetViewControl: true, fullscreenControl: true,
        styles: [
          {featureType:'water',elementType:'geometry',stylers:[{color:'#e9e9e9'}]},
          {featureType:'landscape',stylers:[{color:'#f5f5f5'}]},
          {featureType:'poi',elementType:'labels.text',stylers:[{visibility:'off'}]},
        ]
      })
      const marker = new google.maps.Marker({
        position:{lat:la,lng:lo}, map, title, animation:google.maps.Animation.DROP,
        icon:{path:google.maps.SymbolPath.CIRCLE,scale:12,fillColor:'#c8102e',fillOpacity:1,strokeColor:'#fff',strokeWeight:3}
      })
      new google.maps.InfoWindow({
        content:`<div style="padding:.5rem;font-family:sans-serif"><strong style="color:#1a2744">${title||'Property'}</strong>${address?`<br><small>${address}</small>`:''}</div>`
      }).open(map, marker)
      setLoaded(true)
    }).catch(() => setErr(true))
  }, [la, lo])

  if (err) return (
    <div className={s.fb}>
      <MapPin size={30} style={{color:'var(--gray-300)'}}/>
      <p>Map unavailable</p>
      <a href={`https://maps.google.com?q=${la},${lo}`} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">Open in Google Maps</a>
    </div>
  )

  return (
    <div className={s.wrap}>
      <div ref={ref} className={s.map}/>
      {!loaded && <div className={s.loading}><div className="spinner"/></div>}
      <div className={s.acts}>
        <a href={getMapsDirectionsUrl(la,lo,'driving')} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm"><Car size={14}/>Drive There</a>
        <a href={getMapsDirectionsUrl(la,lo,'walking')} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><PersonStanding size={14}/>Walk There</a>
        <a href={`https://maps.google.com?q=${la},${lo}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Navigation size={14}/>Open Maps</a>
      </div>
    </div>
  )
}

export function MapPicker({ lat, lng, onChange }) {
  const ref = useRef(null)
  const [err, setErr] = useState(false)
  const la = parseFloat(lat) || ABUJA.lat
  const lo = parseFloat(lng) || ABUJA.lng

  useEffect(() => {
    if (!GMAP_KEY || GMAP_KEY === 'placeholder_maps_key') { setErr(true); return }
    const loader = new Loader({ apiKey: GMAP_KEY, version: 'weekly' })
    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary('maps')
      const map = new Map(ref.current, { center:{lat:la,lng:lo}, zoom:13, mapTypeControl:false })
      const marker = new google.maps.Marker({
        position:{lat:la,lng:lo}, map, draggable:true, animation:google.maps.Animation.DROP,
        icon:{path:google.maps.SymbolPath.CIRCLE,scale:12,fillColor:'#c8102e',fillOpacity:1,strokeColor:'#fff',strokeWeight:3}
      })
      marker.addListener('dragend',()=>{ const p=marker.getPosition(); onChange({lat:p.lat(),lng:p.lng()}) })
      map.addListener('click', e => { marker.setPosition(e.latLng); onChange({lat:e.latLng.lat(),lng:e.latLng.lng()}) })
    }).catch(() => setErr(true))
  }, [])

  if (err) return (
    <div className={s.fb} style={{height:240}}>
      <MapPin size={22}/>
      <p style={{fontSize:'.82rem'}}>Map picker unavailable – enter coordinates below manually</p>
    </div>
  )
  return (
    <div>
      <div ref={ref} className={s.picker}/>
      <p className={s.hint}><MapPin size={12}/>Click on the map or drag the pin to set the property location</p>
    </div>
  )
}
