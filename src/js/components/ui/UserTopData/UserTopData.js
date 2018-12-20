import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './UserTopData.scss';

export default class UserTopData extends Component {

    static propTypes = {
        username     : PropTypes.string.isRequired,
        usernameColor: PropTypes.string,
        location     : PropTypes.object,
        age          : PropTypes.string.isRequired,
        subColor     : PropTypes.string
    };

    render() {
        const {username, location, age, usernameColor, subColor} = this.props;

        return (
            <div className={styles.userTopData}>
                <div className={styles.username} style={{color: usernameColor}}>{username}</div>
                <div className={styles.ageCity} style={{color: subColor}}>{location ? location.locality || location.country || 'N/A' : 'N/A'} &bull; {age}</div>
            </div>
        );
    }
}

UserTopData.defaultProps = {
    usernameColor: 'white',
    subColor     : 'white'
};