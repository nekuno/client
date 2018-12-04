import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './RoundOption.scss';
import OptionImageService from '../../../services/OptionImageService';

export default class RoundOption extends Component {

    static propTypes = {
        picture: PropTypes.string.isRequired,
    };

    render() {
        const {picture} = this.props;

        const thumbnail = OptionImageService.getThumbnailRound(picture);

        return (
            <div className={styles.roundOption}>
                <img src={thumbnail}/>
            </div>
        );
    }
}