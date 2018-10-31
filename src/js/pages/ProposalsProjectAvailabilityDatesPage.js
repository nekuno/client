import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/proposals-project-availability-dates.scss';
import connectToStores from "../utils/connectToStores";
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import AvailabilityEdit from "../components/Availability/AvailabilityEdit/AvailabilityEdit";
import LocaleStore from "../stores/LocaleStore";
import CreatingProposalStore from "../stores/CreatingProposalStore";
import {INFINITE_CALENDAR_BLUE_THEME} from "../constants/InfiniteCalendarConstants";


function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const proposal = CreatingProposalStore.proposal;
    const availability = proposal.availability ? proposal.availability : null;

    return {
        interfaceLanguage,
        availability
    };
}

@translate('ProposalsProjectAvailabilityDatesPage')
@connectToStores([LocaleStore, CreatingProposalStore], getState)
export default class ProposalsProjectAvailabilityDatesPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        availability     : PropTypes.object,
        interfaceLanguage: PropTypes.string,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onSave = this.onSave.bind(this);

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
    }


    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-project-availability');
    }

    topNavBarRightLinkClick() {
        this.context.router.push('/proposals-project-availability');
    }

    onSave(availability) {
        const proposal = {
            availability: availability,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
    }

    render() {
        const {availability, interfaceLanguage, strings} = this.props;

        return (
            <div className="views">
                <div className="view view-main proposals-project-availability-dates-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'check'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-availability-dates-wrapper">
                        <AvailabilityEdit theme={INFINITE_CALENDAR_BLUE_THEME} color={'blue'} title={strings.title} availability={availability} interfaceLanguage={interfaceLanguage} onSave={this.onSave}/>
                    </div>
                </div>
            </div>
        );
    }
}

ProposalsProjectAvailabilityDatesPage.defaultProps = {
    strings: {
        publishProposal         : 'Publish proposal',
        title                   : 'What availability do you need for the project?'
    }
};