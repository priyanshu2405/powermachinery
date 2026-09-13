'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, Send, HelpCircle } from 'lucide-react';
import RentalCard from './RentalCard';
import styles from './RentalsList.module.css';
import { BASE_URL, getImageUrl } from '../lib/api';

export default function RentalsList({ machines }) {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Close modal when pressing ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedMachine) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedMachine]);

  const openModal = (machine) => {
    setSelectedMachine(machine);
    setActiveSlideIndex(0);
  };

  const closeModal = () => {
    setSelectedMachine(null);
  };

  const handlePrevSlide = () => {
    const images = selectedMachine.imageUrls || [];
    setActiveSlideIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    const images = selectedMachine.imageUrls || [];
    setActiveSlideIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const modalImages = selectedMachine?.imageUrls || [];

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px', marginBottom: '80px' }}>
        {machines.map((machine) => (
          <RentalCard 
            key={machine.id} 
            machine={machine} 
            onViewDetails={() => openModal(machine)} 
          />
        ))}
      </div>

      {/* Detail Modal */}
      {selectedMachine && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal} aria-label="Close details">
              <X size={20} />
            </button>

            {/* Left Column: Image Carousel */}
            <div className={styles.leftCol}>
              {modalImages.length > 0 ? (
                <div className={styles.imageSlider}>
                  <img 
                    src={getImageUrl(modalImages[activeSlideIndex])} 
                    alt={`${selectedMachine.name} - View ${activeSlideIndex + 1}`} 
                    className={styles.mainImage}
                  />
                  {modalImages.length > 1 && (
                    <>
                      <button 
                        type="button" 
                        onClick={handlePrevSlide} 
                        className={`${styles.arrowBtn} ${styles.prevBtn}`}
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        type="button" 
                        onClick={handleNextSlide} 
                        className={`${styles.arrowBtn} ${styles.nextBtn}`}
                        aria-label="Next image"
                      >
                        <ChevronRight size={24} />
                      </button>
                      <div className={styles.dotsContainer}>
                        {modalImages.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveSlideIndex(idx)}
                            className={`${styles.dot} ${activeSlideIndex === idx ? styles.activeDot : ''}`}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
                  <HelpCircle size={48} strokeWidth={1.5} />
                  <span>No Images Available</span>
                </div>
              )}
            </div>

            {/* Right Column: Text & CTA */}
            <div className={styles.rightCol}>
              <h2 className={styles.modalTitle}>{selectedMachine.name}</h2>
              <div className={styles.priceBadge}>{selectedMachine.price}</div>
              
              <h3 className={styles.specsTitle}>Specifications & Details</h3>
              <p className={styles.detailsText}>{selectedMachine.details || 'No additional technical details specified for this machine.'}</p>
              
              <div className={styles.modalAction}>
                <Link 
                  href={`/contact?machine=${encodeURIComponent(selectedMachine.name)}`} 
                  className={styles.inquireBtn}
                  onClick={closeModal}
                >
                  Rent Now <Send size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
