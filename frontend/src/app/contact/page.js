import { MapPin, Phone, Mail, Send } from 'lucide-react';
import styles from './page.module.css';
import { getSettings } from '../../lib/api';

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Contact Us</h1>
        <p className={styles.pageSubtitle}>Let's discuss how we can support your next infrastructure project.</p>
      </div>

      <div className={styles.contactWrapper}>
        <div className={styles.infoSection}>
          <h2>Get In Touch</h2>
          <p className={styles.infoDesc}>
            Our team is ready to provide you with the best crushing solutions and aggregate supply for your mega projects.
          </p>
          
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <div className={styles.iconBox}>
                <MapPin />
              </div>
              <div>
                <h3>Corporate Office</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{settings.address}</p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.iconBox}>
                <Phone />
              </div>
              <div>
                <h3>Phone</h3>
                <p>{settings.phone}</p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.iconBox}>
                <Mail />
              </div>
              <div>
                <h3>Email</h3>
                <p>{settings.email}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.formSection}>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input type="text" className="input-field" placeholder="John Doe" />
            </div>
            
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" className="input-field" placeholder="john@example.com" />
            </div>
            
            <div className={styles.formGroup}>
              <label>Company / Project Name</label>
              <input type="text" className="input-field" placeholder="ABC Infrastructure" />
            </div>
            
            <div className={styles.formGroup}>
              <label>Message</label>
              <textarea className="input-field" rows="5" placeholder="Tell us about your aggregate requirements..."></textarea>
            </div>
            
            <button type="button" className="btn btn-primary" style={{ width: '100%' }}>
              Send Message <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
