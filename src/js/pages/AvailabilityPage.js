import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LocaleStore from '../stores/LocaleStore';
import RegisterStore from '../stores/RegisterStore';
import Button from '../components/ui/Button/Button.js';
import Overlay from '../components/ui/Overlay/Overlay.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/availability.scss';

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const user = RegisterStore.user;
    const username = user && user.username ? user.username : null;
    const profile = RegisterStore.profile;
    const availability = profile && profile.availability ? profile.availability : null;
    const isComplete = availability && (availability.dynamic && availability.dynamic.length > 0 || availability.static && availability.static.length);

    return {
        interfaceLanguage,
        username,
        isComplete
    };
}

@translate('AvailabilityPage')
@connectToStores([LocaleStore, RegisterStore], getState)
export default class AvailabilityPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        interfaceLanguage: PropTypes.string,
        username         : PropTypes.string,
        isComplete       : PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.goToConnectFacebookPage = this.goToConnectFacebookPage.bind(this);
        this.goToAvailabilityEditPage = this.goToAvailabilityEditPage.bind(this);
    }

    componentDidMount() {
        if (!this.props.username) {
            this.context.router.push('/answer-username');
        }
    }

    goToConnectFacebookPage() {
        this.context.router.push('/connect-facebook');
    }

    goToAvailabilityEditPage() {
        this.context.router.push('/availability-edit-on-sign-up');
    }

    render() {
        const {isComplete, strings} = this.props;
        const titleText = isComplete ? strings.finishTitle : strings.title;
        const resumeText = isComplete ? strings.finishResume : strings.description;
        const buttonText = isComplete ? strings.edit : strings.add;
        const skipText = isComplete ? strings.signUp : strings.skip;

        return (
            <div className="views">
                <div className="view view-main availability-view">
                    <TopNavBar background={'transparent'} color={'white'} iconLeft={'arrow-left'} textCenter={strings.yourAccount} position={'absolute'} textSize={'small'}/>
                    <div className="availability-wrapper">
                        <Overlay/>
                        <div className="image-wrapper">
                            <img src="/img/proposals/Disponibilidad.png"/>
                        </div>
                        <h1>{titleText}</h1>
                        <div className="resume">{resumeText}</div>
                        <Button onClickHandler={this.goToAvailabilityEditPage}>{buttonText}</Button>
                        <div className="skip-wrapper small" onClick={this.goToConnectFacebookPage}>
                            <span className="skip-text">{skipText}&nbsp;</span>
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
        yourAccount : 'Your account at Nekuno',
        title       : 'Tell us what your availability is',
        finishTitle : 'Availability added!',
        description : 'We need to know how much free time you have to recommend you plans whose match your availability',
        finishResume: 'Now we can recommend you plans and projects which suit your availability',
        add         : 'Add availability',
        edit        : 'Edit availability',
        skip        : 'Not now',
        signUp      : 'Finish sign up',
    }
};