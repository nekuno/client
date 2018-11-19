import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals-project-introduction.scss';
import Overlay from "../../../components/ui/Overlay/Overlay";
import Button from "../../../components/ui/Button/Button";

@translate('ProposalsProjectIntroductionPage')
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
        this.context.router.push('/proposals-project-basic');
    }

    render() {
        const {strings} = this.props;

        return (
            <div className="views">
                <div className="view view-main proposals-introduction-view">
                    <Overlay/>
                    <TopNavBar
                        background={'transparent'}
                        color={'white'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        position={'absolute'}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-introduction-wrapper">
                        <div className="image-wrapper">
                            <img src="/img/proposals/Trabajo.png"/>
                        </div>
                        <h1>{strings.title}</h1>
                        <div className="resume">{strings.resume}</div>
                        <Button onClickHandler={this.topNavBarRightLinkClick}>{strings.doProposal}</Button>
                    </div>
                </div>
            </div>
        );
    }

}

IntroductionPage.defaultProps = {
    strings: {
        publishProposal: 'Publish proposal',
        title: 'Do your proposal for a project',
        resume: 'Publish that idea or project that you have in mind and we will find related people to carry it out.',
        doProposal: 'Create proposal'
    }
};
