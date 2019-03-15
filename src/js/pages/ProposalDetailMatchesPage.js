import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/proposal-detail.scss';
import ProposalStore from "../stores/ProposalStore";
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import ProfileStore from "../stores/ProfileStore";
import TagSuggestionsStore from "../stores/TagSuggestionsStore";
import SelectCollapsible from "../components/ui/SelectCollapsible/SelectCollapsible";
import InfiniteScroll from "../components/Scroll/InfiniteScroll";
import CardUser from "../components/OtherUser/CardUser/CardUser";
import * as ThreadActionCreators from "../actions/ThreadActionCreators";
import ThreadStore from "../stores/ThreadStore";

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    ProposalActionCreators.requestOwnProposals();
}

function getState(props) {
    const proposalId = props.params.proposalId;
    const proposal = ProposalStore.getOwnProposal(proposalId);

    const metadata = ProfileStore.getMetadata();
    const industryChoices = metadata && metadata.industry ? metadata.industry.choices : [];

    const isLoadingThread = ThreadStore.isRequesting();


    return {
        proposal,
        industryChoices,
        isLoadingThread,
    };
}

@AuthenticatedComponent
@translate('ProposalDetailMatchesPage')
@connectToStores([ProposalStore, ProfileStore, TagSuggestionsStore, ThreadStore], getState)
export default class ProposalDetailMatchesPage extends Component {

    static propTypes = {
        params           : PropTypes.shape({
            proposalId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        proposal    : PropTypes.object,
        industryChoices : PropTypes.array,

        // networks    : PropTypes.array.isRequired,
        // error       : PropTypes.bool,
        // isLoading   : PropTypes.bool,
        // ownProposals: PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.onBottomScroll = this.onBottomScroll.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentDidMount() {
        requestData(this.props);
    }

    topNavBarLeftLinkClick() {
        const {params} = this.props;

        this.context.router.push(`/proposal/` + params.proposalId);
    }

    handleSearch(value) {
        // TODO: Call endpoint for filtering users by name
    }

    handleChangeOrder(order) {
        // TODO: Call endpoint for new order
    }

    onBottomScroll() {
        const {thread, recommendationUrl, isLoadingRecommendations, isLoadingThread, isInitialRequest} = this.props;
        const threadId = parseThreadId(thread);
        if (threadId && recommendationUrl && !isInitialRequest && !isLoadingRecommendations && !isLoadingThread) {
            return ThreadActionCreators.requestRecommendations(threadId, recommendationUrl);
        } else {
            return Promise.resolve();
        }
    }

    getItemHeight = function() {
        const iW = window.innerWidth;
        const photoHeight = iW >= 480 ? 230.39 : iW / 2 - 4 * iW / 100;
        const bottomHeight = 137;

        return photoHeight + bottomHeight;
    };

    onResize() {
        this.setState({itemHeight: this.getItemHeight()});
    }

    render() {
        const {params, user, strings, proposal, isLoadingThread} = this.props;

        const orderOptions = [
            {
                id: 'compatibility',
                text: strings.compatibility
            },
            {
                id: 'similarity',
                text: strings.similarity
            },
            {
                id: 'coincidences',
                text: strings.coincidences
            }
        ];

        console.log(proposal);

        return (
            <div className="views">
                <div className="view view-main persons-all-view">
                    <TopNavBar
                        textCenter={strings.title}
                        textSize={'small'}
                        iconLeft={'arrow-left'}
                        boxShadow={true}
                        searchInput={true}
                        onSearchChange={this.handleSearch}
                        onLeftLinkClickHandler={this.onLeftLinkClickHandler}>
                        <SelectCollapsible options={orderOptions} selected={'compatibility'} title={strings.orderedBy + ' ' + 'compatibility'} onClickHandler={this.handleChangeOrder}/>
                    </TopNavBar>
                    <div id="scroll-wrapper" className="persons-all-wrapper">
                        <div id="persons" className="persons">
                            {proposal && proposal.matches && proposal.matches.length > 0 ?
                                <InfiniteScroll
                                    items={proposal.matches.map((item, index) =>
                                        <div key={index} className="person">
                                            <CardUser {...item} size="small"/>
                                        </div>
                                    )}
                                    itemHeight={this.getItemHeight()}
                                    onResize={this.onResize}
                                    columns={2}
                                    onInfiniteLoad={this.onBottomScroll}
                                    containerId="scroll-wrapper"
                                    loading={isLoadingThread}
                                />
                                : null
                            }

                        </div>
                    </div>
                    {/*<div className="filters-button">*/}
                        {/*<div className="filters-button-fixed">*/}
                            {/*<RoundedIcon icon={'filter'} size={'large'} background={'#928BFF'} fontSize={'35px'} onClickHandler={this.goToPersonsFilters}/>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }

}

ProposalDetailMatchesPage.defaultProps = {
    strings: {
        topNavBarText: 'People Nekuno',
        orderedBy    : 'Ordered by',
        compatibility: 'compatibility',
        similarity   : 'similarity',
        coincidences : 'coincidences'
    }
};