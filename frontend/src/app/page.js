import Link from 'next/link';
import { ArrowRight, Target, ShieldCheck, Clock, Award } from 'lucide-react';
import styles from './page.module.css';
import { getSettings } from '../lib/api';

export default async function Home() {
  const settings = await getSettings();
  return (
    <div className={styles.home}>
      {/* Section 1: Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent} animate-fade-up`}>
          <div className={styles.badge}>{settings.company_name}</div>
          <h1 className={styles.title}>
            Building Infrastructure with <span className={styles.highlight}>Strength.</span>
          </h1>
          <p className={styles.subtitle}>
            Premium industrial crushing plants and infrastructure solutions powered by unmatched quality and ethical business practices.
          </p>
          <div className={styles.heroActions}>
            <Link href="/projects" className="btn btn-primary">
              View Our Projects <ArrowRight size={20} />
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: About Us */}
      <section className="section bg-slate">
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
              <h2 className="section-title" style={{ alignItems: 'flex-start', textAlign: 'left' }}>About Us</h2>
              <p className={styles.leadText}>
                We are industry leaders in providing robust infrastructure support through our state-of-the-art crushing plants.
              </p>
              <p className={styles.text}>
                At {settings.company_name}, we believe in laying the strongest foundations. We specialize in the operation and management of advanced <strong>200/300 TPH crushing plants</strong>, delivering high-quality aggregates for mega infrastructure projects across the nation.
              </p>
              <p className={styles.text}>
                Our operations are deeply rooted in ethical practices, ensuring transparency, environmental consciousness, and unwavering reliability for our partners.
              </p>
            </div>
            <div className={styles.aboutImageWrapper}>
              <div className={styles.imagePlaceholder}>
                [ Industrial Crushing Plant Image Here ]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Why Us */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.iconWrapper}><Clock size={32} /></div>
              <h3>Timely Delivery</h3>
              <p>We understand the critical timelines of infrastructure projects. Our streamlined operations guarantee on-time material supply.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.iconWrapper}><Award size={32} /></div>
              <h3>Quality Output</h3>
              <p>Our 200/300 TPH plants produce premium-grade aggregates that meet the strictest industry standards.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.iconWrapper}><ShieldCheck size={32} /></div>
              <h3>Rapid Response</h3>
              <p>Our dedicated support team and mobile units ensure minimal downtime and rapid resolution of any site requirements.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.iconWrapper}><Target size={32} /></div>
              <h3>Unique Working Style</h3>
              <p>We integrate deeply with our clients' workflows, acting as a true partner rather than just a vendor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Mission & Vision */}
      <section className={`section bg-dark`}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <h3>Our Mission</h3>
              <p>To deliver unparalleled customer support and high-quality aggregates that build the future of infrastructure. We strive to maintain ethical business practices while continuously innovating our crushing processes.</p>
            </div>
            <div className={styles.missionCard}>
              <h3>Our Vision</h3>
              <p>To be the most trusted and innovative partner in the infrastructure sector, recognized for our strength, reliability, and commitment to sustainable growth.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
