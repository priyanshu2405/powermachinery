import { Users, HardHat, Briefcase } from 'lucide-react';
import styles from './page.module.css';
import { getTeamMembers } from '../../lib/api';

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();
  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Our Leadership & Team</h1>
        <p className={styles.pageSubtitle}>The driving force behind our robust infrastructure solutions.</p>
      </div>

      <section className={styles.section}>
        <h2 className="section-title">Management</h2>
        <div className={styles.managementGrid}>
          {teamMembers.map(member => (
            <div key={member.id} className={styles.managementCard}>
              <div className={styles.avatarPlaceholder}>
                {member.imageUrl ? (
                  <img src={`https://mbcrushings-api.onrender.com${member.imageUrl}`} alt={member.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                )}
              </div>
              <h3>{member.name}</h3>
              <p className={styles.role}>{member.role}</p>
              <p className={styles.bio}>{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.divider}></div>

      <section className={styles.section}>
        <div className={styles.teamSplitGrid}>
          <div className={styles.teamSection}>
            <div className={styles.teamHeader}>
              <HardHat size={32} className={styles.icon} />
              <h2>Technical Team</h2>
            </div>
            <p className={styles.teamDescription}>
              Our engineering backbone consists of highly experienced technical managers, site engineers, and quality control specialists. With years of hands-on experience managing 200/300 TPH plants, they ensure every aggregate produced meets the strictest industry standards.
            </p>
            <ul className={styles.teamList}>
              <li>Senior Plant Managers</li>
              <li>Mechanical Engineers</li>
              <li>Quality Assurance Specialists</li>
              <li>Heavy Machinery Technicians</li>
            </ul>
          </div>

          <div className={styles.teamSection}>
            <div className={styles.teamHeader}>
              <Briefcase size={32} className={styles.icon} />
              <h2>Admin & Operations</h2>
            </div>
            <p className={styles.teamDescription}>
              The gears that keep our business running smoothly. Our administrative and operations teams handle the logistics, human resources, and financial planning necessary to execute large-scale projects without delays.
            </p>
            <ul className={styles.teamList}>
              <li>Operations Managers</li>
              <li>Human Resources (HR)</li>
              <li>Finance & Accounting</li>
              <li>Logistics Coordinators</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
