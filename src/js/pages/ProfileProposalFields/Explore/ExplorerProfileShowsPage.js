import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../../../utils/connectToStores';
import translate from '../../../i18n/Translate';
import LocaleStore from '../../../stores/LocaleStore';
import ProfileStore from '../../../stores/ProfileStore';
import RegisterStore from '../../../stores/RegisterStore';
import InputSelectImage from '../../../components/RegisterFields/InputSelectImage';
import StepsBar from '../../../components/ui/StepsBar';
import TopNavBar from '../../../components/ui/TopNavBar';
import * as UserActionCreators from '../../../actions/UserActionCreators';
import '../../../../scss/pages/explorer-profile-events.scss';
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";
import LoginStore from "../../../stores/LoginStore";

function requestData(props) {
    if (!props.metadata) {
        UserActionCreators.requestMetadata();
    }
}

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const metadata = ProfileStore.getMetadata();
    const choices = metadata && metadata.shows ? metadata.shows.choices : [];
    const user = LoginStore.user;
    const profile = ProfileStore.get(user.slug);

    return {
        interfaceLanguage,
        choices,
        profile
    };
}

@AuthenticatedComponent
@translate('ExplorerProfileShowsPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore], getState)
export default class ExplorerProfileShowsPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        choices          : PropTypes.array,
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

        this.onChange = this.onChange.bind(this);
        this.goToExplorerProfileRestaurantsPage = this.goToExplorerProfileRestaurantsPage.bind(this);

        this.state = {shows: []};
    }

    componentDidMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile && nextProps.profile.shows){
            this.setState({shows: nextProps.profile.shows});
        }
    }

    goToExplorerProfileRestaurantsPage() {
        const {profile} = this.props;
        UserActionCreators.editProfileProposalField(this.state, profile);
        this.context.router.push('/explorer-profile-restaurants');
    }

    onChange(choices) {
        this.setState({shows: choices});
    }

    render() {
        const {choices, profile, strings} = this.props;
        const currentIds = profile ? profile.shows || [] : [];
        const currentChoices = currentIds.map(currentId => choices.find(choice => choice.id === currentId));
        const canContinue = this.state.shows.length > 0;

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
                                          onClickHandler={this.onChange}
                                          selected={currentChoices}/>
                    </div>
                </div>
                <StepsBar color={'green'} canContinue={canContinue} cantContinueText={strings.addEvent} continueText={strings.continue} currentStep={1} totalSteps={4} onClickHandler={this.goToExplorerProfileRestaurantsPage}/>
            </div>
        );
    }
}

ExplorerProfileShowsPage.defaultProps = {
    strings: {
        activitiesAndExperiences: 'Activities & Experiences',
        title                   : 'What kind of events do you like to attend to?',
        searchEvent             : 'Search kind of event',
        addEvent                : 'Select to continue',
        continue                : 'Continue'
    }
};