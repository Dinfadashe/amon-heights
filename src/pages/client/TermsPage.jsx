import PublicLayout from '../../components/layout/PublicLayout'
import s from './LegalPage.module.css'
export default function TermsPage() {
  return (
    <PublicLayout>
      <div className={s.hdr}><div className="container"><h1 className={s.ht}>Terms & Conditions</h1><p className={s.hs}>Amon Heights Limited</p></div></div>
      <section className="section"><div className="container"><div className={s.content}>
        <p className={s.eff}>Holborn House, Suite 106, Plot 649 Franca Afegbua Crescent, Zone E, Apo, Abuja, Nigeria</p>
        <div className={s.sec}><h2>1. Introduction</h2><p>These Terms and Conditions govern the use of services provided by Amon Heights Limited ("the Company"). By engaging with our services, you agree to comply with these terms.</p></div>
        <div className={s.sec}><h2>2. Services</h2><p>Amon Heights Limited provides: Property sales, Property rentals, Shortlet services, Property marketing and listing, Real estate advisory.</p></div>
        <div className={s.sec}><h2>3. User Responsibilities</h2><p>Clients agree to: Provide accurate information, Act in good faith during transactions, Not bypass the Company in any transaction introduced by the Company.</p></div>
        <div className={s.sec}><h2>4. Commission</h2><p>5% commission on property purchases. 10% commission on rentals. Commission is payable upon successful transaction.</p></div>
        <div className={s.sec}><h2>5. Property Information</h2><p>All property details are provided in good faith. The Company does not guarantee accuracy from third-party sources. Clients are advised to verify all property details.</p></div>
        <div className={s.sec}><h2>6. Non-Circumvention</h2><p>Clients shall not bypass Amon Heights Limited to deal directly with property owners or agents introduced by the Company.</p></div>
        <div className={s.sec}><h2>7. Limitation of Liability</h2><p>The Company shall not be liable for: Loss arising from property defects, Disputes between buyers and sellers, Any indirect damages.</p></div>
        <div className={s.sec}><h2>8. Termination</h2><p>The Company reserves the right to terminate services if clients violate terms or fraudulent activities are suspected.</p></div>
        <div className={s.sec}><h2>9. Governing Law</h2><p>These terms shall be governed by the laws of the Federal Republic of Nigeria.</p></div>
      </div></div></section>
    </PublicLayout>
  )
}
