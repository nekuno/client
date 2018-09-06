import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LocaleStore from '../stores/LocaleStore';
import Button from '../components/ui/Button/Button.js';
import Overlay from '../components/ui/Overlay/Overlay.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/leisure-profile.scss';

function getState() {
    const interfaceLanguage = LocaleStore.locale;

    return {
        interfaceLanguage,
    };
}

@translate('LeisureProfilePage')
@connectToStores([LocaleStore], getState)
export default class LeisureProfilePage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        interfaceLanguage: PropTypes.string
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.goToExplorerProfilePage = this.goToExplorerProfilePage.bind(this);
    }

    goToExplorerProfilePage() {
        // TODO: Enable when page is ready
        //this.context.router.push('/answer-username');
    }

    goToLeisureProfileSportsPage() {
        // TODO: Enable when page is ready
        //this.context.router.push('/answer-username');
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
                        <div className="resume">{strings.resume}</div>
                        <Button onClickHandler={this.goToLeisureProfileSportsPage}>{strings.fillProfile}</Button>
                        <div className="skip-wrapper small" onClick={this.goToLeisureProfilePage}>
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
        resume     : 'We need to know your sports, games and favorite hobbies to recommend you people and plans',
        fillProfile: 'Fill profile',
        skip       : 'Not now'
    }
};