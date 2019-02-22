import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { format } from 'date-fns';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import ProfileStore from '../stores/ProfileStore';
import StepsBar from '../components/ui/StepsBar/StepsBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import AvailabilityEdit from '../components/Availability/AvailabilityEdit/AvailabilityEdit.js';
import * as UserActionCreators from '../actions/UserActionCreators';
import '../../scss/pages/availability-edit.scss';
import { INFINITE_CALENDAR_THEME } from "../constants/InfiniteCalendarConstants";
import AvailabilityStore from "../stores/AvailabilityStore";

function getState(props) {
    const profile = ProfileStore.get(props.user.slug);
    const interfaceLanguage = profile ? profile.interfaceLanguage : null;
    const availability = AvailabilityStore.ownAvailability;

    return {
        interfaceLanguage,
        availability
    };
}

@AuthenticatedComponent
@translate('AvailabilityEditPage')
@connectToStores([AvailabilityStore], getState)
export default class AvailabilityEditPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        availability     : PropTypes.object.isRequired,
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

        this.state = {
            updating: false,
        }
    }

    saveAndContinue() {
        this.setState({
            updating: true,
        });

        const {availability} = this.props;
        console.log(availability);
        UserActionCreators.updateAvailability(availability).then(() => {
            this.context.router.push('/proposals');
        });
    }

    onSave(data) {
        UserActionCreators.editAvailability(data)
    }

    render() {
        const {interfaceLanguage, strings, availability} = this.props;
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

AvailabilityEditPage.defaultProps = {
    strings: {
        yourAvailability: 'My Availability',
        continue        : 'Save changes'
    }
};