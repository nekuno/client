import React from 'react';
import styles from './CardOverlay.scss';

function CardOverlay(props) {
    return (
        <div
            className={ props.swiping < 0 ? styles.like : styles.pass }
            style={{ opacity: Math.abs(props.swiping) * 1.5, ...(props.swiping === 0 && { display: 'none'}) }}>
                <span
                    className={`${styles.icon} icon mdi ${props.swiping < 0 ? 'mdi-check-circle' : 'mdi-close-circle'}`}>
                </span>
        </div>);
}

export default CardOverlay;