import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/proposals-project-preview.scss';
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import RoundedIcon from "../components/ui/RoundedIcon/RoundedIcon";
import CreatingProposalStore from "../stores/CreatingProposalStore";
import connectToStores from "../utils/connectToStores";

const proposal = {
    'title'               : 'Campaña contra los residuos de plástico',
    'category'            : 'Proyecto',
    'description'         : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ',
    'professional-sectors': 'internet, design, marketing',
    'habilities'          : 'creativity, motivation',
    'availability'        : {
        'monday' : 'morning',
        'tuesday': 'morning and night'
    },

};

function getState() {
    const proposal = CreatingProposalStore.proposal;
    const title = proposal.title;
    const description = proposal.description;

    return {
        title,
        description,
    };
}

@translate('ProposalsProjectPreviewPage')
@connectToStores([CreatingProposalStore], getState)
export default class ProposalsProjectPreviewPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings    : PropTypes.object,
        canContinue: PropTypes.bool,
        title      : PropTypes.string,
        description: PropTypes.string,
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

    componentWillMount() {
        // console.log(CreatingProposalStore.proposal);
        // if (CreatingProposalStore.proposal) {
        //     this.setState({
        //         title : CreatingProposalStore.proposal.title,
        //         description: CreatingProposalStore.proposal.description,
        //     });
        // }
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
        const {strings, title, description} = this.props;

        return (
            <div className="views">
                <div className="view view-main proposals-project-preview-view">
                    <TopNavBar
                        position={'absolute'}
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'edit'}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-preview-wrapper">
                        <div className={'image-wrapper'}>
                            <img src={'https://via.placeholder.com/480x240'}/>
                            <h2 className={'bottom-left'}>{title}</h2>
                        </div>
                        <div className={'content-wrapper'}>
                            <p className={'category'}>{proposal.category}</p>
                            <p>{description}</p>

                            <div className={'information-wrapper'}>
                                <div className={'rounded-icon-wrapper'}>
                                    <RoundedIcon
                                        icon={'briefcase'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FBFCFD'}
                                        border={'1px solid #F0F1FA'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>Sectores</div>
                                    <div className={'resume small'}>Internet, Diseño, Marketing</div>
                                </div>
                            </div>

                            <div className={'information-wrapper'}>
                                <div className={'rounded-icon-wrapper'}>
                                    <RoundedIcon
                                        icon={'briefcase'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FBFCFD'}
                                        border={'1px solid #F0F1FA'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>Sectores</div>
                                    <div className={'resume small'}>Internet, Diseño, Marketing</div>
                                </div>
                            </div>

                            <div className={'information-wrapper'}>
                                <div className={'rounded-icon-wrapper'}>
                                    <RoundedIcon
                                        icon={'briefcase'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FBFCFD'}
                                        border={'1px solid #F0F1FA'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>Disponibilidad</div>
                                    <div className={'resume small'}>Lunes Mañana</div>
                                    <div className={'resume small'}>Lunes Mañana y noche</div>
                                </div>
                            </div>

                            <div className={'information-wrapper'}>
                                <div className={'rounded-icon-wrapper'}>
                                    <RoundedIcon
                                        icon={'briefcase'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FBFCFD'}
                                        border={'1px solid #F0F1FA'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>Sectores</div>
                                    <div className={'resume small'}>Internet, Diseño, Marketing</div>
                                </div>
                            </div>

                        </div>
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