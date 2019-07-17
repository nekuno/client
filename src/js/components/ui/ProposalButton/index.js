import React from 'react';
import styles from './ProposalButton.scss'

function ProposalButton(props) {
    return (
        <div className={styles.root} onClick={props.click}>
            <span className={`icon mdi mdi-${props.icon} ${props.iconClass ? props.iconClass : ''}`}></span>
        </div>
    );
}

export default ProposalButton;