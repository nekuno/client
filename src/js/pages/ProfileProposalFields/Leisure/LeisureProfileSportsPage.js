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
import * as UserActionCreators from '../../../actions/UserActionCreators';
import '../../../../scss/pages/leisure-profile-sports.scss';
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
        interfaceLanguage: PropTypes.string,
        // Injected by @AuthenticatedComponent
        user                   : PropTypes.object.isRequired,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.goToLeisureProfileHobbiesPage = this.goToLeisureProfileHobbiesPage.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {sports: []};

    }

    componentDidMount() {
        resetTagSuggestions();
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile && nextProps.profile.sports){
            this.setState({sports: nextProps.profile.sports});
        }
    }

    goToLeisureProfileHobbiesPage() {
        const {profile} = this.props;
        UserActionCreators.editProfileProposalField(this.state, profile);
        this.context.router.push('/leisure-profile-hobbies');
    }

    onChange(values) {
        const tags = this.buildTags(values);
        resetTagSuggestions();
        this.setState({sports: tags});
    }

    buildTags(strings)
    {
        return strings.map((choice) => {return {name: choice}});
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
        const canContinue = this.state.sports.length > 0;
        const selectedTags = profile && profile.sports ? profile.sports.map(tag => tag.name) : [];

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
                                  selectedLabel={strings.selected}
                                  selected = {selectedTags}/>
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