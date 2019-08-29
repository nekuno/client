import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ProposalRecommendationList.scss';
import ReactSwipe from '../ReactSwipe';
import ProposalCard from "../../Proposal/ProposalCard";
import * as ProposalActionCreators from '../../../actions/ProposalActionCreators';
import CandidateCard from "../../Proposal/CandidateCard";
import translate from "../../../i18n/Translate";
import ProposalButton from '../ProposalButton/';

@translate('ProposalRecommendationList')
class ProposalRecommendationList extends Component {

    static propTypes = {
        recommendations: PropTypes.array.isRequired,
        // Injected by @translate:
        strings        : PropTypes.object,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {swiping: 0};

        this.likeCandidate = this.likeCandidate.bind(this);
        this.skipCandidate = this.skipCandidate.bind(this);
        this.goToCandidate = this.goToCandidate.bind(this);
        this.likeProposal = this.likeProposal.bind(this);
        this.skipProposal = this.skipProposal.bind(this);
        this.goToProposal = this.goToProposal.bind(this);
        this.swiping = this.swiping.bind(this);
        this.callback = this.callback.bind(this);
        this.onClick = this.onClick.bind(this);
        this.transitionEnd = this.transitionEnd.bind(this);
        this.likeButton = this.likeButton.bind(this);
        this.passButton = this.passButton.bind(this);
    }

    likeProposal() {
        const shownRecommendation = this.props.recommendations[0];
        const proposalId = shownRecommendation.proposal.id;
        ProposalActionCreators.interestProposal(proposalId);
    }

    likeCandidate() {
        const shownRecommendation = this.props.recommendations[0];
        const candidateId = shownRecommendation.id;
        const proposalId = shownRecommendation.proposal.id;
        const data = {candidateId, proposalId};
        ProposalActionCreators.acceptCandidate(data);
    }

    skipProposal() {
        const shownRecommendation = this.props.recommendations[0];
        const proposalId = shownRecommendation.proposal.id;
        ProposalActionCreators.skipProposal(proposalId);
    }

    skipCandidate() {
        const shownRecommendation = this.props.recommendations[0];
        const candidateId = shownRecommendation.id;
        const proposalId = shownRecommendation.proposal.id;
        const data = {candidateId, proposalId};
        ProposalActionCreators.skipCandidate(data);
    }

    renderCard(recommendation) {
        return recommendation.owner ?
            this.renderProposalCard(recommendation)
            :
            this.renderCandidateCard(recommendation)
    }

    renderProposalCard(recommendation) {
        return (
            <div key={recommendation.proposal.id}>
                <ProposalCard
                    proposal={recommendation.proposal}
                    user={recommendation.owner}
                    swiping={this.state.swiping}
                    like={(ev) => this.likeButton(ev)}
                    pass={(ev) => this.passButton(ev)}/>
            </div>);
    }

    renderCandidateCard(recommendation) {
        return (
            <div key={recommendation.id} onClick={this.goToCandidate}>
                <CandidateCard
                    proposal={recommendation.proposal}
                    user={recommendation}
                    swiping={this.state.swiping}
                    like={(ev) => this.likeButton(ev)}
                    pass={(ev) => this.passButton(ev)}/>
            </div>);
    }

    renderRecommendations(recommendations) {
        return ([
            <div className={styles.prev} key={'prev'}>1</div>,
            this.renderCard(recommendations[0]),
            <div className={styles.next} key={'next'}>2</div>
        ]);
    }

    callback() {
        const isProposal = this.props.recommendations[0].hasOwnProperty('owner');
        const isLiking = this.state.swiping < 0;
        const isSkipping = this.state.swiping > 0;

        if (isLiking) {
            if (isProposal) {
                this.likeProposal();
            } else {
                this.likeCandidate();
            }
        }
        if (isSkipping) {
            if (isProposal) {
                this.skipProposal();
            } else {
                this.skipCandidate();
            }
        }

        if (isLiking || isSkipping) {
            // this.state.swiper.slide(1, 0);
            this.setState({swiping: 0});
            // this.state.swiper.setup();
            this.forceUpdate();
        }
    }

    onClick() {
        const isProposal = this.props.recommendations[0].hasOwnProperty('owner');
        if (isProposal) {
            this.goToProposal();
        } else {
            this.goToCandidate();
        }
    }

    goToProposal() {
        const {recommendations} = this.props;

        const proposalId = recommendations[0].proposal.id;
        const slug = recommendations[0].owner.slug;
        const proposalLink = 'p/' + slug + '/proposal/' + proposalId;

        this.context.router.push(proposalLink);
    }

    goToCandidate() {
        const {recommendations} = this.props;

        const userId = recommendations[0].slug;
        const userLink = '/p/' + userId;

        this.context.router.push(userLink);
    }

    transitionEnd() {
        this.swiper.opacity = 1;
        this.setState({swiping: 0});
    }

    swiping(percentage) {
        this.swiper.opacity = Math.max(1 - (Math.abs(percentage)), 0);
        this.setState({swiping: percentage})
    }
    
    likeButton() {
        for (let i = 0; i > -1; i-=0.05) {
            this.swiping(i);
            this.transitionEnd();
        }
        
        const isProposal = this.props.recommendations[0].hasOwnProperty('owner');
        if (isProposal) {
            this.likeProposal();
        } else {
            this.likeCandidate();
        }
    }
    
    passButton() {
        for (let i = 0; i < 1; i+=0.05) {
            this.swiping(i);
            this.transitionEnd();
        }
        
        const isProposal = this.props.recommendations[0].hasOwnProperty('owner');
        if (isProposal) {
            this.skipProposal();
        } else {
            this.skipCandidate();
        }
    }

    render() {
        const {recommendations, strings} = this.props;

        const firstRecommendation = recommendations[0];

        return (
            <div className={styles.proposalRecommendationList}>
                <div onClick={this.goToCandidate}>
                    {firstRecommendation ?
                            <ReactSwipe
                                ref={el => (this.swiper = el)}
                                swipeOptions={{
                                    continuous   : true,
                                    speed        : 100,
                                    startSlide   : 1,
                                    swiping      : this.swiping,
                                    callback     : this.callback,
                                    transitionEnd: this.transitionEnd,
                                    clicking     : this.onClick,
                                }}
                                childCount={recommendations.length}>
                                {this.renderRecommendations(recommendations)}
                            </ReactSwipe>
                        :
                        <div className={styles.empty}>
                            {strings.empty}
                        </div>
                    }
                </div>
            </div>
        );
    }
}


ProposalRecommendationList.defaultProps = {
    strings: {
        empty: 'You explored all Nekuno! Make some new proposals or go to the persons section at the bottom.',
    }
};

export default ProposalRecommendationList;
