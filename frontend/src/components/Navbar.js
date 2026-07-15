import Link from 'next/link';
import { HardHat, Menu } from 'lucide-react';
import styles from './Navbar.module.css';
import { getSettings } from '../lib/api';

export default async function Navbar() {
  const settings = await getSettings();
  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIconWrapper}>
            <HardHat size={28} className={styles.logoIcon} />
          </div>
          <div className={styles.logoText}>
            <span className={styles.companyName} style={{ fontSize: '1rem' }}>{settings.company_name}</span>
          </div>
        </Link>
        
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.link}>Home</Link>
          <Link href="/team" className={styles.link}>Team</Link>
          <Link href="/equipment" className={styles.link}>Equipment</Link>
          <Link href="/projects" className={styles.link}>Projects</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
        </nav>
        
        <div className={styles.mobileMenu}>
          <Menu size={28} />
        </div>
      </div>
    </header>
  );
}
