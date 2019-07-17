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
import '../../../../scss/pages/explorer-profile-restaurants.scss';
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
    // TODO: Replace with restaurants
    const choices = metadata && metadata.restaurants ? metadata.restaurants.choices : [];
    const user = LoginStore.user;
    const profile = ProfileStore.get(user.slug);

    return {
        interfaceLanguage,
        choices,
        profile
    };
}

@AuthenticatedComponent
@translate('ExplorerProfileRestaurantsPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore], getState)
export default class ExplorerProfileRestaurantsPage extends Component {

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
        this.goToExplorerProfilePlansPage = this.goToExplorerProfilePlansPage.bind(this);

        this.state ={restaurants: []};

    }

    componentDidMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile && nextProps.profile.restaurants){
            this.setState({restaurants: nextProps.profile.restaurants});
        }
    }

    goToExplorerProfilePlansPage() {
        const {profile} = this.props;
        UserActionCreators.editProfileProposalField(this.state, profile);
        this.context.router.push('/explorer-profile-plans');
    }

    onChange(choices) {
        this.setState({restaurants: choices});
    }

    render() {
        const {choices, profile, strings} = this.props;
        const currentIds = profile && choices ? profile.restaurants || [] : [];
        const currentChoices = currentIds.map(currentId => choices.find(choice => choice.id === currentId));
        const canContinue = this.state.restaurants.length > 0;

        return (
            <div className="views">
                <div className="view view-main explorer-profile-restaurants-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.activitiesAndExperiences} textSize={'small'}/>
                    <div className="explorer-profile-restaurants-wrapper">
                        <h2>{strings.title}</h2>
                        <InputSelectImage options={choices}
                                          placeholder={strings.searchRestaurant}
                                          searchIcon={true}
                                          size={'small'}
                                          onClickHandler={this.onChange}
                                          selected={currentChoices}/>
                    </div>
                </div>
                <StepsBar color={'green'} canContinue={canContinue} cantContinueText={strings.addRestaurant} continueText={strings.continue} currentStep={2} totalSteps={4} onClickHandler={this.goToExplorerProfilePlansPage}/>
            </div>
        );
    }
}

ExplorerProfileRestaurantsPage.defaultProps = {
    strings: {
        activitiesAndExperiences: 'Activities & Experiences',
        title                   : 'What kind of restaurants do you like to go for lunch or dinner?',
        searchRestaurant        : 'Search kind of restaurant',
        addRestaurant           : 'Select to continue',
        continue                : 'Continue'
    }
};