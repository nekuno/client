import React, { Component } from 'react';
import styles from './Overlay.scss';

export default class Overlay extends Component {

    render() {
        return (
            <div className={styles.overlay}/>
        );
    }
}