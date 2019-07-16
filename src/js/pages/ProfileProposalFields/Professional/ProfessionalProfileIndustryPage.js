import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../../../utils/connectToStores';
import translate from '../../../i18n/Translate';
import LocaleStore from '../../../stores/LocaleStore';
import ProfileStore from '../../../stores/ProfileStore';
import RegisterStore from '../../../stores/RegisterStore';
import InputSelectText from '../../../components/RegisterFields/InputSelectText';
import StepsBar from '../../../components/ui/StepsBar';
import TopNavBar from '../../../components/ui/TopNavBar';
import * as UserActionCreators from '../../../actions/UserActionCreators';
import '../../../../scss/pages/professional-profile-industry.scss';
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
    const choices = metadata && metadata.industry ? metadata.industry.choices : [];
    const user = LoginStore.user;
    const profile = ProfileStore.get(user.slug);

    return {
        interfaceLanguage,
        choices,
        profile
    };
}

@AuthenticatedComponent
@translate('ProfessionalProfileIndustryPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore], getState)
export default class ProfessionalProfileIndustryPage extends Component {

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
        this.goToProfessionalProfileSkillsPage = this.goToProfessionalProfileSkillsPage.bind(this);

        this.state = {industry: []};

    }

    componentDidMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile && nextProps.profile.industry){
            this.setState({industry: nextProps.profile.industry});
        }
    }

    goToProfessionalProfileSkillsPage() {
        const {profile} = this.props;
        UserActionCreators.editProfileProposalField(this.state, profile);
        this.context.router.push('/professional-profile-skills');
    }

    onChange(choices) {
        this.setState({industry: choices});
    }

    render() {
        const {choices, profile, strings} = this.props;
        const canContinue = this.state.industry.length > 0;

        return (
            <div className="views">
                <div className="view view-main professional-profile-industry-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.workAndIdeas} textSize={'small'}/>
                    <div className="professional-profile-industry-wrapper">
                        <h2>{strings.title}</h2>
                        <InputSelectText options={choices}
                                         placeholder={strings.searchIndustry}
                                         searchIcon={true}
                                         size={'small'}
                                         chipsColor={'blue'}
                                         onClickHandler={this.onChange}
                                         selectedLabel={strings.selected}/>
                    </div>
                </div>
                <StepsBar color={'blue'} canContinue={canContinue} cantContinueText={strings.addIndustry} continueText={strings.continue} currentStep={0} totalSteps={2} onClickHandler={this.goToProfessionalProfileSkillsPage}/>
            </div>
        );
    }

}

ProfessionalProfileIndustryPage.defaultProps = {
    strings: {
        workAndIdeas  : 'Work, Ideas & Projects',
        title         : 'What are your professional industry?',
        selected      : 'Your professional industries',
        searchIndustry: 'Search industry (e.g. Internet)',
        addIndustry   : 'Add an industry to continue',
        continue      : 'Continue'
    }
};