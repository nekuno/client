import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LocaleStore from '../stores/LocaleStore';
import Button from '../components/ui/Button/Button.js';
import Overlay from '../components/ui/Overlay/Overlay.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/professional-profile.scss';

function getState() {
    const interfaceLanguage = LocaleStore.locale;

    return {
        interfaceLanguage,
    };
}

@translate('ProfessionalProfilePage')
@connectToStores([LocaleStore], getState)
export default class ProfessionalProfilePage extends Component {

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

        this.goToLeisureProfilePage = this.goToLeisureProfilePage.bind(this);
    }

    goToLeisureProfilePage() {
        // TODO: Enable when page is ready
        //this.context.router.push('/answer-username');
    }

    goToProfessionalProfileIndustryPage() {
        // TODO: Enable when page is ready
        //this.context.router.push('/answer-username');
    }

    render() {
        const {strings} = this.props;

        return (
            <div className="views">
                <div className="view view-main professional-profile-view">
                    <TopNavBar background={'transparent'} color={'white'} iconLeft={'arrow-left'} textCenter={strings.yourAccount} position={'absolute'} textSize={'small'}/>
                    <div className="professional-profile-wrapper">
                        <Overlay/>
                        <div className="image-wrapper">
                            <img src="/img/proposals/Trabajo.png"/>
                        </div>
                        <h1>{strings.title}</h1>
                        <div className="resume">{strings.resume}</div>
                        <Button onClickHandler={this.goToProfessionalProfileIndustryPage}>{strings.fillProfile}</Button>
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

ProfessionalProfilePage.defaultProps = {
    strings: {
        yourAccount: 'Your account at Nekuno',
        title      : 'Fill your professional profile',
        resume     : 'We need to know your industry and professional skills to recommend you people and projects',
        fillProfile: 'Fill profile',
        skip       : 'Not now'
    }
};