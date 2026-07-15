import { CheckCircle2, Building2 } from 'lucide-react';
import styles from './page.module.css';
import { getCaseStudies, getPartners } from '../../lib/api';

export default async function ProjectsPage() {
  const caseStudies = await getCaseStudies();
  const partners = await getPartners();

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Projects & Experience</h1>
        <p className={styles.pageSubtitle}>Building the nation with our trusted partners.</p>
      </div>

      <section className={styles.section}>
        <h2 className="section-title">Case Studies</h2>
        <div className={styles.projectsGrid}>
          {caseStudies.map((study) => (
            <div key={study.id} className={styles.projectCard}>
              <div className={styles.imagePlaceholder} style={study.imageUrl ? { backgroundColor: 'transparent' } : {}}>
                {study.imageUrl ? (
                  <img src={`https://mbcrushings-api.onrender.com${study.imageUrl}`} alt={study.client} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>Project Site Image</span>
                )}
              </div>
              <div className={styles.cardContent}>
                <span className={styles.tag}>{study.type}</span>
                <h3>{study.client}</h3>
                <p>{study.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.divider}></div>

      <section className={styles.section}>
        <div className={styles.experienceWrapper}>
          <div className={styles.expHeader}>
            <Building2 size={48} className={styles.icon} />
            <h2>Our Extended Work Experience</h2>
            <p>We are proud to have collaborated with some of the most prestigious names in the infrastructure sector.</p>
          </div>
          
          <div className={styles.partnerList}>
            {partners.map((partner) => (
              <div key={partner.id} className={styles.partnerItem}>
                <CheckCircle2 className={styles.checkIcon} />
                <span>{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
