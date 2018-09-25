import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../utils/connectToStores';
import { format } from 'date-fns';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import LocaleStore from '../stores/LocaleStore';
import ProfileStore from '../stores/ProfileStore';
import RegisterStore from '../stores/RegisterStore';
import SelectInline from '../components/ui/SelectInline/SelectInline.js';
import Chip from '../components/ui/Chip/Chip.js';
import DateInputRange from '../components/ui/DateInputRange/DateInputRange.js';
import DailyInputRange from '../components/ui/DailyInputRange/DailyInputRange.js';
import StepsBar from '../components/ui/StepsBar/StepsBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import * as UserActionCreators from '../actions/UserActionCreators';
import '../../scss/pages/availability-edit.scss';

function requestData(props) {
    if (!props.metadata) {
        UserActionCreators.requestMetadata();
    }
}

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const metadata = ProfileStore.getMetadata();
    // TODO: Replace with plans
    const choices = metadata && metadata.industry ? metadata.industry.choices : [];
    const user = RegisterStore.user;
    const username = user && user.username ? user.username : null;
    const profile = RegisterStore.profile;
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const availability = profile && profile.availability ? profile.availability : {dynamic: [], static: []};

    return {
        interfaceLanguage,
        choices,
        profile,
        availability,
        username
    };
}

@translate('AvailabilityEditPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore], getState)
export default class AvailabilityEditPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        choices          : PropTypes.array,
        profile          : PropTypes.object,
        availability     : PropTypes.object,
        username         : PropTypes.string,
        interfaceLanguage: PropTypes.string
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onChangeMain = this.onChangeMain.bind(this);
        this.onChangeDailyWeekday = this.onChangeDailyWeekday.bind(this);
        this.onChangeDynamicDailyRange = this.onChangeDynamicDailyRange.bind(this);
        this.onChangeStaticDailyRange = this.onChangeStaticDailyRange.bind(this);
        this.onChangeRange = this.onChangeRange.bind(this);
        this.saveAndContinue = this.saveAndContinue.bind(this);

        this.state = {
            view: 'daily',
            calendarView: false
        };
    }

    componentDidMount() {
        if (!this.props.username) {
            this.context.router.push('/answer-username');
        }
        requestData(this.props);
    }

    saveAndContinue() {
        this.context.router.push('/availability');
    }

    onChangeMain(mainOptions) {
        this.setState({view: mainOptions[0]});
    }

    onChangeDailyWeekday(option) {
        const {profile, availability} = this.props;

        if (!availability.dynamic) {
            availability.dynamic = [];
        }
        const index = availability.dynamic.findIndex(dynamicOption => dynamicOption.weekday === option);
        let newSelection = null;

        if (index !== -1) {
            newSelection = availability.dynamic.filter(dynamicOption => dynamicOption.weekday !== option);
        } else {
            newSelection = [...availability.dynamic, {weekday: option, range: ["morning", "afternoon", "night"]}];
        }

        LoginActionCreators.preRegisterProfile({...profile, ...{availability:
            {
                dynamic: newSelection,
                static: availability.static
            }
        }});
    }

    onChangeDynamicDailyRange(weekday, options) {
        const {profile, availability} = this.props;

        const weekdayIndex = availability.dynamic.findIndex(dynamicOption => dynamicOption.weekday === weekday);
        let newSelection = availability.dynamic.slice(0);
        newSelection[weekdayIndex].range = options;

        LoginActionCreators.preRegisterProfile({...profile, ...{availability:
            {
                dynamic: newSelection,
                static: availability.static
            }
        }});
    }

    onChangeStaticDailyRange(index, options) {
        const {profile, availability} = this.props;

        let newSelection = availability.static.slice(0);
        newSelection[index].range = options;

        LoginActionCreators.preRegisterProfile({...profile, ...{availability:
            {
                dynamic: availability.dynamic,
                static: newSelection
            }
        }});
    }

    onChangeRange(index, values) {
        const {profile, availability} = this.props;

        let newSelection = availability.static.slice(0);
        if (!newSelection[index]) {
            newSelection[index] = {days: {}, range: ["morning", "afternoon", "night"]};
        }
        if (values) {
            newSelection[index].days = values;
        } else {
            newSelection.splice(index, 1);
        }

        LoginActionCreators.preRegisterProfile({...profile, ...{availability:
            {
                dynamic: availability.dynamic,
                static: newSelection
            }
        }});
    }

    render() {
        const {availability, interfaceLanguage, strings} = this.props;
        const {view} = this.state;
        const canContinue = availability.dynamic && availability.dynamic.length > 0 || availability.static && availability.static.length > 0;
        const mainOptions = [{id: 'daily', text: strings.daily}, {id: 'dates', text: strings.dates}];
        const dailyWeekdayOptions = [
            {
                id: 'monday',
                text: strings.monday
            },
            {
                id: 'tuesday',
                text: strings.tuesday
            },
            {
                id: 'wednesday',
                text: strings.wednesday
            },
            {
                id: 'thursday',
                text: strings.thursday
            },
            {
                id: 'friday',
                text: strings.friday
            },
            {
                id: 'saturday',
                text: strings.saturday
            },
            {
                id: 'sunday',
                text: strings.sunday
            }
        ];

        return (
            <div className="views">
                <div className="view view-main availability-edit-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.yourAvailability} textSize={'small'}/>
                    <div className="availability-edit-wrapper">
                        <h2>{strings.title}</h2>
                        <SelectInline options={mainOptions} defaultOption={'daily'} onClickHandler={this.onChangeMain}/>
                        <br/>
                        {view === 'daily' ?
                            <div className="daily-options">
                                {dailyWeekdayOptions.map(option =>
                                    <div className="weekday" key={option.id}>
                                        <Chip text={option.text} value={option.id} selected={availability.dynamic.some(dynamicOption => dynamicOption.weekday === option.id)} fullWidth={true} onClickHandler={this.onChangeDailyWeekday}/>
                                        {availability.dynamic.some(dynamicOption => dynamicOption.weekday === option.id) ?
                                            <DailyInputRange id={option.id} data={availability.dynamic.find(dynamicOption => dynamicOption.weekday === option.id && dynamicOption.range.length > 0).range} onClickHandler={this.onChangeDynamicDailyRange}/>
                                            : null
                                        }
                                    </div>
                                )}
                            </div>
                            :
                            <div className="dates-options">
                                {availability.static.map((staticOption, index) =>
                                    <div className="dates-option" key={index}>
                                        <DateInputRange index={index} placeholder={strings.addRange} defaultValue={staticOption.days} locale={interfaceLanguage} onChange={this.onChangeRange}/>
                                        <DailyInputRange id={index} data={staticOption.range} onClickHandler={this.onChangeStaticDailyRange}/>
                                    </div>
                                )}
                                <div className="dates-option" key={availability.static.length}>
                                    <DateInputRange index={availability.static.length} placeholder={strings.addRange} locale={interfaceLanguage} onChange={this.onChangeRange}/>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {canContinue ?
                    <StepsBar canContinue={true} continueText={strings.continue} totalSteps={0} onClickHandler={this.saveAndContinue}/>
                    : null
                }
            </div>
        );
    }
}

AvailabilityEditPage.defaultProps = {
    strings: {
        yourAvailability: 'Your Availability',
        title           : 'What is your availability?',
        daily           : 'Daily',
        dates           : 'Dates',
        addRange        : 'Add days range',
        monday          : 'Monday',
        tuesday         : 'Tuesday',
        wednesday       : 'Wednesday',
        thursday        : 'Thursday',
        friday          : 'Friday',
        saturday        : 'Saturday',
        sunday          : 'Sunday',
        continue        : 'Save & continue'
    }
};