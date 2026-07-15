import styles from './page.module.css';
import { getEquipments } from '../../lib/api';

export default async function EquipmentPage() {
  const equipments = await getEquipments();

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Our Equipment</h1>
        <p className={styles.pageSubtitle}>A modern, high-capacity fleet ready for any challenge.</p>
      </div>

      <div className={styles.gallery}>
        {equipments.map((item) => (
          <div key={item.id} className={styles.equipmentCard}>
            <div className={styles.imagePlaceholder} style={item.imageUrl ? { backgroundColor: 'transparent' } : {}}>
              {item.imageUrl ? (
                <img src={`https://mbcrushings-api.onrender.com${item.imageUrl}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>{item.name} Image</span>
              )}
            </div>
            <div className={styles.cardContent}>
              <span className={styles.category}>{item.category}</span>
              <h3>{item.name}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.statsSection}>
        <div className={styles.statItem}>
          <h2>200+</h2>
          <p>TPH Capacity</p>
        </div>
        <div className={styles.statItem}>
          <h2>24/7</h2>
          <p>Operational Readiness</p>
        </div>
        <div className={styles.statItem}>
          <h2>100%</h2>
          <p>Maintenance Compliance</p>
        </div>
      </div>
    </div>
  );
}
