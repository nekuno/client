import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './IconNotification.scss';

export default class IconNotification extends Component {

    static propTypes = {
        icon           : PropTypes.string.isRequired,
        notifications  : PropTypes.number,
        onClickHandler : PropTypes.func.isRequired
    };

    handleClick() {
        this.props.onClickHandler();
    }

    render() {
        const {icon, notifications} = this.props;

        return (
            <div className={styles.iconNotification} onClick={this.handleClick.bind(this)}>
                <div className={styles.icon + ' icon icon-' + icon} />
                <div className={styles.notificationsWrapper}>
                    <div className={styles.notifications}>
                        {notifications > 99 ? 99 : notifications}
                    </div>
                </div>
            </div>
        );
    }
}