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
import '../../scss/pages/leisure-profile-sports.scss';

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

@translate('LeisureProfileSportsPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore, TagSuggestionsStore], getState)
export default class LeisureProfileSportsPage extends Component {

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

        this.goToLeisureProfileHobbiesPage = this.goToLeisureProfileHobbiesPage.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        if (!this.props.username) {
            this.context.router.push('/answer-username');
        }
        resetTagSuggestions();
        requestData(this.props);
    }

    goToLeisureProfileHobbiesPage() {
        this.context.router.push('/leisure-profile-hobbies');
    }

    onChange(tags) {
        const {profile} = this.props;

        resetTagSuggestions();
        LoginActionCreators.preRegisterProfile({...profile, ...{sports: tags}});
    }

    onChangeText(text) {
        if (text) {
            TagSuggestionsActionCreators.requestProfileTagSuggestions(text, 'sports');
        } else {
            resetTagSuggestions();
        }
    }

    render() {
        const {tagValues, profile, strings} = this.props;
        const canContinue = profile && profile.sports && profile.sports.length > 0;

        return (
            <div className="views">
                <div className="view view-main leisure-profile-sports-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.sportsAndGames} textSize={'small'}/>
                    <div className="leisure-profile-sports-wrapper">
                        <h2>{strings.title}</h2>
                        <InputTag tags={tagValues}
                                  placeholder={strings.searchSport}
                                  searchIcon={true}
                                  size={'small'}
                                  chipsColor={'pink'}
                                  onChangeHandler={this.onChangeText}
                                  onClickHandler={this.onChange}
                                  selectedLabel={strings.selected}/>
                    </div>
                </div>
                <StepsBar color={'pink'} canContinue={canContinue} cantContinueText={strings.addSport} continueText={strings.continue} currentStep={0} totalSteps={3} onClickHandler={this.goToLeisureProfileHobbiesPage}/>
            </div>
        );
    }

}

LeisureProfileSportsPage.defaultProps = {
    strings: {
        sportsAndGames: 'Sports, Games & Hobbies',
        title         : 'What sports do you like to play in your free time?',
        selected      : 'Your selected sports',
        searchSport   : 'Search sport (e.g. Skateboarding)',
        addSport      : 'Add an sport to continue',
        continue      : 'Continue'
    }
};