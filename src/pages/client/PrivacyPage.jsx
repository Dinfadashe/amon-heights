import PublicLayout from '../../components/layout/PublicLayout'
import s from './LegalPage.module.css'
export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className={s.hdr}><div className="container"><h1 className={s.ht}>Privacy Policy</h1><p className={s.hs}>Amon Heights Limited</p></div></div>
      <section className="section"><div className="container"><div className={s.content}>
        <p className={s.eff}>Holborn House, Suite 106, Plot 649 Franca Afegbua Crescent, Zone E, Apo, Abuja, Nigeria</p>
        <div className={s.sec}><h2>1. Introduction</h2><p>Amon Heights Limited is committed to protecting your personal data and privacy. This policy explains how we collect, use and protect your information when you use our services.</p></div>
        <div className={s.sec}><h2>2. Information We Collect</h2><p>We may collect: Name, Phone number, Email address, Property preferences, Location data.</p></div>
        <div className={s.sec}><h2>3. How We Use Your Information</h2><p>Your data is used to: Provide property listings, Communicate with you, Improve our services, Send marketing updates (with consent).</p></div>
        <div className={s.sec}><h2>4. Data Sharing</h2><p>We do not sell your data. However, we may share with: Property owners, Verified agents, Service providers assisting transactions.</p></div>
        <div className={s.sec}><h2>5. Data Security</h2><p>We implement security measures to protect your data from unauthorized access.</p></div>
        <div className={s.sec}><h2>6. Your Rights</h2><p>You have the right to: Access your data, Request correction, Request deletion, Withdraw consent.</p></div>
        <div className={s.sec}><h2>7. Cookies</h2><p>Our website may use cookies to enhance user experience and track performance.</p></div>
        <div className={s.sec}><h2>8. Third-Party Links</h2><p>We are not responsible for privacy practices of external websites.</p></div>
        <div className={s.sec}><h2>9. Policy Updates</h2><p>This policy may be updated periodically. Continued use of our services constitutes acceptance of the updated policy.</p></div>
        <p className={s.agree}>By using our services, you agree to this Privacy Policy.</p>
      </div></div></section>
    </PublicLayout>
  )
}
