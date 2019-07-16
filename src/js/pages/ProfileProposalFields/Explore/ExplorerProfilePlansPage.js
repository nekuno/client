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
import '../../../../scss/pages/explorer-profile-plans.scss';
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
    const choices = metadata && metadata.plans ? metadata.plans.choices : [];
    const user = LoginStore.user;
    const profile = ProfileStore.get(user.slug);

    return {
        interfaceLanguage,
        choices,
        profile
    };
}

@AuthenticatedComponent
@translate('ExplorerProfilePlansPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore], getState)
export default class ExplorerProfilePlansPage extends Component {

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
        this.goToAvailabilityPage = this.goToAvailabilityPage.bind(this);

        this.state = {plans: []};

    }

    componentDidMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile && nextProps.profile.plans){
            this.setState({plans: nextProps.profile.plans});
        }
    }

    goToAvailabilityPage() {
        const {profile} = this.props;
        UserActionCreators.editProfileProposalField(this.state, profile);
        this.context.router.push('/availability');
    }

    onChange(choices) {
        this.setState({plans: choices});
    }

    render() {
        const {choices, profile, strings} = this.props;
        const currentIds = profile && choices ? profile.plans || [] : [];
        const currentChoices = currentIds.map(currentId => choices.find(choice => choice.id === currentId));
        const canContinue = this.state.plans.length > 0;

        return (
            <div className="views">
                <div className="view view-main explorer-profile-plans-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.activitiesAndExperiences} textSize={'small'}/>
                    <div className="explorer-profile-plans-wrapper">
                        <h2>{strings.title}</h2>
                        <InputSelectImage options={choices}
                                          placeholder={strings.searchPlan}
                                          searchIcon={true}
                                          size={'small'}
                                          onClickHandler={this.onChange}
                                          selected={currentChoices}/>
                    </div>
                </div>
                <StepsBar color={'green'} canContinue={canContinue} cantContinueText={strings.addPlan} continueText={strings.continue} currentStep={3} totalSteps={4} onClickHandler={this.goToAvailabilityPage}/>
            </div>
        );
    }
}

ExplorerProfilePlansPage.defaultProps = {
    strings: {
        activitiesAndExperiences: 'Activities & Experiences',
        title                   : 'What kind of plans do you like to do in your free time?',
        searchPlan              : 'Search kind of plan',
        addPlan                 : 'Select to continue',
        continue                : 'Continue'
    }
};