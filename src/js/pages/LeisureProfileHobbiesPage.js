import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import LocaleStore from '../stores/LocaleStore';
import ProfileStore from '../stores/ProfileStore';
import RegisterStore from '../stores/RegisterStore';
import StepsBar from '../components/ui/StepsBar/StepsBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import * as UserActionCreators from '../actions/UserActionCreators';
import '../../scss/pages/leisure-profile-hobbies.scss';
import * as TagSuggestionsActionCreators from "../actions/TagSuggestionsActionCreators";
import TagSuggestionsStore from "../stores/TagSuggestionsStore";
import InputTag from '../components/RegisterFields/InputTag/InputTag.js';

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

@translate('LeisureProfileHobbiesPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore], getState)
export default class LeisureProfileHobbiesPage extends Component {

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
        this.goToLeisureProfileGamesPage = this.goToLeisureProfileGamesPage.bind(this);
    }

    componentDidMount() {
        if (!this.props.username) {
            this.context.router.push('/answer-username');
        }
        resetTagSuggestions();
        requestData(this.props);
    }

    goToLeisureProfileGamesPage() {
        this.context.router.push('/leisure-profile-games');
    }

    onChange(tags) {
        const {profile} = this.props;

        resetTagSuggestions();
        LoginActionCreators.preRegisterProfile({...profile, ...{hobbies: tags}});
    }

    onChangeText(text) {
        if (text) {
            TagSuggestionsActionCreators.requestProfileTagSuggestions(text, 'hobbies');
        } else {
            resetTagSuggestions();
        }
    }

    render() {
        const {tagValues, profile, strings} = this.props;
        const canContinue = profile && profile.hobbies && profile.hobbies.length > 0;

        return (
            <div className="views">
                <div className="view view-main leisure-profile-hobbies-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.sportsAndGames} textSize={'small'}/>
                    <div className="leisure-profile-hobbies-wrapper">
                        <h2>{strings.title}</h2>
                        <InputTag tags={tagValues}
                                  placeholder={strings.searchHobby}
                                  searchIcon={true}
                                  size={'small'}
                                  chipsColor={'pink'}
                                  onChangeHandler={this.onChangeText}
                                  onClickHandler={this.onChange}
                                  selectedLabel={strings.selected}/>
                    </div>
                </div>
                <StepsBar color={'pink'} canContinue={canContinue} cantContinueText={strings.addHobby} continueText={strings.continue} currentStep={1} totalSteps={3} onClickHandler={this.goToLeisureProfileGamesPage}/>
            </div>
        );
    }

}

LeisureProfileHobbiesPage.defaultProps = {
    strings: {
        sportsAndGames: 'Sports, Games & Hobbies',
        title         : 'What hobbies do you like to practice in your free time?',
        searchHobby   : 'Search hobby',
        addHobby      : 'Add a hobby to continue',
        continue      : 'Continue'
    }
};