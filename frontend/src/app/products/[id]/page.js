'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <Link href="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Products</Link>
      </div>
    );
  }

  return (
    <div className={`container ${styles.container}`}>
      <Link href="/products" className={styles.backLink}>
        <ArrowLeft size={20} /> Back to Catalog
      </Link>
      
      <div className={`${styles.productWrapper} glass`}>
        <div className={styles.imageSection}>
          {product.imageUrl ? (
            <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>No Image Available</div>
          )}
        </div>
        
        <div className={styles.infoSection}>
          <div className={styles.badge}>Industrial Grade</div>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.price}>
            ${product.price ? product.price.toLocaleString() : 'Contact for Price'}
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.section}>
            <h3>Description</h3>
            <p className={styles.description}>{product.description}</p>
          </div>
          
          {product.specifications && (
            <div className={styles.section}>
              <h3>Technical Specifications</h3>
              <ul className={styles.specsList}>
                {product.specifications.split('\n').map((spec, index) => (
                  <li key={index}>
                    <CheckCircle size={18} className={styles.checkIcon} />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className={styles.actions}>
            <button className="btn btn-primary" style={{ width: '100%' }}>Request a Quote</button>
          </div>
        </div>
      </div>
    </div>
  );
}
