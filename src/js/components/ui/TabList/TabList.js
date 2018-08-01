import React, { Component } from 'react';
import styles from './TabList.scss';
import * as ReactTabs from 'react-tabs';

export default class TabList extends Component {

    render() {
        const {children} = this.props;

        return (
            <ReactTabs.TabList className={styles.tabList}>
                {children}
            </ReactTabs.TabList>
        );
    }
}

TabList.tabsRole = 'TabList';