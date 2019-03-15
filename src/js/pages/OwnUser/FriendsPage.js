import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './FriendsPage.scss';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import AuthenticatedComponent from '../../components/AuthenticatedComponent';
import * as UserActionCreators from '../../actions/UserActionCreators';
import SelectCollapsible from '../../components/ui/SelectCollapsible/SelectCollapsible.js';
import InfiniteScroll from "../../components/Scroll/InfiniteScroll";
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import CardUser from '../../components/OtherUser/CardUser/CardUser.js';
import '../../../scss/pages/persons-all.scss';
import FriendStore from "../../stores/FriendStore";
import OwnUserBottomNavBar from "../../components/ui/OwnUserBottomNavBar/OwnUserBottomNavBar";

function parseId(user) {
    return user.id;
}

function requestData(props) {

    UserActionCreators.requestFriends();
}

function getState(props) {

    const friends = FriendStore.friends;
    const order = FriendStore.order;
    const loading = FriendStore.loading;

    return {
        order,
        friends,
        loading
    };
}

@AuthenticatedComponent
@translate('FriendsPage')
@connectToStores([FriendStore], getState)
export default class FriendsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        friends: PropTypes.array.isRequired,
        order  : PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleSearch = this.handleSearch.bind(this);
        // this.goToPersonsFilters = this.goToPersonsFilters.bind(this);
        // this.onBottomScroll = this.onBottomScroll.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
    }

    handleSearch(value) {
        // TODO: Call endpoint for filtering users by name
    }

    handleChangeOrder(order) {
        UserActionCreators.changeFriendsOrder(order);
    }

    // onBottomScroll() {
    //     const {thread, recommendationUrl, isLoadingRecommendations, isLoadingThread, isInitialRequest} = this.props;
    //     const threadId = parseThreadId(thread);
    //     if (threadId && recommendationUrl && !isInitialRequest && !isLoadingRecommendations && !isLoadingThread) {
    //         return ThreadActionCreators.requestRecommendations(threadId, recommendationUrl);
    //     } else {
    //         return Promise.resolve();
    //     }
    // }

    getItemHeight = function() {
        const iW = window.innerWidth;
        const photoHeight = iW >= 480 ? 230.39 : iW / 2 - 4 * iW / 100;
        const bottomHeight = 137;

        return photoHeight + bottomHeight;
    };

    onResize() {
        this.setState({itemHeight: this.getItemHeight()});
    }

    // goToPersonsFilters() {
    //     const {thread} = this.props;
    //     const threadId = parseThreadId(thread);
    //
    //     this.context.router.push(`/persons-filter/${threadId}`);
    // }

    render() {
        const {order, friends, loading, strings} = this.props;
        const orderOptions = [
            {
                id  : 'compatibility',
                text: strings.compatibility
            },
            {
                id  : 'similarity',
                text: strings.similarity
            },
            {
                id  : 'coincidences',
                text: strings.coincidences
            }
        ];

        return (
            <div className="views">
                <div className={styles.view}>
                    <div className={styles.topNavBar}>
                        <TopNavBar textCenter={strings.title} textSize={'small'} iconLeft={'arrow-left'} boxShadow={true} searchInput={true} onSearchChange={this.handleSearch}/>
                    </div>
                    <SelectCollapsible options={orderOptions} selected={order} title={strings.orderedBy + ' ' + strings[order].toLowerCase()} onClickSelectCollapsible={this.handleChangeOrder}/>
                    <div id="scroll-wrapper" className={styles.scrollWrapper}>
                        {friends.length > 0 ?
                            <InfiniteScroll
                                items={friends.map((friend, index) =>
                                        <CardUser key={index} {...friend} size="small"/>
                                )}
                                itemHeight={this.getItemHeight()}
                                onResize={this.onResize}
                                columns={2}
                                onInfiniteLoad={this.onBottomScroll}
                                containerId="scroll-wrapper"
                                loading={loading}
                            />
                            : null
                        }

                    </div>
                </div>
                <div className={styles.navbarWrapper}>
                    <OwnUserBottomNavBar current={'friends'}/>
                </div>
            </div>
        );
    }

}

FriendsPage.defaultProps = {
    strings: {
        title        : 'My friends',
        orderedBy    : 'Ordered by',
        compatibility: 'compatibility',
        similarity   : 'similarity',
        coincidences : 'coincidences'
    },
    order  : 'compatibility',
    friends: [],
    loading: false,
};