import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './CardUser.scss';
import Frame from '../../ui/Frame/Frame.js';
import RoundedIcon from '../../ui/RoundedIcon/RoundedIcon.js';
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
        gender        : PropTypes.string.isRequired,
        matching      : PropTypes.number.isRequired,
        similarity    : PropTypes.number.isRequired,
        coincidences  : PropTypes.number.isRequired,
        networks      : PropTypes.array.isRequired,
        onClickHandler: PropTypes.func
    };

    handleClick() {
        if (this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    render() {
        const {photo, nickname, age, city, gender, matching, similarity, coincidences, networks, strings} = this.props;

        return (
            <div className={styles.cardUser} onClick={this.handleClick.bind(this)}>
                <Frame>
                    <div className={styles.userImage}>
                        <RoundedImage size={'small'} url={photo}/>
                    </div>
                    <div className={styles.nickname}>{nickname}</div>
                    <div className={styles.ageCity}>{age} / {city}</div>
                    <div className={styles.gender}>{gender}</div>
                    <ProgressBar percentage={matching} title={strings.matching} size="small"/>
                    <ProgressBar percentage={similarity} title={strings.similarity} size="small"/>
                    <div className={styles.coincidences}>{coincidences} {strings.coincidences}</div>
                    <div className={styles.networks}>
                        {networks.map((network, index) => <RoundedIcon key={index} icon={network} size={'small'}/>)}
                    </div>
                </Frame>
            </div>
        );
    }
}

CardUser.defaultProps = {
    strings: {
        matching  : 'Matching',
        similarity: 'Similarity',
        coincidences: 'Coincidences',
    }
};