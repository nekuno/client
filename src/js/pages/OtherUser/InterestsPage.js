import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './InterestsPage.scss';
import '../../../scss/pages/other-user/proposals.scss';
import translate from '../../i18n/Translate';
import connectToStores from "../../utils/connectToStores";
import AuthenticatedComponent from "../../components/AuthenticatedComponent";
import MatchingStore from "../../stores/MatchingStore";
import SimilarityStore from "../../stores/SimilarityStore";
import InterestStore from "../../stores/InterestStore";
import UserStore from "../../stores/UserStore";
import * as UserActionCreators from "../../actions/UserActionCreators";
import * as InterestsActionCreators from "../../actions/InterestsActionCreators";
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import CardContentList from '../../components/interests/CardContentList';
import OtherUserBottomNavBar from "../../components/ui/OtherUserBottomNavBar/OtherUserBottomNavBar";
import SelectCollapsibleInterest from "../../components/ui/SelectCollapsibleInterest/SelectCollapsibleInterest";
import RouterStore from '../../stores/RouterStore';

function parseId(user) {
    return user ? user.id : null;
}

function requestData(props) {
    const {params} = props;
    const otherUserSlug = params.slug;

    UserActionCreators.requestUser(otherUserSlug, ['username', 'photo']).then(() => {
        const userId = parseId(props.user);
        const otherUser = UserStore.getBySlug(otherUserSlug);
        const otherUserId = parseId(otherUser);
        const requestComparedInterestsUrl = InterestStore.getRequestComparedInterestsUrl(otherUserId);

        InterestsActionCreators.requestComparedInterests(userId, otherUserId, requestComparedInterestsUrl);
    });
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const otherUserSlug = props.params.slug;
    const otherUser = UserStore.getBySlug(otherUserSlug);
    const otherUserId = otherUser ? parseId(otherUser) : null;
    const pagination = otherUserId ? InterestStore.getPagination(otherUserId) || {} : {};
    const totals = otherUserId ? InterestStore.getTotals(otherUserId) || {} : {};
    const interests = otherUserId ? InterestStore.get(otherUserId) || [] : [];
    const noInterests = otherUserId ? InterestStore.noInterests(otherUserId) || false : null;
    const isLoadingComparedInterests = InterestStore.isLoadingComparedInterests();
    const type = InterestStore.getType(otherUserId);
    const requestComparedInterestsUrl = InterestStore.getRequestComparedInterestsUrl(otherUserId);

    const routes = RouterStore._routes;

    return {
        pagination,
        totals,
        interests,
        noInterests,
        isLoadingComparedInterests,
        otherUser,
        type,
        requestComparedInterestsUrl,
        routes
    };
}

@AuthenticatedComponent
@translate('OtherUserInterestsPage')
@connectToStores([UserStore, MatchingStore, SimilarityStore, InterestStore], getState)
export default class InterestsPage extends Component {

    static propTypes = {
        params : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }).isRequired,        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        routes   : PropTypes.array,
        // isLoading  : PropTypes.bool.isRequired,
        // matching   : PropTypes.number,
        // similarity : PropTypes.number,
        // username   : PropTypes.string,
        // location   : PropTypes.string,
        // age        : PropTypes.string,
        // photos     : PropTypes.array,
        // liked      : PropTypes.bool,
        // ownUserSlug: PropTypes.string,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {

        super(props);

        this.changeType = this.changeType.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        const {otherUser, type, user, requestComparedInterestsUrl} = this.props;

        const otherUserChanged = parseId(prevProps.otherUser) !== parseId(otherUser);
        const typeChanged = prevProps.type !== type;

        if (otherUserChanged || typeChanged) {
            const otherUserId = parseId(otherUser);
            const userId = parseId(user);

            InterestsActionCreators.requestComparedInterests(userId, otherUserId, requestComparedInterestsUrl);
        }
    }

    getPhotos(photos) {
        return photos.map((photo) => {
            // return <img src={photo.url} alt={'photo'}/>
            return photo.url
        })
    }

    onBottomScroll() {
        const {user, otherUser, requestComparedInterestsUrl} = this.props;
        const userId = user ? parseId(user) : null;
        const otherUserId = otherUser ? parseId(otherUser) : null;
        if (userId && otherUserId && requestComparedInterestsUrl) {
            InterestsActionCreators.requestComparedInterests(userId, otherUserId, requestComparedInterestsUrl);
        }
    }

    changeType(newType) {
        const {type, otherUser} = this.props;

        if (type !== newType) {
            InterestsActionCreators.setType(newType, otherUser.id);
        } else {
            InterestsActionCreators.removeType(otherUser.id);
        }
    }

    goBack(routes) {
        const regex = /^(\/p\/.*)*(\/networks)*(\/friends)*(\/answers)*(\/interests)*$/
        const next = routes.reverse().find((route) => {
            return !regex.test(route)
        })

        this.context.router.push(next || '');
    }

    render() {
        const {strings, interests, isLoadingComparedInterests, noInterests, params, type, otherUser, routes} = this.props;
        const topNavBarText = otherUser ? strings.topNavBarText.replace('%username%', otherUser.username) : strings.topNavBarText.replace('%username%', params.slug);
        return (
            <div className="views">
                <div className={styles.topNavBar}>
                    <TopNavBar
                        background={'transparent'}
                        iconLeft="arrow-left"
                        onLeftLinkClickHandler={() => this.goBack(routes)}
                        textCenter={topNavBarText}
                    />
                </div>
                <div className={styles.view}>
                    <div className={styles.collapsible}>
                        <SelectCollapsibleInterest selected={type} onClickSelectCollapsible={this.changeType}/>
                    </div>

                    {noInterests ? ''
                        :
                        <div className={styles.cardContentList} id="other-user-interests-view">
                            <CardContentList contents={interests} scrollContainerId='other-user-interests-view'
                                             onBottomScroll={this.onBottomScroll.bind(this)} isLoading={isLoadingComparedInterests}/>
                        </div>
                    }
                </div>
                <OtherUserBottomNavBar current={'interests'} userSlug={params.slug}/>

            </div>
        );
    }
}

InterestsPage.defaultProps = {
    strings: {
        orderBy      : 'Order by Experiences',
        topNavBarText: 'Interests'
    }
};