import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/ui/TopNavBar';
import '../../../../scss/pages/proposals/experience/availability-dates.scss';
import connectToStores from "../../../utils/connectToStores";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import AvailabilityEdit from "../../../components/Availability/AvailabilityEdit";
import LocaleStore from "../../../stores/LocaleStore";
import CreatingProposalStore from "../../../stores/CreatingProposalStore";
import {INFINITE_CALENDAR_GREEN_THEME} from "../../../constants/InfiniteCalendarConstants";

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const availability = CreatingProposalStore.availability;

    return {
        interfaceLanguage,
        availability
    };
}

@translate('ProposalsLeisureAvailabilityDatesPage')
@connectToStores([LocaleStore, CreatingProposalStore], getState)
export default class AvailabilityDatesPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings           : PropTypes.object,
        // Injected by @connectToStores:
        availability      : PropTypes.object,
        interfaceLanguage : PropTypes.string,
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.onSave = this.onSave.bind(this);
    }


    topNavBarRightLinkClick() {
        this.context.router.push('/proposals-experience-availability');
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-experience-availability');
    }

    onSave(availability) {
        const proposal = {
            availability : availability,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
    }

    render() {
        const {availability, interfaceLanguage, strings} = this.props;
        const canContinue = (!(availability.dynamic.length === 0 && availability.static.length === 0));

        return (
            <div className="views">
                <div className="view view-main proposals-experience-availability-dates-view">
                    <TopNavBar
                        background={canContinue ? '#7bd47e' : 'transparent'}
                        color={canContinue ? '#FFFFFF' : '#000'}
                        leftIcon={'left-arrow'}
                        rightIcon={canContinue ? 'check' : ''}
                        centerText={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-experience-availability-dates-wrapper">
                        <AvailabilityEdit
                                theme={INFINITE_CALENDAR_GREEN_THEME}
                            color={'green'} title={strings.title}
                            availability={availability}
                            interfaceLanguage={interfaceLanguage}
                            onSave={this.onSave}/>
                    </div>
                </div>
            </div>
        );
    }
}

AvailabilityDatesPage.defaultProps = {
    strings: {
        publishProposal         : 'Publish proposal',
        title                   : 'What availability do you need for the project?',
    }
};