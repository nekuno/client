import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './CardUser.scss';
import RoundedImage from '../../ui/RoundedImage/RoundedImage.js';
import ProgressBar from '../../ui/ProgressBar/ProgressBar.js';
import translate from '../../../i18n/Translate';

@translate('CardUser')
export default class CardUser extends Component {

    static propTypes = {
        photo         : PropTypes.string.isRequired,
        nickname      : PropTypes.string.isRequired,
        age           : PropTypes.number.isRequired,
        city          : PropTypes.string.isRequired,
        matching      : PropTypes.number.isRequired,
        similarity    : PropTypes.number.isRequired,
        coincidences  : PropTypes.number.isRequired,
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
        const {photo, nickname, age, city, matching, similarity, coincidences, group, size, strings} = this.props;

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
                        <img src={photo}/>
                    </div>
                    <div className={styles.topData}>
                        <div className={styles.nickname}>{nickname}</div>
                        <div className={styles.ageCity}>{city} &bull; {age}</div>
                    </div>
                    <div className={styles.progressBars}>
                        <div className={styles.progressBarTitle}>{strings.compatible}&nbsp;</div>
                        <div className={styles.progressBar}>
                            <ProgressBar percentage={matching} size={'small'} strokeColor={'#756EE5'}/>
                        </div>
                        <div className={styles.progressBarTitle}>{strings.similar}&nbsp;</div>
                        <div className={styles.progressBar}>
                            <ProgressBar percentage={similarity} size={'small'} strokeColor={'#756EE5'}/>
                        </div>
                    </div>
                    <div className={styles.coincidences}>{coincidences} {strings.coincidences}</div>
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