import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../../../utils/connectToStores';
import translate from '../../../i18n/Translate';
import LocaleStore from '../../../stores/LocaleStore';
import RegisterStore from '../../../stores/RegisterStore';
import Overlay from '../../../components/ui/Overlay';
import TopNavBar from '../../../components/ui/TopNavBar';
import '../../../../scss/pages/explorer-profile.scss';
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";

function getState() {
    const interfaceLanguage = LocaleStore.locale;

    return {
        interfaceLanguage,
    };
}

@AuthenticatedComponent
@translate('ExplorerProfilePage')
@connectToStores([LocaleStore, RegisterStore], getState)
export default class ExplorerProfilePage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        interfaceLanguage: PropTypes.string,
        // Injected by @AuthenticatedComponent
        user                   : PropTypes.object.isRequired,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.goToAvailabilityPage = this.goToAvailabilityPage.bind(this);
        this.goToExplorerProfileCostPage = this.goToExplorerProfileCostPage.bind(this);

    }

    goToAvailabilityPage() {
        this.context.router.push('/availability');
    }

    goToExplorerProfileCostPage() {
        this.context.router.push('/explorer-profile-cost');
    }

    render() {
        const {strings} = this.props;

        return (
            <div className="views">
                <div className="view view-main explorer-profile-view">
                    <TopNavBar background={'transparent'} color={'white'} iconLeft={'arrow-left'} textCenter={strings.yourAccount} position={'absolute'} textSize={'small'}/>
                    <div className="explorer-profile-wrapper">
                        <Overlay/>
                        <div className="image-wrapper">
                            <img src="/img/proposals/Experiencias-sobreblanco.png"/>
                        </div>
                        <h1>{strings.title}</h1>
                        <div className="resume">{strings.description}</div>
                        {/*<Button onClickHandler={this.goToExplorerProfileCostPage}>{strings.fillProfile}</Button>*/}
                        <div className="skip-wrapper-center small" onClick={this.goToExplorerProfileCostPage}>
                            <span className="skip-text">{strings.fillProfile}&nbsp;</span>
                        </div>

                        <div className="skip-wrapper small" onClick={this.goToAvailabilityPage}>
                            <span className="skip-text">{strings.skip}&nbsp;</span>
                            <span className="icon-arrow-right" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

ExplorerProfilePage.defaultProps = {
    strings: {
        yourAccount: 'Your account at Nekuno',
        title      : 'Fill your explorer profile',
        description: 'We need to know what kind of activities and experiences you like to recommend you people and plans',
        fillProfile: 'Fill profile',
        skip       : 'Not now'
    }
};