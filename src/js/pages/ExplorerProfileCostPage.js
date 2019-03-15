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
import '../../scss/pages/explorer-profile-cost.scss';

function requestData(props) {
    if (!props.metadata) {
        UserActionCreators.requestMetadata();
    }
}

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const metadata = ProfileStore.getMetadata();
    const choices = metadata && metadata.leisureMoney ? metadata.leisureMoney.choices : [];
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

@translate('ExplorerProfileCostPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore], getState)
export default class ExplorerProfileCostPage extends Component {

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
        this.goToExplorerProfileEventsPage = this.goToExplorerProfileEventsPage.bind(this);
    }

    componentDidMount() {
        if (!this.props.username) {
            this.context.router.push('/answer-username');
        }
        requestData(this.props);
    }

    goToExplorerProfileEventsPage() {
        this.context.router.push('/explorer-profile-events');
    }

    onChange(choices) {
        const {profile} = this.props;

        LoginActionCreators.preRegisterProfile({...profile, ...{leisureMoney: choices}});
    }

    render() {
        const {choices, profile, strings} = this.props;
        const canContinue = profile && profile.leisureMoney && profile.leisureMoney.length > 0;

        return (
            <div className="views">
                <div className="view view-main explorer-profile-cost-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.activitiesAndExperiences} textSize={'small'}/>
                    <div className="explorer-profile-cost-wrapper">
                        <h2>{strings.title}</h2>
                        <div className="image-wrapper">
                            <img src="/img/proposals/Coste.png"/>
                        </div>
                        <br/>
                        <SelectInline options={choices}
                                      multiple={true}
                                      color={'green'}
                                      onClickHandler={this.onChange}/>
                    </div>
                </div>
                <StepsBar color={'green'} canContinue={canContinue} cantContinueText={strings.addCost} continueText={strings.continue} currentStep={0} totalSteps={4} onClickHandler={this.goToExplorerProfileEventsPage}/>
            </div>
        );
    }

}

ExplorerProfileCostPage.defaultProps = {
    strings: {
        activitiesAndExperiences: 'Activities & Experiences',
        title                   : 'What is your ideal cost for an entrance?',
        addCost                 : 'Select to continue',
        continue                : 'Continue'
    }
};