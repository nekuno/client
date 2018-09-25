import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import Chip from '../Chip/Chip.js';
import styles from './DailyInputRange.scss';

@translate('DailyInputRange')
export default class DailyInputRange extends Component {

    static propTypes = {
        id            : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        data          : PropTypes.array,
        onClickHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(option) {
        const {id, data} = this.props;
        const index = data.indexOf(option);
        let newData;

        if (index !== -1 && data.length > 1) {
            newData = data.filter(singleData => singleData !== option);
        } else if (index !== -1) {
            newData = data;
        } else {
            newData = [...data, option];
        }

        this.props.onClickHandler(id, newData);
    }

    render() {
        const {data, strings} = this.props;
        const options = [
            {
                id: 'morning',
                text: strings.morning
            },
            {
                id: 'afternoon',
                text: strings.afternoon
            },
            {
                id: 'night',
                text: strings.night
            }
        ];

        return (
            <div className={styles.dailyInputRange}>
                {options.map(rangeOption =>
                    <div className={styles.rangeOption} key={rangeOption.id}>
                        <Chip text={rangeOption.text} value={rangeOption.id} selected={data.some(singleData => singleData === rangeOption.id)} fullWidth={true} onClickHandler={this.handleClick}/>
                    </div>
                )}
            </div>
        );
    }
}

DailyInputRange.defaultProps = {
    strings: {
        morning         : 'Morning',
        afternoon       : 'Afternoon',
        night           : 'Night',
        continue        : 'Save & continue'
    }
};