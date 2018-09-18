import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import LocaleStore from '../stores/LocaleStore';
import ProfileStore from '../stores/ProfileStore';
import RegisterStore from '../stores/RegisterStore';
import SelectInline from '../components/ui/SelectInline/SelectInline.js';
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

        this.onChange = this.onChange.bind(this);
        this.goToAvailabilityPage = this.goToAvailabilityPage.bind(this);
    }

    componentDidMount() {
        if (!this.props.username) {
            this.context.router.push('/answer-username');
        }
        requestData(this.props);
    }

    goToAvailabilityPage() {
        this.context.router.push('/availability');
    }

    onChangeMain(mainOption) {
        // TODO: Toggle view
    }

    onChange(choices) {
        const {profile} = this.props;

        LoginActionCreators.preRegisterProfile({...profile, ...{plans: choices}});
    }

    render() {
        const {choices, profile, strings} = this.props;
        const canContinue = profile && profile.plans && profile.plans.length > 0;
        const mainOptions = [{id: 'daily', text: strings.daily}, {id: 'dates', text: strings.dates}];

        return (
            <div className="views">
                <div className="view view-main availability-edit-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.yourAvailability} textSize={'small'}/>
                    <div className="availability-edit-wrapper">
                        <h2>{strings.title}</h2>
                        <SelectInline options={mainOptions} onClickHandler={this.onChangeMain}/>
                    </div>
                </div>
                {canContinue ?
                    <StepsBar canContinue={true} continueText={strings.continue} totalSteps={0} onClickHandler={this.goToAvailabilityPage}/>
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
        continue        : 'Save & continue'
    }
};