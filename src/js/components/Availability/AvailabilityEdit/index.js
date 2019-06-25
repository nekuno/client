import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import SelectInline from '../../ui/SelectInline/';
import Chip from '../../ui/Chip/';
import DateInputRange from '../../ui/DateInputRange/';
import DailyInputRange from '../../ui/DailyInputRange/';
import styles from './AvailabilityEdit.scss';

@translate('AvailabilityEdit')
export default class AvailabilityEdit extends Component {

    static propTypes = {
        availability     : PropTypes.object,
        interfaceLanguage: PropTypes.string,
        onSave           : PropTypes.func.isRequired,
        onClick          : PropTypes.func,
        title            : PropTypes.string,
        color            : PropTypes.string,
        theme            : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onDateInputRangeClick = this.onDateInputRangeClick.bind(this);
        this.onChangeMain = this.onChangeMain.bind(this);
        this.onChangeDailyWeekday = this.onChangeDailyWeekday.bind(this);
        this.onChangeDynamicDailyRange = this.onChangeDynamicDailyRange.bind(this);
        this.onChangeStaticDailyRange = this.onChangeStaticDailyRange.bind(this);
        this.onChangeRange = this.onChangeRange.bind(this);
        this.getAvailability = this.getAvailability.bind(this);

        this.state = {
            view: 'daily',
            showUI: true,
        };
    }

    onChangeMain(mainOptions) {
        this.setState({view: mainOptions[0]});
    }

    onChangeDailyWeekday(option) {
        const availability = this.getAvailability();

        if (!availability.dynamic) {
            availability.dynamic = [];
        }
        const index = availability.dynamic.findIndex(dynamicOption => dynamicOption.weekday === option);
        let newSelection = null;

        if (index !== -1) {
            newSelection = availability.dynamic.filter(dynamicOption => dynamicOption.weekday !== option);
        } else {
            newSelection = [...availability.dynamic, {weekday: option, range: ["Morning", "Afternoon", "Night"]}];
        }

        this.props.onSave({
            dynamic: newSelection,
            static : availability.static
        });
    }

    onChangeDynamicDailyRange(weekday, options) {
        const availability = this.getAvailability();

        const weekdayIndex = availability.dynamic.findIndex(dynamicOption => dynamicOption.weekday === weekday);
        let newSelection = availability.dynamic.slice(0);
        newSelection[weekdayIndex].range = options;

        this.props.onSave({
            dynamic: newSelection,
            static : availability.static
        });
    }

    onChangeStaticDailyRange(index, options) {
        const availability = this.getAvailability();

        let newSelection = availability.static.slice(0);
        newSelection[index].range = options;

        this.props.onSave({
            dynamic: availability.dynamic,
            static : newSelection
        });
    }

    onChangeRange(index, values) {
        const availability = this.getAvailability();




        let newSelection = availability.static.slice(0);
        if (!newSelection[index]) {
            newSelection[index] = {days: {}, range: ["Morning", "Afternoon", "Night"]};
        }
        if (values) {
            newSelection[index].days = values;
        } else {
            newSelection.splice(index, 1);
        }

        this.props.onSave({
            dynamic: availability.dynamic,
            static : newSelection
        });
    }

    onDateInputRangeClick() {
        this.setState({showUI: !this.state.showUI});
        this.props.onClick(!this.state.showUI);
    }

    getAvailability() {
        const {availability} = this.props;

        return availability ? availability : {dynamic: [], static: []};
    };

    render() {
        const {interfaceLanguage, strings, title, color, theme} = this.props;
        const {view} = this.state;
        const availability = this.getAvailability();
        const mainOptions = [{id: 'daily', text: strings.daily}, {id: 'dates', text: strings.dates}];
        const dailyWeekdayOptions = [
            {
                id  : 'Monday',
                text: strings.monday
            },
            {
                id  : 'Tuesday',
                text: strings.tuesday
            },
            {
                id  : 'Wednesday',
                text: strings.wednesday
            },
            {
                id  : 'Thursday',
                text: strings.thursday
            },
            {
                id  : 'Friday',
                text: strings.friday
            },
            {
                id  : 'Saturday',
                text: strings.saturday
            },
            {
                id  : 'Sunday',
                text: strings.sunday
            }
        ];

        return (
            <div className={styles.availabilityEdit}>
                {this.state.showUI &&
                    <div>
                        {title === undefined ?
                            <h2>{strings.title}</h2>
                            :
                            <h2>{title}</h2>
                        }
                    </div>
                }
                {this.state.showUI &&
                    <SelectInline color={color} options={mainOptions} defaultOption={view} onClickHandler={this.onChangeMain}/>
                }

                {view === 'daily' ?
                    <div className={styles.dailyOptions}>
                        {dailyWeekdayOptions.map(option =>
                            <div className={styles.weekend} key={option.id}>
                                <Chip color={color} text={option.text} value={option.id} selected={availability.dynamic.some(dynamicOption => dynamicOption.weekday === option.id)} fullWidth={true} onClickHandler={this.onChangeDailyWeekday}/>
                                {availability.dynamic.some(dynamicOption => dynamicOption.weekday === option.id) ?
                                    <DailyInputRange color={color} id={option.id} data={availability.dynamic.find(dynamicOption => dynamicOption.weekday === option.id && dynamicOption.range.length > 0).range} onClickHandler={this.onChangeDynamicDailyRange}/>
                                    : null
                                }
                            </div>
                        )}
                    </div>
                    :
                    <div>
                        {this.state.showUI &&
                            <div className={styles.datesOptions}>
                                {availability.static.map((staticOption, index) =>
                                    <div className={styles.datesOption} key={index}>
                                        <DateInputRange theme={theme} color={color} index={index}
                                                        placeholder={strings.addRange} defaultValue={staticOption.days}
                                                        locale={interfaceLanguage} onChange={this.onChangeRange}/>
                                        <DailyInputRange color={color} id={index} data={staticOption.range}
                                                         onClickHandler={this.onChangeStaticDailyRange}/>
                                    </div>
                                )}
                            </div>
                        }
                        <div className={styles.datesOption} key={availability.static.length}>
                            <DateInputRange theme={theme} color={color} index={availability.static.length} placeholder={strings.addRange} locale={interfaceLanguage} onClick={this.onDateInputRangeClick} onChange={this.onChangeRange}/>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

AvailabilityEdit.defaultProps = {
    strings: {
        title    : 'What is your availability?',
        daily    : 'Daily',
        dates    : 'Dates',
        addRange : 'Add days range',
        monday   : 'Monday',
        tuesday  : 'Tuesday',
        wednesday: 'Wednesday',
        thursday : 'Thursday',
        friday   : 'Friday',
        saturday : 'Saturday',
        sunday   : 'Sunday',
    },
    onClick: () => {},
};