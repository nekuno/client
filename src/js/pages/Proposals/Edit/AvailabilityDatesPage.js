import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";
import connectToStores from "../../../utils/connectToStores";
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import CreatingProposalStore from '../../../stores/CreatingProposalStore';
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import ProposalStore from "../../../stores/ProposalStore";
import '../../../../scss/pages/proposals/edit/type-page.scss';
import LocaleStore from "../../../stores/LocaleStore";
import AvailabilityEdit from "../../../components/Availability/AvailabilityEdit/AvailabilityEdit";
import {
    INFINITE_CALENDAR_BLUE_THEME,
    INFINITE_CALENDAR_GREEN_THEME, INFINITE_CALENDAR_PINK_THEME
} from "../../../constants/InfiniteCalendarConstants";

/**
 * Retrieves state from stores for current props.
 */
function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const proposal = CreatingProposalStore.proposal;
    const availability = proposal.availability ? proposal.availability : {'dynamic' : [], 'static' : []};

    return {
        proposal,
        interfaceLanguage,
        availability
    };
}

@AuthenticatedComponent
@translate('ProposalAvailabilityDatesEditPage')
@connectToStores([ProposalStore, CreatingProposalStore, LocaleStore], getState)
export default class ProposalAvailabilityDatesEditPage extends Component {

    static propTypes = {
        params           : PropTypes.shape({
            proposalId: PropTypes.string
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        proposal    : PropTypes.object,
        availability      : PropTypes.object,
        interfaceLanguage : PropTypes.string,
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            showUI: true,
        };

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    // componentWillMount() {
    // if (CreatingProposalStore.proposal.industry !== undefined) { // TODO: Not shows the selected industries
    //     this.setState({
    //         industry : CreatingProposalStore.proposal.industry,
    //     });
    // }
    // }

    topNavBarLeftLinkClick() {
        const {params} = this.props;

        if (params.proposalId) {
            this.context.router.push('/proposal-availability-edit/' + params.proposalId);
        } else {
            this.context.router.push('/proposal-availability-edit');
        }
    }

    topNavBarRightLinkClick() {
        const {params} = this.props;

        if (params.proposalId) {
            this.context.router.push('/proposal-availability-edit/' + params.proposalId);
        } else {
            this.context.router.push('/proposal-availability-edit');
        }
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

    getProposalColor() {
        let color;

        if (CreatingProposalStore.proposal.selectedType) {
            switch (CreatingProposalStore.proposal.selectedType) {
                case 'leisure':
                    color = 'pink';
                    break;
                case 'experience':
                    color = 'green';
                    break;
                default:
                    color = 'blue';
                    break;
            }
        } else {
            switch (CreatingProposalStore.proposal.type) {
                case 'sports':
                case 'hobbies':
                case 'games':
                    color = 'pink';
                    break;
                case 'shows':
                case 'restaurants':
                case 'plans':
                    color = 'green';
                    break;
                default:
                    color = 'blue';
                    break;
            }
        }

        return color;
    }

    getTheme() {
        let theme;

        switch (CreatingProposalStore.proposal.type) {
            case 'sports':
            case 'hobbies':
            case 'games':
                theme = INFINITE_CALENDAR_PINK_THEME;
                break;
            case 'shows':
            case 'restaurants':
            case 'plans':
                theme = INFINITE_CALENDAR_GREEN_THEME;
                break;
            default:
                theme = INFINITE_CALENDAR_BLUE_THEME;
                break;
        }

        return theme;
    }

    getHexadecimalColor() {
        let color;

        switch (CreatingProposalStore.proposal.type) {
            case 'sports':
            case 'hobbies':
            case 'games':
                color = '#D380D3';
                break;
            case 'shows':
            case 'restaurants':
            case 'plans':
                color = '#7bd47e';
                break;
            default:
                color = '#63caff';
                break;
        }

        return color;
    }

    render() {
        const {strings, proposal, availability, interfaceLanguage} = this.props;
        const canContinue = (!(availability.dynamic.length === 0 && availability.static.length === 0));

        return (
            <div className="views">
                <div className="view view-main proposals-project-availability-dates-view">
                    {this.state.showUI &&
                    <TopNavBar
                        background={canContinue ? this.getHexadecimalColor() : 'transparent'}
                        color={canContinue ? '#FFFFFF' : '#000'}
                        iconLeft={canContinue ? 'check' : ''}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    }
                    <div className="proposals-project-availability-dates-wrapper">
                        <AvailabilityEdit
                            theme={this.getTheme()}
                            color={this.getProposalColor()} title={strings.title}
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

ProposalAvailabilityDatesEditPage.defaultProps = {
    strings: {
        publishProposal : 'Publish proposal',
        title           : 'What availability do you need for the project?'
    }
};