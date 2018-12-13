import React, { Component } from 'react';
import styles from './LoadingGif.scss';

export default class LoadingGif extends Component {
    render() {
        return (
            <img className={styles.loadinggif} src='/img/safari-pinned-tab.svg' alt='loading'/>
        );
    }
}