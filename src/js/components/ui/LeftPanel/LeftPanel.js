import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './LeftPanel.scss';

export default class LeftPanel extends Component {

    static propTypes = {
        isOpen          : PropTypes.bool,
        handleClickClose: PropTypes.func.isRequired
    };

    handleClickClose() {
        this.props.handleClickClose();
    }

    render() {
        const {isOpen, children} = this.props;

        return (
            <div className={styles.leftPanelWrapper}>
                <div className={isOpen ? styles.open + ' ' + styles.leftPanel : styles.leftPanel}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.content}>
                            {children}
                        </div>
                    </div>
                </div>
                <div className={isOpen ? styles.open + ' ' + styles.outsideWrapper : styles.outsideWrapper} onClick={this.handleClickClose.bind(this)}></div>
            </div>
        );
    }
}