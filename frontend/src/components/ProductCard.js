import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { ArrowRight } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <div className={`${styles.card} glass`}>
      <div className={styles.imageContainer}>
        {product.imageUrl ? (
          <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>No Image</div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>
            ${product.price ? product.price.toLocaleString() : 'N/A'}
          </span>
          <Link href={`/products/${product.id}`} className={styles.link}>
            Details <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
