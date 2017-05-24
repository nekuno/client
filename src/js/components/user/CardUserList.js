import React, { PropTypes, Component } from 'react';
import connectToStores from '../../utils/connectToStores';
import AuthenticatedComponent from '../AuthenticatedComponent';
import CardUser from '../ui/CardUser';
import selectn from 'selectn';
import ChatUserStatusStore from '../../stores/ChatUserStatusStore';
import InfiniteScroll from "../scroll/InfiniteScroll";
import QuestionsBanner from '../questions/QuestionsBanner';
import SocialNetworksBanner from '../socialNetworks/SocialNetworksBanner';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const onlineUserIds = ChatUserStatusStore.getOnlineUserIds() || {};

    return {
        onlineUserIds
    };
}

@AuthenticatedComponent
@connectToStores([ChatUserStatusStore], getState)
export default class CardUserList extends Component {

    static propTypes = {
        recommendations             : PropTypes.array.isRequired,
        user                        : PropTypes.object.isRequired,
        profile                     : PropTypes.object.isRequired,
        handleSelectProfile         : PropTypes.func.isRequired,
        onBottomScroll              : PropTypes.func,
        onlineUserIds               : PropTypes.array.isRequired,
        similarityOrder             : PropTypes.bool,
        mustShowQuestionsBanner     : PropTypes.bool,
        mustShowSocialNetworksBanner: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.getItems = this.getItems.bind(this);
        this.renderCards = this.renderCards.bind(this);
    }

    getItems() {
        const {mustShowSocialNetworksBanner, mustShowQuestionsBanner, user, pagination, networks} = this.props;
        const banner =
            mustShowQuestionsBanner ? <QuestionsBanner user={user} questionsTotal={pagination.total || 0}/>
                : mustShowSocialNetworksBanner ? <SocialNetworksBanner networks={networks} user={user}/>
                : '';

        const cards = this.renderCards();
        return [banner, ...cards];
    }

    renderCards() {
        const {recommendations, user, profile, onlineUserIds, similarityOrder, handleSelectProfile} = this.props;

        return recommendations.map((recommendation, index) =>
            <CardUser
                key={index}
                userId={recommendation.id}
                username={recommendation.username}
                location={selectn('profile.location.locality', recommendation) || selectn('profile.location.country', recommendation) || ''}
                canSendMessage={true}
                photo={recommendation.photo}
                matching={Math.round(recommendation.matching * 100)}
                similarity={Math.round(recommendation.similarity * 100)}
                age={recommendation.age}
                like={recommendation.like}
                hideLikeButton={false}
                loggedUserId={user.id}
                profile={profile}
                handleSelectProfile={handleSelectProfile}
                online={onlineUserIds.some(id => id == recommendation.id)}
                similarityOrder={similarityOrder}
                slug={recommendation.slug}
            />
        )
    }

    render() {
        return (
            <div className="user-list" id="user-list">
                <InfiniteScroll
                    list={this.getItems()}
                    // preloadAdditionalHeight={window.innerHeight*2}
                    // useWindowAsScrollContainer
                    onInfiniteLoad={this.props.onBottomScroll}
                    scrollContainer={document.getElementById("discover-view-main")}
                />
            </div>
        );
    }

}
