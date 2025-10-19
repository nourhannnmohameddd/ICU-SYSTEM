// src/components/Icus.jsx
import React from 'react';
import styles from './Icus.module.css';

// --- Sub-Component: ICUCard ---
const ICUCard = ({ icu, onReserve }) => {
    const isAvailable = icu.status === 'AVAILABLE';
    const statusClass = isAvailable ? styles.statusAvailable : styles.statusReserved;
    const specialClass = icu.specialization.toLowerCase().replace(/\s/g, '-');

    return (
        <div className={`${styles.card} ${styles[specialClass]}`}>
            <div className={styles.details}>
                {/* Use the hospital name and specialization for clear identification */}
                <h4 className={styles.cardTitle}>{icu.hospitalName} - {icu.specialization} ICU</h4>
                <p>Room: {icu.roomNumber} | Location: {icu.locationDescription}</p>
            </div>
            <div className={styles.actions}>
                <span className={`${styles.status} ${statusClass}`}>
                    {icu.status}
                </span>
                <button
                    className={styles.reserveBtn}
                    onClick={() => onReserve(icu.id)}
                    disabled={!isAvailable}
                >
                    {isAvailable ? 'Reserve ICU' : 'Reserved'}
                </button>
            </div>
        </div>
    );
};

// --- Main Icus List Component ---
const Icus = ({ icuList = [], onReserve, loading }) => {
    if (loading) {
        return <p className={styles.loading}>Loading available ICUs...</p>;
    }

    if (icuList.length === 0) {
        return <p className={styles.noResults}>No ICUs found matching your criteria. Try adjusting filters.</p>;
    }

    return (
        <div className={styles.icuListContainer}>
            {icuList.map(icu => (
                // Assuming each ICU object has id, hospitalName, specialization, status, locationDescription, roomNumber
                <ICUCard key={icu.id} icu={icu} onReserve={onReserve} />
            ))}
        </div>
    );
};

export default Icus;