import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../TopNavBar/TopNavBar.js';
import InfiniteCalendar, { Calendar, withRange } from 'react-infinite-calendar';
import {
    INFINITE_CALENDAR_LOCALE_ES,
    INFINITE_CALENDAR_LOCALE_EN,
    INFINITE_CALENDAR_THEME,
} from '../../../constants/InfiniteCalendarConstants';
import { format } from 'date-fns';
import Chip from '../Chip/Chip.js';
import 'react-infinite-calendar/styles.css';
import styles from './DateInputRange.scss';
import '../../../../scss/_partials/_react-infinite-calendar.scss';

@translate('DateInputRange')
export default class DateInputRange extends Component {

    static propTypes = {
        index        : PropTypes.number,
        label        : PropTypes.string,
        placeholder  : PropTypes.string.isRequired,
        defaultValue : PropTypes.object,
        onChange     : PropTypes.func,
        autoFocus    : PropTypes.bool,
        locale       : PropTypes.string,
    };

    constructor(props) {

        super(props);

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.toggleSelection = this.toggleSelection.bind(this);

        this.state = {
            selected: props.autoFocus ? true : null,
            selectingYear: true,
            value: props.defaultValue
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.selected !== this.state.selected || !nextState.value || !this.state.value || nextProps.defaultValue !== this.props.defaultValue;
    }

    componentDidMount() {
        const today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        if (this.state.selected && !this.state.value) {
            this.onChange({start: today, end: tomorrow});
        }
    }

    componentDidUpdate() {
        const today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        if (this.state.selected && !this.state.value) {
            this.onChange({start: today, end: tomorrow});
        }
    }

    onChange(value) {
        let formattedValue = null;
        if (value) {
            const startFormattedValue = format(value.start, 'YYYY-MM-DD');
            const endFormattedValue = format(value.end, 'YYYY-MM-DD');
            formattedValue = {start: startFormattedValue, end: endFormattedValue};
        }

        this.setState({
            value: formattedValue
        });
    }

    toggleSelection() {
        const {selected} = this.state;
        this.setState({
            selected: !selected
        });
    }

    onCancel() {
        const {index} = this.props;
        this.onChange(null);
        this.props.onChange(index, null)
    }

    onSave() {
        const {index} = this.props;
        const {value} = this.state;
        let formattedValue = null;
        if (value) {
            const startFormattedValue = format(value.start, 'YYYY-MM-DD');
            const endFormattedValue = format(value.end, 'YYYY-MM-DD');
            formattedValue = {start: startFormattedValue, end: endFormattedValue};
        }
        this.setState({
            value: formattedValue
        });
        this.props.onChange(index, formattedValue)
    }

    render() {
        const {label, locale, placeholder, strings} = this.props;
        const {selected, value} = this.state;
        const localeObject = locale === 'es' ? INFINITE_CALENDAR_LOCALE_ES : INFINITE_CALENDAR_LOCALE_EN;
        const chipText = value && value.start && value.end ? localeObject.from + ' ' + value.start +  ' ' + localeObject.to + ' ' + value.end : placeholder;
        const today = new Date();

        return (
            <div className={styles.dateInputRange}>
                {!selected ?
                    <div>
                        <div className="">{label}</div>
                        <Chip text={chipText}
                              onClickHandler={this.toggleSelection}
                              onCancelHandler={this.onCancel}
                              selected={!!value}
                              fullWidth={true}
                        />
                    </div>
                    :
                    <div className={styles.calendar}>
                        <TopNavBar iconLeft={'check'}
                                   firstIconRight={'x'}
                                   onLeftLinkClickHandler={() => {this.onSave(); this.toggleSelection()}}
                                   onRightLinkClickHandler={() => {this.onCancel(); this.toggleSelection()}}
                                   background={INFINITE_CALENDAR_THEME.selectionColor}
                                   textCenter={strings.topText}
                                   color={'#fff'}
                                   textSize={'small'}
                        />
                        <InfiniteCalendar
                            Component={withRange(Calendar)}
                            selected={value}
                            width={"100%"}
                            height={250}
                            className={"date-input"}
                            min={new Date(Number(today))}
                            minDate={new Date(Number(today))}
                            keyboardSupport={true}
                            locale={localeObject}
                            theme={INFINITE_CALENDAR_THEME}
                            onSelect={this.onChange}
                            displayOptions={{
                                showTodayHelper   : false,
                                overscanMonthCount: 1
                            }}
                        />
                    </div>
                }
            </div>
        );
    }
}

DateInputRange.defaultProps = {
    strings: {
        topText: 'Select a date range'
    }
};