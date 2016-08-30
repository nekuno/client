import React, { PropTypes, Component } from 'react';
import InfiniteCalendar from 'react-infinite-calendar';
import {
    INFINITE_CALENDAR_LOCALE_ES,
    INFINITE_CALENDAR_LOCALE_EN,
    INFINITE_CALENDAR_THEME,
} from '../../constants/InfiniteCalendarConstants';
import LocaleStore from '../../stores/LocaleStore';
import connectToStores from '../../utils/connectToStores';

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
        const formatedValue = value.format('YYYY-MM-DD');
        if (!selectingYear) {
            this.props.onChange(formatedValue);
            this.setState({
                selected: null,
                selectingYear: true,
                value: formatedValue
            });
        } else {
            this.setState({
                selectingYear: false,
                value: formatedValue
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

        return (
            !selected ?
                <div className="list-block">
                    <ul>
                        <li className="date-item">
                            <div className="item-content date-content">
                                {label ?
                                    <div className="item-title label date-label">{label}</div>
                                        :
                                    null}

                                <input id="calendar-input" type="text" placeholder={placeholder} defaultValue={value} onClick={this.toggleSelection}/>
                            </div>
                        </li>
                    </ul>
                </div>
                :
                <InfiniteCalendar
                    width={"100%"}
                    height={250}
                    className={"date-input"}
                    selectedDate={value || today}
                    keyboardSupport={true}
                    locale={localeObject}
                    afterSelect={this.onChange}
                    display={selectingYear ? "years" : "days"}
                    theme={INFINITE_CALENDAR_THEME}
                    showTodayHelper={false}
                />
        );
    }
}