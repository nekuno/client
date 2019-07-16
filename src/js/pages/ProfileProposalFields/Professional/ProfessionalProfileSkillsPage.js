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
import '../../../../scss/pages/professional-profile-skills.scss';
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
@translate('ProfessionalProfileSkillsPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore, TagSuggestionsStore], getState)
export default class ProfessionalProfileSkillsPage extends Component {

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

        this.goToLeisureProfilePage = this.goToLeisureProfilePage.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {profession: []};
    }

    componentDidMount() {
        resetTagSuggestions();
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile && nextProps.profile.profession){
            this.setState({profession: nextProps.profile.profession});
        }
    }

    goToLeisureProfilePage() {
        const {profile} = this.props;
        UserActionCreators.editProfileProposalField(this.state, profile);
        this.context.router.push('/leisure-profile');
    }

    onChange(values) {
        const tags = this.buildTags(values);
        resetTagSuggestions();
        this.setState({profession: tags});
    }

    buildTags(strings)
    {
        return strings.map((choice) => {return {name: choice}});
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
        const canContinue = this.state.profession.length > 0;
        const selectedTags = profile && profile.profession ? profile.profession.map(tag => tag.name) : [];

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
                                  selectedLabel={strings.selected}
                                  selected={selectedTags}/>
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