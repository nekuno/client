import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './IconCollapsible.scss';

export default class IconCollapsible extends Component {

    static propTypes = {
        open: PropTypes.bool
    };

    render() {
        const {open} = this.props;

        return <div className={styles.arrow}>
            {open ?
                <div className={styles.arrow + ' icon icon-chevron-up'}/>
                :
                <div className={styles.arrow + ' icon icon-chevron-down'}/>
            }
        </div>
    }
}

IconCollapsible.defaultProps = {
    open: false,
}