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
import '../../scss/pages/explorer-profile-events.scss';

function requestData(props) {
    if (!props.metadata) {
        UserActionCreators.requestMetadata();
    }
}

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const metadata = ProfileStore.getMetadata();
    const choices = metadata && metadata.shows ? metadata.shows.choices : [];
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

@translate('ExplorerProfileEventsPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore], getState)
export default class ExplorerProfileEventsPage extends Component {

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
        this.goToExplorerProfileRestaurantsPage = this.goToExplorerProfileRestaurantsPage.bind(this);
    }

    componentDidMount() {
        if (!this.props.username) {
            this.context.router.push('/answer-username');
        }
        requestData(this.props);
    }

    goToExplorerProfileRestaurantsPage() {
        this.context.router.push('/explorer-profile-restaurants');
    }

    onChange(choices) {
        const {profile} = this.props;

        LoginActionCreators.preRegisterProfile({...profile, ...{events: choices}});
    }

    render() {
        const {choices, profile, strings} = this.props;
        const canContinue = profile && profile.events && profile.events.length > 0;

        return (
            <div className="views">
                <div className="view view-main explorer-profile-events-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.activitiesAndExperiences} textSize={'small'}/>
                    <div className="explorer-profile-events-wrapper">
                        <h2>{strings.title}</h2>
                        <InputSelectImage options={choices}
                                          placeholder={strings.searchEvent}
                                          searchIcon={true}
                                          size={'small'}
                                          onClickHandler={this.onChange}/>
                    </div>
                </div>
                <StepsBar color={'green'} canContinue={canContinue} cantContinueText={strings.addEvent} continueText={strings.continue} currentStep={1} totalSteps={4} onClickHandler={this.goToExplorerProfileRestaurantsPage}/>
            </div>
        );
    }
}

ExplorerProfileEventsPage.defaultProps = {
    strings: {
        activitiesAndExperiences: 'Activities & Experiences',
        title                   : 'What kind of events do you like to attend to?',
        searchEvent             : 'Search kind of event',
        addEvent                : 'Select to continue',
        continue                : 'Continue'
    }
};