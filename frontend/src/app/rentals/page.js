import { getRentals } from '../../lib/api';
import RentalsList from '../../components/RentalsList';
import styles from './page.module.css';
import { ShieldCheck, Truck, Clock, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Machinery for Rent | ABHIRISHI INFRA PRIVATE LIMITED',
  description: 'Rent premium industrial construction equipment, crushing plants, wheel loaders, and excavators for your infrastructure projects.',
};

export default async function RentalsPage() {
  const rentalMachines = await getRentals();

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Machinery for Rent</h1>
        <p className={styles.pageSubtitle}>
          Increase productivity on your job site with our fleet of modern, heavy-duty machinery. Flexible rental terms to suit your timeline.
        </p>
      </div>

      {rentalMachines.length > 0 ? (
        <RentalsList machines={rentalMachines} />
      ) : (
        <div className={styles.emptyState}>
          <ShieldAlert size={48} className={styles.emptyIcon} />
          <h2>No Rental Fleet Listed</h2>
          <p>We are currently updating our rental fleet. Please check back soon or contact us directly.</p>
        </div>
      )}

      {/* Rental Benefits Section */}
      <div className={styles.benefitsSection}>
        <h2 className={styles.benefitsTitle}>Why Rent From Us?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIconBox}>
              <ShieldCheck size={28} />
            </div>
            <h3>Fully Maintained Fleet</h3>
            <p>All machinery is serviced regularly by certified technicians, ensuring maximum efficiency and zero breakdowns at your site.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIconBox}>
              <Truck size={28} />
            </div>
            <h3>Quick Mobilization</h3>
            <p>We handle heavy transport logistics and deliver machinery directly to your project location with rapid deployment times.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIconBox}>
              <Clock size={28} />
            </div>
            <h3>Flexible Contracts</h3>
            <p>From short-term daily rentals to long-term monthly/yearly leases, we offer customized billing structures tailored for your project.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
