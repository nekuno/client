import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../utils/connectToStores';
import { format } from 'date-fns';
import translate from '../i18n/Translate';
import * as UserActionCreators from '../actions/UserActionCreators';
import LocaleStore from '../stores/LocaleStore';
import ProfileStore from '../stores/ProfileStore';
import RegisterStore from '../stores/RegisterStore';
import StepsBar from '../components/ui/StepsBar/StepsBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import AvailabilityEdit from '../components/Availability/AvailabilityEdit/AvailabilityEdit.js';
import '../../scss/pages/availability-edit.scss';
import {INFINITE_CALENDAR_THEME} from "../constants/InfiniteCalendarConstants";
import AvailabilityStore from "../stores/AvailabilityStore";

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const user = RegisterStore.user;
    const username = user && user.username ? user.username : null;
    const availability = AvailabilityStore.ownAvailability;

    return {
        interfaceLanguage,
        availability,
        username
    };
}

@translate('AvailabilityEditOnSignUpPage')
@connectToStores([LocaleStore, RegisterStore, AvailabilityStore], getState)
export default class AvailabilityEditOnSignUpPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        availability     : PropTypes.object,
        username         : PropTypes.string,
        interfaceLanguage: PropTypes.string
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onSave = this.onSave.bind(this);
        this.saveAndContinue = this.saveAndContinue.bind(this);
    }

    componentDidMount() {
        if (!this.props.username) {
            this.context.router.push('/answer-username');
        }
    }

    saveAndContinue() {
        this.context.router.push('/connect-facebook');
    }

    onSave(availability) {
        UserActionCreators.editAvailability(availability);
    }

    render() {
        const {availability, interfaceLanguage, strings} = this.props;
        const canContinue = availability.dynamic.length > 0 || availability.static.length > 0;

        return (
            <div className="views">
                <div className="view view-main availability-edit-view">
                    <TopNavBar iconLeft={'arrow-left'} textCenter={strings.yourAvailability} textSize={'small'}/>
                    <AvailabilityEdit theme={INFINITE_CALENDAR_THEME} availability={availability} interfaceLanguage={interfaceLanguage} onSave={this.onSave}/>
                </div>
                {canContinue ?
                    <StepsBar canContinue={true} continueText={strings.continue} totalSteps={0} onClickHandler={this.saveAndContinue}/>
                    : null
                }
            </div>
        );
    }
}

AvailabilityEditOnSignUpPage.defaultProps = {
    strings: {
        yourAvailability: 'Your Availability',
        continue        : 'Save & continue'
    }
};