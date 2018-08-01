import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './TabPanel.scss';
import * as ReactTabs from 'react-tabs';

export default class TabPanel extends Component {

    static propTypes = {
        selected: PropTypes.bool,
    };

    render() {
        const {selected, children} = this.props;

        return (
            <ReactTabs.TabPanel className={styles.tabPanel} selected={selected}>
                {children}
            </ReactTabs.TabPanel>
        );
    }
}

TabPanel.tabsRole = 'TabPanel';