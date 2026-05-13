export const formatPrice = (price) => {
  if (!price) return 'Price on Request'
  return new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',minimumFractionDigits:0}).format(price)
}
export const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-NG',{day:'numeric',month:'long',year:'numeric'}) : ''
export const formatDateShort = (d) => d ? new Date(d).toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'numeric'}) : ''
export const slugify = (text) => text?.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || ''
export const truncate = (text, len=120) => !text ? '' : text.length > len ? text.slice(0,len)+'...' : text
export const getWhatsAppLink = (phone, msg='') => `https://wa.me/${phone}${msg?'?text='+encodeURIComponent(msg):''}`
export const getMapsDirectionsUrl = (lat, lng, mode='driving') => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${mode}`
export const getMapsUrl = (lat, lng) => `https://www.google.com/maps?q=${lat},${lng}`
