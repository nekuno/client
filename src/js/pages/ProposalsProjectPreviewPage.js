import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/proposals-project-preview.scss';
import * as ProposalActionCreators from "../actions/ProposalActionCreators";

const proposal = {
    'title'               : 'Campaña contra los residuos de plástico',
    'category'            : 'Proyecto',
    'description'         : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    'professional-sectors': 'internet, design, marketing',
    'habilities'          : 'creativity, motivation',
    'availability'        : {
        'monday' : 'morning',
        'tuesday': 'morning and night'
    },

};

@translate('ProposalsProjectPreviewPage')
export default class ProposalsProjectPreviewPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings  : PropTypes.object,
        canContinue : PropTypes.bool,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleResumeChange = this.handleResumeChange.bind(this);
        this.handleStepsBar = this.handleStepsBar.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
    }

    handleTitleChange(event) {
        this.setState({title: event});
    }

    handleResumeChange(event) {
        this.setState({resume: event});
    }

    handleStepsBar(event) {
        const proposal = {
            title: this.state.title,
            description: this.state.resume,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-project-professional');
    }

    topNavBarRightLinkClick() {
        this.context.router.push('/proposals');
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-project-introduction');
    }

    render() {
        const {strings} = this.props;

        return (
            <div className="views">
                <div className="view view-main proposals-project-preview-view">
                    <TopNavBar position={'absolute'} background={'transparent'} iconLeft={'arrow-left'} textSize={'small'} onLeftLinkClickHandler={this.topNavBarLeftLinkClick} onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-preview-wrapper">
                        <div className={'image-wrapper'}>
                            <img src={'https://via.placeholder.com/480x240'}/>
                        </div>
                        <h2>{proposal.title}</h2>
                        <p>{proposal.category}</p>
                        <p>{proposal.description}</p>
                    </div>
                </div>
            </div>
        );
    }

}

ProposalsProjectPreviewPage.defaultProps = {
    strings: {

    }
};