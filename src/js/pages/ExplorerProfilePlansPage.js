import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import LocaleStore from '../stores/LocaleStore';
import ProfileStore from '../stores/ProfileStore';
import RegisterStore from '../stores/RegisterStore';
import InputSelectImage from '../components/RegisterFields/InputSelectImage/InputSelectImage.js';
import StepsBar from '../components/ui/StepsBar/StepsBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import * as UserActionCreators from '../actions/UserActionCreators';
import '../../scss/pages/explorer-profile-plans.scss';

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

@translate('ExplorerProfilePlansPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore], getState)
export default class ExplorerProfilePlansPage extends Component {

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

    onChange(choices) {
        const {profile} = this.props;

        LoginActionCreators.preRegisterProfile({...profile, ...{plans: choices}});
    }

    render() {
        const {choices, profile, strings} = this.props;
        const canContinue = profile && profile.plans && profile.plans.length > 0;

        return (
            <div className="views">
                <div className="view view-main explorer-profile-plans-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.activitiesAndExperiences} textSize={'small'}/>
                    <div className="explorer-profile-plans-wrapper">
                        <h2>{strings.title}</h2>
                        <InputSelectImage options={choices}
                                          placeholder={strings.searchPlan}
                                          searchIcon={true}
                                          size={'small'}
                                          onClickHandler={this.onChange}/>
                    </div>
                </div>
                <StepsBar color={'green'} canContinue={canContinue} cantContinueText={strings.addPlan} continueText={strings.continue} currentStep={3} totalSteps={4} onClickHandler={this.goToAvailabilityPage}/>
            </div>
        );
    }
}

ExplorerProfilePlansPage.defaultProps = {
    strings: {
        activitiesAndExperiences: 'Activities & Experiences',
        title                   : 'What kind of plans do you like to do in your free time?',
        searchPlan              : 'Search kind of plan',
        addPlan                 : 'Select to continue',
        continue                : 'Continue'
    }
};