import PropTypes from 'prop-types';
import React, { Component } from 'react';
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

export default class DateInputRange extends Component {

    static propTypes = {
        label        : PropTypes.string,
        placeholder  : PropTypes.string.isRequired,
        defaultValue : PropTypes.object,
        onChange     : PropTypes.func,
        onCancel     : PropTypes.func,
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
        return nextState.selected !== this.state.selected || !nextState.value || !this.state.value;
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
        setTimeout(() => {
            this.props.onChange(formattedValue)
        }, 0);
    }

    toggleSelection() {
        const {selected} = this.state;
        this.setState({
            selected: !selected
        });
    }

    onCancel() {
        this.onChange(null);
    }

    render() {
        const {label, locale, placeholder} = this.props;
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
                }
            </div>
        );
    }
}