import { MessageCircle } from 'lucide-react'
import { CONTACTS } from '../../lib/constants'
import { getWhatsAppLink } from '../../lib/utils'
import s from './WaFloat.module.css'
export default function WaFloat() {
  return (
    <a href={getWhatsAppLink(CONTACTS.whatsapp1,'Hello! I am interested in a property at Amon Heights.')}
      target="_blank" rel="noreferrer" className={s.float} aria-label="Chat on WhatsApp">
      <MessageCircle size={26}/>
      <span className={s.tip}>Chat with us!</span>
    </a>
  )
}
