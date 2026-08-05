'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Send, HelpCircle } from 'lucide-react';
import styles from './RentalCard.module.css';
import { BASE_URL } from '../lib/api';

export default function RentalCard({ machine, onViewDetails }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = machine.imageUrls || [];

  const handlePrev = (e) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {images.length > 0 ? (
          <>
            <img 
              src={`${BASE_URL}${images[activeIndex]}`} 
              alt={`${machine.name} - Image ${activeIndex + 1}`} 
              className={styles.image} 
            />
            {images.length > 1 && (
              <>
                <button 
                  type="button" 
                  onClick={handlePrev} 
                  className={`${styles.arrowBtn} ${styles.prevBtn}`}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  type="button" 
                  onClick={handleNext} 
                  className={`${styles.arrowBtn} ${styles.nextBtn}`}
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
                <div className={styles.dotsContainer}>
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => { e.preventDefault(); setActiveIndex(idx); }}
                      className={`${styles.dot} ${activeIndex === idx ? styles.activeDot : ''}`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className={styles.placeholder}>
            <HelpCircle size={40} strokeWidth={1.5} />
            <span>No Images Available</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{machine.name}</h3>
        <p className={styles.details}>{machine.details || 'No specifications provided.'}</p>
        
        <div className={styles.footer}>
          <div className={styles.priceContainer}>
            <span className={styles.priceLabel}>Rental Charges</span>
            <span className={styles.priceValue}>{machine.price}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              onClick={onViewDetails} 
              className={styles.detailsBtn}
            >
              Details
            </button>
            <Link 
              href={`/contact?machine=${encodeURIComponent(machine.name)}`} 
              className={styles.inquireBtn}
            >
              Rent Now <Send size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
