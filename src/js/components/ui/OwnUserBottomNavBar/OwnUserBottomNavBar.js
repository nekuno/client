import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './OwnUserBottomNavBar.scss';
import translate from "../../../i18n/Translate";

@translate('OwnUserBottomNavBar')
export default class OwnUserBottomNavBar extends Component {

    static propTypes = {
        current      : PropTypes.oneOf(['about-me', 'networks', 'friends', 'answers', 'interests']),
        notifications: PropTypes.number,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickAboutMe = this.handleClickAboutMe.bind(this);
        this.handleClickNetworks = this.handleClickNetworks.bind(this);
        this.handleClickFriends = this.handleClickFriends.bind(this);
        this.handleClickAnswers = this.handleClickAnswers.bind(this);
        this.handleClickInterests = this.handleClickInterests.bind(this);
        this.getIconClassname = this.getIconClassname.bind(this);
    }

    handleClickAboutMe() {
        this.redirectTo('about-me');
    }

    handleClickNetworks() {
        this.redirectTo('networks');
    }

    handleClickFriends() {
        this.redirectTo('friends');
    }

    handleClickAnswers() {
        this.redirectTo('answers');
    }

    handleClickInterests() {
        this.redirectTo('interests');
    }

    redirectTo(route) {
        const {current} = this.props;

        if (current !== route) {
            this.context.router.push('/' + route);
        }
    }

    getIconClassname(section) {
        return this.props.current === section ? styles.iconWrapper + ' ' + styles.current : styles.iconWrapper;
    }

    render() {
        const {notifications, strings} = this.props;

        return (
            <div className={styles.ownUserBottomNavbar}>
                <div className={this.getIconClassname('about-me')} onClick={this.handleClickAboutMe}>
                    <div className={styles.icon + ' icon icon-user'}/>
                    <div className={styles.iconText + ' small'}>{strings.aboutMe}</div>
                </div>
                <div className={this.getIconClassname('networks')} onClick={this.handleClickNetworks}>
                    <div className={styles.icon + ' icon icon-share-2'}/>
                    <div className={styles.iconText + ' small'}>{strings.networks}</div>
                </div>
                <div className={this.getIconClassname('friends')} onClick={this.handleClickFriends}>
                    <div className={styles.icon + ' icon icon-copy'}/>
                    <div className={styles.iconText + ' small'}>{strings.friends}</div>
                </div>
                <div className={this.getIconClassname('answers')} onClick={this.handleClickAnswers}>
                    <div className={styles.icon + ' icon icon-check-square'}/>
                    <div className={styles.iconText + ' small'}>{strings.answers}</div>
                </div>
                <div className={this.getIconClassname('interests')} onClick={this.handleClickInterests}>
                    <div className={styles.icon + ' icon icon-bookmark'}/>
                    {notifications ?
                        <div className={styles.notificationsWrapper}>
                            <div className={styles.notifications}>
                                {notifications > 99 ? 99 : notifications}
                            </div>
                        </div>
                        : null
                    }
                    <div className={styles.iconText + ' small'}>{strings.interests}</div>
                </div>
            </div>
        );
    }
}

OwnUserBottomNavBar.defaultProps = {
    strings: {
        aboutMe  : 'About me',
        networks : 'Networks',
        friends  : 'Friends',
        answers  : 'Answers',
        interests: 'Interests',
    }
};