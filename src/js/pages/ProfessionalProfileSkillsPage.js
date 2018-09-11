import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import * as TagSuggestionsActionCreators from '../actions/TagSuggestionsActionCreators';
import LocaleStore from '../stores/LocaleStore';
import ProfileStore from '../stores/ProfileStore';
import RegisterStore from '../stores/RegisterStore';
import TagSuggestionsStore from '../stores/TagSuggestionsStore';
import InputTag from '../components/RegisterFields/InputTag/InputTag.js';
import StepsBar from '../components/ui/StepsBar/StepsBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import * as UserActionCreators from '../actions/UserActionCreators';
import '../../scss/pages/professional-profile-skills.scss';

function requestData(props) {
    if (!props.metadata) {
        UserActionCreators.requestMetadata();
    }
}

function resetTagSuggestions() {
    TagSuggestionsActionCreators.resetTagSuggestions();
}

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const tags = TagSuggestionsStore.tags || [];
    const tagValues = tags.map(tag => tag.name);
    const user = RegisterStore.user;
    const username = user && user.username ? user.username : null;
    const profile = RegisterStore.profile;

    return {
        interfaceLanguage,
        tagValues,
        profile,
        username
    };
}

@translate('ProfessionalProfileSkillsPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore, TagSuggestionsStore], getState)
export default class ProfessionalProfileSkillsPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        tagValues        : PropTypes.array,
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
        resetTagSuggestions();
        requestData(this.props);
    }

    componentDidUpdate() {

    }

    goToLeisureProfilePage() {
        this.context.router.push('/leisure-profile');
    }

    onChange(tags) {
        const {profile} = this.props;

        resetTagSuggestions();
        LoginActionCreators.preRegisterProfile({...profile, ...{profession: tags}});
    }

    onChangeText(text) {
        if (text) {
            TagSuggestionsActionCreators.requestProfileTagSuggestions(text, 'profession');
        } else {
            resetTagSuggestions();
        }
    }

    render() {
        const {tagValues, profile, strings} = this.props;
        const canContinue = profile && profile.profession && profile.profession.length > 0;

        return (
            <div className="views">
                <div className="view view-main professional-profile-skills-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.workAndIdeas} textSize={'small'}/>
                    <div className="professional-profile-skills-wrapper">
                        <h2>{strings.title}</h2>
                        <InputTag tags={tagValues}
                                  placeholder={strings.searchIndustry}
                                  searchIcon={true}
                                  size={'small'}
                                  chipsColor={'blue'}
                                  onChangeHandler={this.onChangeText}
                                  onClickHandler={this.onChange}
                                  selectedLabel={strings.selected}/>
                    </div>
                </div>
                <StepsBar color={'blue'} canContinue={canContinue} cantContinueText={strings.addIndustry} continueText={strings.continue} currentStep={1} totalSteps={2} onClickHandler={this.goToLeisureProfilePage}/>
            </div>
        );
    }

}

ProfessionalProfileSkillsPage.defaultProps = {
    strings: {
        workAndIdeas  : 'Work, Ideas & Projects',
        title         : 'What are your professional skills?',
        selected      : 'Your professional skills',
        searchIndustry: 'Search skill',
        addIndustry   : 'Add a skill to continue',
        continue      : 'Continue'
    }
};