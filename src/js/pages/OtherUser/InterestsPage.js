import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './AboutMePage.scss';
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

        console.log('url');
        console.log(requestComparedInterestsUrl);
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
    const showOnlyCommon = InterestStore.getShowOnlyCommon(otherUserId);
    const requestComparedInterestsUrl = InterestStore.getRequestComparedInterestsUrl(otherUserId);

    return {
        pagination,
        totals,
        interests,
        noInterests,
        isLoadingComparedInterests,
        otherUser,
        type,
        showOnlyCommon,
        requestInterestsUrl: requestComparedInterestsUrl
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

    componentDidMount() {
        requestData(this.props);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        const {otherUser, type, user} = this.props;

        const otherUserChanged = parseId(prevProps.otherUser) !== parseId(otherUser);
        const typeChanged = prevProps.type !== type;

        if (otherUserChanged || typeChanged) {
            const otherUserId = parseId(otherUser);
            const userId = parseId(user);

            InterestsActionCreators.requestComparedInterests(userId, otherUserId, this.props.requestInterestsUrl);
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

    render() {
        const {strings, interests, isLoadingComparedInterests, noInterests} = this.props;
        return (
            <div className="views">
                <div className="view other-user-proposals-view">
                    <div className={styles.topNavBar}>
                        <TopNavBar
                            background={'transparent'}
                            iconLeft={'arrow-left'}
                            textCenter={strings.topNavBarText}
                        />
                    </div>

                    {noInterests ? '' :
                        <CardContentList contents={interests}
                                         onBottomScroll={this.onBottomScroll.bind(this)} isLoading={isLoadingComparedInterests}/>
                    }

                </div>
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