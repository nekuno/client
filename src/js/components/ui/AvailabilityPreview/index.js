import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './AvailabilityPreview.scss';
import translate from '../../../i18n/Translate';
import ProposalIcon from "../ProposalIcon";

@translate('AvailabilityPreview')
export default class AvailabilityPreview extends Component {

    static propTypes = {
        availability: PropTypes.object.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
    };

    render() {
        const {availability, strings} = this.props;

        const dailyWeekdayOptions = {
            Monday   : strings.monday,
            Tuesday  : strings.tuesday,
            Wednesday: strings.wednesday,
            Thursday : strings.thursday,
            Friday   : strings.friday,
            Saturday : strings.saturday,
            Sunday   : strings.sunday
        };

        const stringRanges = {
            Morning  : strings.morning,
            Afternoon: strings.afternoon,
            Night    : strings.night,
        };

        return (
            <div>
                <div className={'rounded-icon-wrapper'}>
                    <ProposalIcon size={'medium-small'} icon={'availability'} background={'white'}/>
                </div>
                <div className={styles.textWrapper}>
                    <div className={styles.title + ' ' + styles.small}>{strings.availability}</div>
                    {availability ? (
                        <div className={styles.resume + ' ' + styles.small}>
                            {availability.dynamic.map((day, index) =>
                                <div key={index}>
                                    {dailyWeekdayOptions[day.weekday]}
                                    ,
                                    {day.range.map((range, rangeIndex) =>
                                        <span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>
                                    )}
                                </div>
                            )}

                            {availability.static.map((day, index) =>
                                <div key={index}>
                                    {strings.from} {day.days.start} {strings.to} {day.days.end}
                                    ,
                                    {day.range.map((range, rangeIndex) =>
                                        <span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.resume + ' ' + styles.small}>{strings.availabilityDescription}</div>
                    )}
                </div>
            </div>
        );
    }
}

AvailabilityPreview.defaultProps = {
    strings: {
        monday   : 'Monday',
        tuesday  : 'Tuesday',
        wednesday: 'Wednesday',
        thursday : 'Thursday',
        friday   : 'Friday',
        saturday : 'Saturday',
        sunday   : 'Sunday',
        and      : 'and',
        morning  : 'morning',
        afternoon: 'afternoon',
        night    : 'night',
        from     : 'From',
        to       : 'to',
    }
};