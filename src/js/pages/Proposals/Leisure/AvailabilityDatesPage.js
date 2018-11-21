import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals/leisure/availability-dates.scss';
import connectToStores from "../../../utils/connectToStores";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import AvailabilityEdit from "../../../components/Availability/AvailabilityEdit/AvailabilityEdit";
import LocaleStore from "../../../stores/LocaleStore";
import CreatingProposalStore from "../../../stores/CreatingProposalStore";
import {INFINITE_CALENDAR_PINK_THEME} from "../../../constants/InfiniteCalendarConstants";

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const proposal = CreatingProposalStore.proposal;
    const availability = proposal.availability ? proposal.availability : {'dynamic' : [], 'static' : []};

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


    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-leisure-availability');
    }

    topNavBarRightLinkClick() {
        this.context.router.push('/proposals-leisure-availability');
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
                <div className="view view-main proposals-leisure-availability-dates-view">
                    <TopNavBar
                        background={canContinue ? '#D380D3' : 'transparent'}
                        color={canContinue ? '#FFFFFF' : '#000'}
                        iconLeft={canContinue ? 'check' : ''}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-leisure-availability-dates-wrapper">
                        <AvailabilityEdit
                            theme={INFINITE_CALENDAR_PINK_THEME}
                            color={'pink'} title={strings.title}
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