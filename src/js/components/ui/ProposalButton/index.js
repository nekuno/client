import React from 'react';
import styles from './ProposalButton.scss'

function ProposalButton(props) {
    const { onClick, icon, iconClass } = props;
    return (
        <div className={styles.root} onClick={onClick}>
            <span className={`icon mdi mdi-${icon} ${iconClass || ''}`}></span>
        </div>
    );
}

export default ProposalButton;