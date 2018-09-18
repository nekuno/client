import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import LocaleStore from '../stores/LocaleStore';
import ProfileStore from '../stores/ProfileStore';
import RegisterStore from '../stores/RegisterStore';
import SelectInline from '../components/ui/SelectInline/SelectInline.js';
import Chip from '../components/ui/Chip/Chip.js';
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

    return {
        interfaceLanguage,
        choices,
        profile,
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
        this.saveAndContinue = this.saveAndContinue.bind(this);

        this.state = {
            view: 'daily',
            dynamic: []
        };
    }

    componentDidMount() {
        if (!this.props.username) {
            this.context.router.push('/answer-username');
        }
        requestData(this.props);
    }

    saveAndContinue() {
        const {profile} = this.props;
        const {dynamic} = this.state;

        LoginActionCreators.preRegisterProfile({...profile, ...{availability:
            {
                dynamic: dynamic.filter(option => option.range && option.range.length > 0),
                static: []
            }
        }});
        setTimeout(this.context.router.push('/availability'), 0);
    }

    onChangeMain(mainOptions) {
        this.setState({view: mainOptions[0]});
    }

    onChangeDailyWeekday(option) {
        const {dynamic} = this.state;
        const index = dynamic.findIndex(dynamicOption => dynamicOption.weekday === option);

        if (index !== -1) {
            this.setState({dynamic: dynamic.filter(dynamicOption => dynamicOption.weekday !== option)});
        } else {
            this.setState({dynamic: [...dynamic, {weekday: option, range: []}]});
        }
    }

    onChangeDailyRange(weekday, option) {
        const {dynamic} = this.state;
        const weekdayIndex = dynamic.findIndex(dynamicOption => dynamicOption.weekday === weekday);
        const rangeIndex = dynamic[weekdayIndex].range.findIndex(rangeOption => rangeOption === option);
        let newSelectedRange = [];

        if (rangeIndex !== -1) {
            newSelectedRange = dynamic[weekdayIndex].range.filter(rangeOption => rangeOption !== option);
        } else {
            newSelectedRange = [...dynamic[weekdayIndex].range, option];
        }

        this.setState({dynamic: [...dynamic.filter(dynamicOption => dynamicOption.weekday !== weekday), {weekday: weekday, range: newSelectedRange}]});
    }

    render() {
        const {profile, strings} = this.props;
        const {view, dynamic} = this.state;
        const canContinue = dynamic && dynamic.length > 0 && dynamic.some(option => option.range.length > 0);
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
        const dailyRangeOptions = [
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
                                        <Chip text={option.text} value={option.id} selected={dynamic.some(dynamicOption => dynamicOption.weekday === option.id)} fullWidth={true} onClickHandler={this.onChangeDailyWeekday}/>
                                        {dynamic.some(dynamicOption => dynamicOption.weekday === option.id) ?
                                            <div className="range">
                                                {dailyRangeOptions.map(rangeOption =>
                                                    <div className="range-option" key={rangeOption.id}>
                                                        <Chip text={rangeOption.text} value={rangeOption.id} selected={dynamic.find(dynamicOption => dynamicOption.weekday === option.id).range.some(range => range === rangeOption.id)} fullWidth={true} onClickHandler={this.onChangeDailyRange.bind(this, option.id, rangeOption.id)}/>
                                                    </div>
                                                )}
                                            </div>
                                            : null
                                        }
                                    </div>
                                )}
                            </div>
                            :
                            <div className="dates-options">
                                Dates
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
        morning         : 'Morning',
        afternoon       : 'Afternoon',
        night           : 'Night',
        continue        : 'Save & continue'
    }
};