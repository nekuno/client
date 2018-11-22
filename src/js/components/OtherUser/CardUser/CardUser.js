import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './CardUser.scss';
import RoundedImage from '../../ui/RoundedImage/RoundedImage.js';
import ProgressBar from '../../ui/ProgressBar/ProgressBar.js';
import translate from '../../../i18n/Translate';

@translate('CardUser')
export default class CardUser extends Component {

    static propTypes = {
        photo         : PropTypes.object.isRequired,
        username      : PropTypes.string.isRequired,
        age           : PropTypes.number.isRequired,
        location      : PropTypes.object,
        matching      : PropTypes.number.isRequired,
        similarity    : PropTypes.number.isRequired,
        sharedLinks   : PropTypes.number.isRequired,
        group         : PropTypes.object,
        size          : PropTypes.oneOf(['small', 'medium']).isRequired,
        onClickHandler: PropTypes.func
    };

    handleClick() {
        if (this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    render() {
        const {photo, username, age, location, matching, similarity, sharedLinks, group, size, strings} = this.props;

        return (
            <div className={styles.cardUser + ' ' + styles[size]} onClick={this.handleClick.bind(this)}>
                <div className={styles.frame}>
                    {group && group.name ?
                        <div className={styles.group}>
                            <RoundedImage url={group.photo} size="xx-small"/>
                            <div className={styles.groupName}>{group.name}</div>
                        </div>
                        : null
                    }
                    <div className={styles.userImage}>
                        <img src={photo.thumbnail.medium}/>
                    </div>
                    <div className={styles.topData}>
                        <div className={styles.nickname}>{username}</div>
                        <div className={styles.ageCity}>{location ? location.locality || location.country || 'N/A' : 'N/A'} &bull; {age}</div>
                    </div>
                    <div className={styles.progressBars}>
                        <div className={styles.progressBarTitle}>{strings.compatible}&nbsp;</div>
                        <div className={styles.progressBar}>
                            <ProgressBar percentage={Math.round(matching*100)} size={'small'} strokeColor={'#756EE5'} background={'white'}/>
                        </div>
                        <div className={styles.progressBarTitle}>{strings.similar}&nbsp;</div>
                        <div className={styles.progressBar}>
                            <ProgressBar percentage={Math.round(similarity*100)} size={'small'} strokeColor={'#756EE5'} background={'white'}/>
                        </div>
                    </div>
                    <div className={styles.coincidences}>{sharedLinks} {strings.coincidences}</div>
                </div>
            </div>
        );
    }
}

CardUser.defaultProps = {
    strings: {
        compatible  : 'Compatible',
        similar     : 'Similar',
        coincidences: 'Coincidences',
    }
};