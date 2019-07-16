import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../../../utils/connectToStores';
import translate from '../../../i18n/Translate';
import * as TagSuggestionsActionCreators from '../../../actions/TagSuggestionsActionCreators';
import LocaleStore from '../../../stores/LocaleStore';
import ProfileStore from '../../../stores/ProfileStore';
import RegisterStore from '../../../stores/RegisterStore';
import TagSuggestionsStore from '../../../stores/TagSuggestionsStore';
import InputTag from '../../../components/RegisterFields/InputTag';
import StepsBar from '../../../components/ui/StepsBar';
import TopNavBar from '../../../components/ui/TopNavBar';
import ConnectSteamAnonymous from '../../../components/Steam/ConnectSteamAnonymous/ConnectSteamAnonymous.js';
import * as UserActionCreators from '../../../actions/UserActionCreators';
import '../../../../scss/pages/leisure-profile-games.scss';
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";
import LoginStore from "../../../stores/LoginStore";

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
    const user = LoginStore.user;
    const profile = ProfileStore.get(user.slug);

    return {
        interfaceLanguage,
        tagValues,
        profile
    };
}

@AuthenticatedComponent
@translate('LeisureProfileGamesPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore, TagSuggestionsStore], getState)
export default class LeisureProfileGamesPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        tagValues        : PropTypes.array,
        profile          : PropTypes.object,
        interfaceLanguage: PropTypes.string,
        // Injected by @AuthenticatedComponent
        user                   : PropTypes.object.isRequired,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.goToExplorerProfilePage = this.goToExplorerProfilePage.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addGame = this.addGame.bind(this);

        this.state = {
            steamGames: [],
            games: []
        };
    }

    componentDidMount() {
        resetTagSuggestions();
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile && nextProps.profile.games){
            this.setState({games: nextProps.profile.games});
        }
    }

    goToExplorerProfilePage() {
        const {profile} = this.props;
        UserActionCreators.editProfileProposalField(this.state, profile);
        this.context.router.push('/explorer-profile');
    }

    onChange(values) {
        const tags = this.buildTags(values);
        resetTagSuggestions();
        this.setState({games: tags});
    }

    buildTags(strings)
    {
        return strings.map((choice) => {return {name: choice}});
    }

    onChangeText(text) {
        if (text) {
            TagSuggestionsActionCreators.requestProfileTagSuggestions(text, 'games');
        } else {
            resetTagSuggestions();
        }
    }

    addGame(gameName) {
        this.setState({
            steamGames: [...this.state.steamGames, gameName]
        });
    }

    render() {
        const {tagValues, profile, strings} = this.props;
        const {steamGames} = this.state;
        const canContinue = this.state.games.length > 0;
        const selectedTags = profile && profile.games ? profile.games.map(tag => tag.name) : [];

        return (
            <div className="views">
                <div className="view view-main leisure-profile-games-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.sportsAndGames} textSize={'small'}/>
                    <div className="leisure-profile-games-wrapper">
                        <h2>{strings.title}</h2>
                        <InputTag tags={[...tagValues, ...steamGames]}
                                  placeholder={strings.searchGame}
                                  searchIcon={true}
                                  size={'small'}
                                  chipsColor={'pink'}
                                  onChangeHandler={this.onChangeText}
                                  onClickHandler={this.onChange}
                                  selectedLabel={strings.selected}
                                  selected={selectedTags}/>
                        <br/>

                        <ConnectSteamAnonymous addGame={this.addGame}/>
                    </div>
                </div>
                <StepsBar color={'pink'} canContinue={canContinue} cantContinueText={strings.addGame} continueText={strings.continue} currentStep={2} totalSteps={3} onClickHandler={this.goToExplorerProfilePage}/>
            </div>
        );
    }

}

LeisureProfileGamesPage.defaultProps = {
    strings: {
        sportsAndGames: 'Sports, Games & Hobbies',
        title         : 'What games do you like to play in your free time?',
        selected      : 'Games that you like',
        searchGame    : 'Search game',
        addGame       : 'Add a game to continue',
        continue      : 'Continue'
    }
};