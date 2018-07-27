import React, { Component } from 'react';
import styles from './TopBar.scss';

export default class TopBar extends Component {

    render() {
        const {children} = this.props;

        return (
            <div className={styles.topBar}>
                {children}
            </div>
        );
    }
}