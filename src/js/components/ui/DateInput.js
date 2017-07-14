import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InfiniteCalendar from 'react-infinite-calendar';
import {
    INFINITE_CALENDAR_LOCALE_ES,
    INFINITE_CALENDAR_LOCALE_EN,
    INFINITE_CALENDAR_THEME,
} from '../../constants/InfiniteCalendarConstants';
import LocaleStore from '../../stores/LocaleStore';
import connectToStores from '../../utils/connectToStores';
import Chip from './Chip';

/**
 * Retrieves state from stores for current props.
 */
function getState() {
    const locale = LocaleStore.locale;

    return {
        locale: locale
    }

}

@connectToStores([LocaleStore], getState)
export default class DateInput extends Component {

    static propTypes = {
        label       : PropTypes.string,
        placeholder : PropTypes.string.isRequired,
        defaultValue: PropTypes.string,
        onChange    : PropTypes.func,
        autoFocus   : PropTypes.bool,
        locale      : PropTypes.string
    };

    constructor(props) {

        super(props);

        this.onChange = this.onChange.bind(this);
        this.toggleSelection = this.toggleSelection.bind(this);

        this.state = {
            selected: props.autoFocus ? true : null,
            selectingYear: true,
            value: props.defaultValue
        }
    }

    onChange(value) {
        const {selectingYear} = this.state;
        const formattedValue = value.format('YYYY-MM-DD');
        if (!selectingYear) {
            this.props.onChange(formattedValue);
            this.setState({
                selected: null,
                selectingYear: true,
                value: formattedValue
            });
        } else {
            this.setState({
                selectingYear: false,
                value: formattedValue
            });
        }
    }

    toggleSelection() {
        const {selected} = this.state;
        this.setState({
            selected: !selected
        });
    }

    render() {
        const {label, locale, placeholder} = this.props;
        const {selected, selectingYear, value} = this.state;
        const localeObject = locale === 'es' ? INFINITE_CALENDAR_LOCALE_ES : INFINITE_CALENDAR_LOCALE_EN;
        const today = new Date();
        const maxDate = new Date(Number(today) - (24*60*60*1000) * 365 * 18);
        const minDate = new Date(Number(today) - (24*60*60*1000) * 365 * 110);

        return (
            !selected ?
                <div className="text-checkboxes">
                    <div className="text-checkboxes-title">{label}</div>
                    <Chip key={label.key}
                          chipClass={'chip-1'}
                          label={value ? label + ': ' + value : placeholder}
                          onClickHandler={this.toggleSelection}
                    />
                </div>
                :
                <InfiniteCalendar
                    width={"100%"}
                    height={250}
                    className={"date-input"}
                    selectedDate={value || today}
                    min={minDate}
                    max={maxDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    keyboardSupport={true}
                    locale={localeObject}
                    afterSelect={this.onChange}
                    display={selectingYear ? "years" : "days"}
                    theme={INFINITE_CALENDAR_THEME}
                    showTodayHelper={false}
                    overscanMonthCount={1}
                />
        );
    }
}