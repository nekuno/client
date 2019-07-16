import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../../../utils/connectToStores';
import translate from '../../../i18n/Translate';
import LocaleStore from '../../../stores/LocaleStore';
import RegisterStore from '../../../stores/RegisterStore';
import Overlay from '../../../components/ui/Overlay';
import TopNavBar from '../../../components/ui/TopNavBar';
import '../../../../scss/pages/leisure-profile.scss';
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";

function getState() {
    const interfaceLanguage = LocaleStore.locale;

    return {
        interfaceLanguage,
    };
}

@AuthenticatedComponent
@translate('LeisureProfilePage')
@connectToStores([LocaleStore, RegisterStore], getState)
export default class LeisureProfilePage extends Component {

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

        this.goToExplorerProfilePage = this.goToExplorerProfilePage.bind(this);
        this.goToLeisureProfileSportsPage = this.goToLeisureProfileSportsPage.bind(this);
    }

    goToExplorerProfilePage() {
        this.context.router.push('/explorer-profile');
    }

    goToLeisureProfileSportsPage() {
        this.context.router.push('/leisure-profile-sports');
    }

    render() {
        const {strings} = this.props;

        return (
            <div className="views">
                <div className="view view-main leisure-profile-view">
                    <TopNavBar background={'transparent'} color={'white'} iconLeft={'arrow-left'} textCenter={strings.yourAccount} position={'absolute'} textSize={'small'}/>
                    <div className="leisure-profile-wrapper">
                        <Overlay/>
                        <div className="image-wrapper">
                            <img src="/img/proposals/ConocerGente.png"/>
                        </div>
                        <h1>{strings.title}</h1>
                        <div className="resume">{strings.description}</div>
                        {/*<Button onClickHandler={this.goToLeisureProfileSportsPage}>{strings.fillProfile}</Button>*/}

                        <div className="skip-wrapper-center small" onClick={this.goToLeisureProfileSportsPage}>
                            <span className="skip-text">{strings.fillProfile}&nbsp;</span>
                        </div>

                        <div className="skip-wrapper small" onClick={this.goToExplorerProfilePage}>
                            <span className="skip-text">{strings.skip}&nbsp;</span>
                            <span className="icon-arrow-right" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

LeisureProfilePage.defaultProps = {
    strings: {
        yourAccount: 'Your account at Nekuno',
        title      : 'Fill your leisure profile',
        description: 'We need to know your sports, games and favorite hobbies to recommend you people and plans',
        fillProfile: 'Fill profile',
        skip       : 'Not now'
    }
};