import Link from 'next/link';
import styles from './Footer.module.css';
import { HardHat } from 'lucide-react';
import { getSettings } from '../lib/api';

export default async function Footer() {
  const settings = await getSettings();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.brandInfo}>
          <div className={styles.logo}>
            <HardHat size={32} className={styles.logoIcon} />
            <h2 style={{ fontSize: '1.2rem' }}>{settings.company_name}</h2>
          </div>
          <p className={styles.tagline}>Building Infrastructure with Strength.</p>
          <p className={styles.description}>
            Leading provider of industrial crushing plants and infrastructure solutions with a commitment to quality and timely delivery.
          </p>
        </div>
        
        <div className={styles.linksSection}>
          <h3>Quick Links</h3>
          <ul className={styles.linkList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/team">Team</Link></li>
            <li><Link href="/equipment">Equipment</Link></li>
            <li><Link href="/projects">Projects</Link></li>
          </ul>
        </div>
        
        <div className={styles.contactSection}>
          <h3>Contact Us</h3>
          <p>Email: {settings.email}</p>
          <p>Phone: {settings.phone}</p>
          <div className={styles.action}>
            <Link href="/contact" className="btn btn-primary">Get In Touch</Link>
          </div>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <div className="container">
          &copy; {new Date().getFullYear()} {settings.company_name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
