import React, { PropTypes, Component } from 'react';
import connectToStores from '../../utils/connectToStores';
import AuthenticatedComponent from '../AuthenticatedComponent';
import CardUser from '../ui/CardUser';
import selectn from 'selectn';
import ChatUserStatusStore from '../../stores/ChatUserStatusStore';
import InfiniteScroll from "../scroll/InfiniteScroll";

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
        recommendations    : PropTypes.array.isRequired,
        user               : PropTypes.object.isRequired,
        profile            : PropTypes.object.isRequired,
        handleSelectProfile: PropTypes.func.isRequired,
        onBottomScroll     : PropTypes.func,
        similarityOrder    : PropTypes.bool,
        isLoading          : PropTypes.bool,
        //Injected by connectToStores
        onlineUserIds      : PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.getItems = this.getItems.bind(this);
        this.getCardUsers = this.getCardUsers.bind(this);
    }

    getItems() {
        const firstItems = this.props.firstItems;
        const cards = this.getCardUsers();
        return [
            ...firstItems,
            ...cards
        ];
    }

    buildCardWrapper(card1, card2) {
        let cards = [Object.assign({}, card1)];
        if (card2 instanceof Object) {
            cards.push(Object.assign({}, card2));
        }

        const wrapper = <div>
            {cards}
        </div>;

        card1 = null;

        return wrapper;
    }

    buildCardUser(recommendation, index) {
        const {user, profile, onlineUserIds, similarityOrder, handleSelectProfile} = this.props;

        return <CardUser
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
    }

    getCardUsers() {
        let savedCard = null;
        let userComponents = [];

        this.props.recommendations.forEach((recommendation, index) => {
            let thisCard = this.buildCardUser.bind(this)(recommendation, index);

            if (savedCard === null) {
                savedCard = thisCard;
            } else {
                userComponents.push(this.buildCardWrapper(savedCard, thisCard));
                savedCard = null;
            }
        });

        if (savedCard !== null) {
            userComponents.push(this.buildCardWrapper(savedCard));
            savedCard = null;
        }

        return userComponents;
    }

    render() {
        return (
            <div className="user-list" id="user-list">
                <InfiniteScroll
                    list={this.getItems()}
                    // preloadAdditionalHeight={window.innerHeight*2}
                    // useWindowAsScrollContainer
                    onInfiniteLoad={this.props.onBottomScroll}
                    containerId="discover-view-main"
                    loading={this.props.isLoading}
                />
            </div>
        );
    }

}
