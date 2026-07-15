'use client';
import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import styles from './page.module.css';
import { Loader2 } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Products</h1>
        <p className={styles.subtitle}>Browse our complete catalog of industrial machines.</p>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
        </div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.grid}>
          {products.length === 0 ? (
            <p className={styles.empty}>No products available at the moment.</p>
          ) : (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
