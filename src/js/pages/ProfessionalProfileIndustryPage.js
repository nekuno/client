import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import LocaleStore from '../stores/LocaleStore';
import ProfileStore from '../stores/ProfileStore';
import RegisterStore from '../stores/RegisterStore';
import InputSelectText from '../components/RegisterFields/InputSelectText/InputSelectText.js';
import StepsBar from '../components/ui/StepsBar/StepsBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import * as UserActionCreators from '../actions/UserActionCreators';
import '../../scss/pages/professional-profile-industry.scss';

function requestData(props) {
    if (!props.metadata) {
        UserActionCreators.requestMetadata();
    }
}

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const metadata = ProfileStore.getMetadata();
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

@translate('ProfessionalProfileIndustryPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore], getState)
export default class ProfessionalProfileIndustryPage extends Component {

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

        this.goToLeisureProfilePage = this.goToLeisureProfilePage.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        if (!this.props.username) {
            this.context.router.push('/answer-username');
        }
        requestData(this.props);
    }

    goToLeisureProfilePage() {
        this.context.router.push('/leisure-profile');
    }

    goToProfessionalProfileSkillsPage() {
        // TODO: Enable when page is ready
        //this.context.router.push('/answer-username');
    }

    onChange(choices) {
        const {profile} = this.props;

        LoginActionCreators.preRegisterProfile({...profile, ...{industry: choices}});
    }

    render() {
        const {choices, profile, strings} = this.props;
        const canContinue = profile && profile.industry && profile.industry.length > 0;

        return (
            <div className="views">
                <div className="view view-main professional-profile-industry-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.workAndIdeas} textSize={'small'}/>
                    <div className="professional-profile-industry-wrapper">
                        <h2>{strings.title}</h2>
                        <InputSelectText options={choices}
                                         placeholder={strings.searchIndustry}
                                         searchIcon={true}
                                         size={'small'}
                                         chipsColor={'blue'}
                                         onClickHandler={this.onChange}
                                         selectedLabel={strings.selected}/>
                    </div>
                </div>
                <StepsBar color={'blue'} canContinue={canContinue} cantContinueText={strings.addIndustry} continueText={strings.continue} currentStep={0} totalSteps={2} onClickHandler={this.goToLeisureProfilePage}/>
            </div>
        );
    }

}

ProfessionalProfileIndustryPage.defaultProps = {
    strings: {
        workAndIdeas  : 'Work, Ideas & Projects',
        title         : 'What are your professional industry?',
        selected      : 'Your professional industries',
        searchIndustry: 'Search industry (e.g. Internet)',
        addIndustry   : 'Add an industry to continue',
        continue      : 'Continue'
    }
};