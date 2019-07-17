import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../../../utils/connectToStores';
import translate from '../../../i18n/Translate';
import LocaleStore from '../../../stores/LocaleStore';
import ProfileStore from '../../../stores/ProfileStore';
import RegisterStore from '../../../stores/RegisterStore';
import StepsBar from '../../../components/ui/StepsBar';
import TopNavBar from '../../../components/ui/TopNavBar';
import * as UserActionCreators from '../../../actions/UserActionCreators';
import '../../../../scss/pages/leisure-profile-hobbies.scss';
import InputSelectText from '../../../components/RegisterFields/InputSelectText';
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";
import LoginStore from "../../../stores/LoginStore";

function requestData(props) {
    if (!props.metadata) {
        UserActionCreators.requestMetadata();
    }
}

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const user = LoginStore.user;
    const profile = ProfileStore.get(user.slug);
    const metadata = ProfileStore.getMetadata();
    const choices = metadata && metadata.hobbies ? metadata.hobbies.choices.filter((choice) => (!!choice.id)) : [];


    return {
        interfaceLanguage,
        choices,
        profile
    };
}

@AuthenticatedComponent
@translate('LeisureProfileHobbiesPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore], getState)
export default class LeisureProfileHobbiesPage extends Component {

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
        this.goToLeisureProfileGamesPage = this.goToLeisureProfileGamesPage.bind(this);

        this.state = {hobbies: []};
    }

    componentDidMount() {
        requestData(this.props);
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.profile && nextProps.profile.hobbies){
            this.setState({hobbies: nextProps.profile.hobbies});
        }
    }

    goToLeisureProfileGamesPage() {
        const {profile} = this.props;
        UserActionCreators.editProfileProposalField(this.state, profile);
        this.context.router.push('/leisure-profile-games');
    }

    onChange(choices) {
        this.setState({hobbies: choices});
    }

    render() {
        const {choices, profile, strings} = this.props;
        const canContinue = this.state.hobbies.length > 0;

        return (
            <div className="views">
                <div className="view view-main leisure-profile-hobbies-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.sportsAndGames} textSize={'small'}/>
                    <div className="leisure-profile-hobbies-wrapper">
                        <h2>{strings.title}</h2>
                        <InputSelectText options={choices}
                                         placeholder={strings.searchHobby}
                                         searchIcon={true}
                                         size={'small'}
                                         chipsColor={'pink'}
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