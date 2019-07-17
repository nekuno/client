import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/ui/TopNavBar';
import '../../../../scss/pages/proposals/project/availability-dates.scss';
import connectToStores from "../../../utils/connectToStores";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import AvailabilityEdit from "../../../components/Availability/AvailabilityEdit";
import LocaleStore from "../../../stores/LocaleStore";
import CreatingProposalStore from "../../../stores/CreatingProposalStore";
import {INFINITE_CALENDAR_BLUE_THEME} from "../../../constants/InfiniteCalendarConstants";

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const availability = CreatingProposalStore.availability;

    return {
        interfaceLanguage,
        availability
    };
}

@translate('ProposalsProjectAvailabilityDatesPage')
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
        this.onClick = this.onClick.bind(this);

        this.state = {
            showUI: true,
        };
    }


    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-project-availability');
    }

    topNavBarRightLinkClick() {
        this.context.router.push('/proposals-project-availability');
    }

    onSave(availability) {
        const proposal = {
            availability : availability,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
    }

    onClick(showUI) {
        this.setState({showUI: showUI});
    }

    render() {
        const {availability, interfaceLanguage, strings} = this.props;
        const canContinue = (!(availability.dynamic.length === 0 && availability.static.length === 0));

        return (
            <div className="views">
                <div className="view view-main proposals-project-availability-dates-view">
                    {this.state.showUI &&
                    <TopNavBar
                        background={canContinue ? '#63caff' : 'transparent'}
                        color={canContinue ? '#FFFFFF' : '#000'}
                        leftIcon={canContinue ? 'check' : ''}
                        rightIcon={'x'}
                        centerText={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    }
                    <div className="proposals-project-availability-dates-wrapper">
                        <AvailabilityEdit
                            theme={INFINITE_CALENDAR_BLUE_THEME}
                            color={'blue'} title={strings.title}
                            availability={availability}
                            interfaceLanguage={interfaceLanguage}
                            onSave={this.onSave}
                            onClick={this.onClick}/>
                    </div>
                </div>
            </div>
        );
    }
}

AvailabilityDatesPage.defaultProps = {
    strings: {
        publishProposal : 'Publish proposal',
        title           : 'What availability do you need for the project?'
    }
};