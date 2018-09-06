import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LocaleStore from '../stores/LocaleStore';
import Button from '../components/ui/Button/Button.js';
import Overlay from '../components/ui/Overlay/Overlay.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/availability.scss';

function getState() {
    const interfaceLanguage = LocaleStore.locale;

    return {
        interfaceLanguage,
    };
}

@translate('AvailabilityPage')
@connectToStores([LocaleStore], getState)
export default class AvailabilityPage extends Component {

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

        this.goToFacebookConnectPage = this.goToFacebookConnectPage.bind(this);
    }

    goToFacebookConnectPage() {
        // TODO: Enable when page is ready
        //this.context.router.push('/answer-username');
    }

    goToAvailabilityEditPage() {
        // TODO: Enable when page is ready
        //this.context.router.push('/answer-username');
    }

    render() {
        const {strings} = this.props;

        return (
            <div className="views">
                <div className="view view-main availability-view">
                    <TopNavBar background={'transparent'} color={'white'} iconLeft={'arrow-left'} textCenter={strings.yourAccount} position={'absolute'} textSize={'small'}/>
                    <div className="availability-wrapper">
                        <Overlay/>
                        <div className="image-wrapper">
                            <img src="/img/proposals/Disponibilidad.png"/>
                        </div>
                        <h1>{strings.title}</h1>
                        <div className="resume">{strings.resume}</div>
                        <Button onClickHandler={this.goToAvailabilityEditPage}>{strings.fillProfile}</Button>
                        <div className="skip-wrapper small" onClick={this.goToFacebookConnectPage}>
                            <span className="skip-text">{strings.skip}&nbsp;</span>
                            <span className="icon-arrow-right" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

AvailabilityPage.defaultProps = {
    strings: {
        yourAccount: 'Your account at Nekuno',
        title      : 'Tell us what your availability is',
        resume     : 'We need to know how much free time you have to recommend you plans whose match your availability',
        fillProfile: 'Fill profile',
        skip       : 'Not now'
    }
};