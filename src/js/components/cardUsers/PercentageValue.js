import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';
import Image from '../ui/Image';
import CardUserTopLinks from '../recommendations/CardUserTopLinks';
import * as UserActionCreators from '../../actions/UserActionCreators'
import translate from '../../i18n/Translate';

export default class PercentageValue extends Component {

    static propTypes = {
        percentage: PropTypes.number.isRequired,
        text      : PropTypes.string.isRequired,
    };

    render() {
        const {percentage, text} = this.props;

        return (
            <div className="matching-value">
                <div className="matching-string">{text}</div>
                <div className="matching-percentage">{percentage + '%'}</div>
            </div>
        );
    }
}