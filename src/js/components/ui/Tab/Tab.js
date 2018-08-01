import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Tab.scss';
import * as ReactTabs from 'react-tabs';

export default class Tab extends Component {

    static propTypes = {
        columns : PropTypes.number.isRequired,
        selected: PropTypes.bool
    };

    render() {
        const {columns, selected, children} = this.props;
        const widthPercentage = 100 / columns;
        const className = selected ? styles.selected + ' ' + styles.tab : styles.tab;

        return (
            <ReactTabs.Tab className={className} style={{width: widthPercentage + '%'}}>
                {children}
            </ReactTabs.Tab>
        );
    }
}

Tab.tabsRole = 'Tab';