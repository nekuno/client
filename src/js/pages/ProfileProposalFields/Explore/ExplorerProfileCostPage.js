import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../../../utils/connectToStores';
import translate from '../../../i18n/Translate';
import LocaleStore from '../../../stores/LocaleStore';
import ProfileStore from '../../../stores/ProfileStore';
import RegisterStore from '../../../stores/RegisterStore';
import LoginStore from '../../../stores/LoginStore';
import SelectInline from '../../../components/ui/SelectInline';
import StepsBar from '../../../components/ui/StepsBar';
import TopNavBar from '../../../components/ui/TopNavBar';
import * as UserActionCreators from '../../../actions/UserActionCreators';
import '../../../../scss/pages/explorer-profile-cost.scss';
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";

function requestData(props) {
    if (!props.metadata) {
        UserActionCreators.requestMetadata();
    }
}

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const metadata = ProfileStore.getMetadata();
    const choices = metadata && metadata.leisureMoney ? metadata.leisureMoney.choices : [];
    const user = LoginStore.user;
    const profile = ProfileStore.get(user.slug);

    return {
        interfaceLanguage,
        choices,
        profile
    };
}

@AuthenticatedComponent
@translate('ExplorerProfileCostPage')
@connectToStores([LocaleStore, ProfileStore, RegisterStore], getState)
export default class ExplorerProfileCostPage extends Component {

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
        this.goToExplorerProfileShowsPage = this.goToExplorerProfileShowsPage.bind(this);

        this.state = {leisureMoney: []};
    }

    componentDidMount() {
        requestData(this.props);
    }

    goToExplorerProfileShowsPage() {
        const {profile} = this.props;
        UserActionCreators.editProfileProposalField(this.state, profile);
        this.context.router.push('/explorer-profile-shows');
    }

    onChange(choices) {
        this.setState({leisureMoney: choices});
    }

    render() {
        const {choices, profile, strings} = this.props;
        const canContinue = this.state.leisureMoney.length > 0;

        return (
            <div className="views">
                <div className="view view-main explorer-profile-cost-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.activitiesAndExperiences} textSize={'small'}/>
                    <div className="explorer-profile-cost-wrapper">
                        <h2>{strings.title}</h2>
                        <div className="image-wrapper">
                            <img src="/img/proposals/Coste.png"/>
                        </div>
                        <br/>
                        <SelectInline options={choices}
                                      multiple={true}
                                      color={'green'}
                                      onClickHandler={this.onChange}/>
                    </div>
                </div>
                <StepsBar color={'green'} canContinue={canContinue} cantContinueText={strings.addCost} continueText={strings.continue} currentStep={0} totalSteps={4} onClickHandler={this.goToExplorerProfileShowsPage}/>
            </div>
        );
    }

}

ExplorerProfileCostPage.defaultProps = {
    strings: {
        activitiesAndExperiences: 'Activities & Experiences',
        title                   : 'What is your ideal cost for an entrance?',
        addCost                 : 'Select to continue',
        continue                : 'Continue'
    }
};