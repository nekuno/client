import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals/leisure/introduction.scss';
import Button from "../../../components/ui/Button/Button";
import Overlay from "../../../components/ui/Overlay/Overlay";

@translate('ProposalsLeisureIntroductionPage')
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
        this.context.router.push('/proposals-leisure-basic');
    }

    render() {
        const {strings} = this.props;

        return (
            <div className="views">
                <div className="view view-main proposals-leisure-introduction-view">
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
        title: 'Do your leisure proposal',
        resume: 'Publish that hobbie or activity that you have in mind and we will find related people to carry it out.',
        doProposal: 'Create proposal'
    }
};
