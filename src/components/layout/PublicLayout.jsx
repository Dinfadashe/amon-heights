import Navbar from './Navbar'
import Footer from './Footer'
import WaFloat from '../shared/WaFloat'
export default function PublicLayout({ children }) {
  return (<><Navbar/><main>{children}</main><Footer/><WaFloat/></>)
}
