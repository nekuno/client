import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals/experience/introduction.scss';
import Overlay from "../../../components/ui/Overlay/Overlay";
import CreatingProposalStore from "../../../stores/CreatingProposalStore";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";

@translate('ProposalsExperienceIntroductionPage')
export default class IntroductionPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings  : PropTypes.object,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals');
    }

    topNavBarRightLinkClick() {
        CreatingProposalStore.proposal.selectedType = 'experience';
        this.context.router.push('/proposal-basic-edit');
    }

    render() {
        const {strings} = this.props;

        ProposalActionCreators.cleanCreatingProposal();

        return (
            <div className="views">
                <div className="view view-main proposals-experience-introduction-view">
                    <Overlay/>
                    <TopNavBar
                        background={'transparent'}
                        color={'white'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        position={'absolute'}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarLeftLinkClick}/>
                    <div className="proposals-introduction-wrapper">
                        <div className="image-wrapper">
                            <img src="/img/proposals/Trabajo.png"/>
                        </div>
                        <h1>{strings.title}</h1>
                        <div className="resume">{strings.resume}</div>

                        <div className="skip-wrapper-center small" onClick={this.topNavBarRightLinkClick}>
                            <span className="skip-text">{strings.doProposal}&nbsp;</span>
                        </div>

                        {/*<div className="skip-wrapper small" onClick={this.topNavBarRightLinkClick}>*/}
                            {/*<span className="skip-text">{strings.doProposal}&nbsp;</span>*/}
                            {/*<span className="icon-arrow-right" />*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        );
    }

}

IntroductionPage.defaultProps = {
    strings: {
        publishProposal: 'Publish proposal',
        title: 'Do your experience proposal',
        resume: 'Publish that experience or activity that you have in mind and we will find related people to carry it out.',
        doProposal: 'Create proposal'
    }
};
