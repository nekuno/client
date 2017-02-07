import React, { PropTypes, Component } from 'react';
import connectToStores from '../../utils/connectToStores';
import CardUser from '../ui/CardUser';
import selectn from 'selectn';
import ChatUserStatusStore from '../../stores/ChatUserStatusStore';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const onlineUserIds = ChatUserStatusStore.getOnlineUserIds() || {};

    return {
        onlineUserIds
    };
}

@connectToStores([ChatUserStatusStore], getState)
export default class CardUserList extends Component {

    static propTypes = {
        recommendations    : PropTypes.array.isRequired,
        userId             : PropTypes.number.isRequired,
        profile            : PropTypes.object.isRequired,
        handleSelectProfile: PropTypes.func.isRequired,
        onlineUserIds      : PropTypes.array.isRequired,
        similarityOrder    : PropTypes.bool
    };

    render() {
        const {recommendations, userId, profile, onlineUserIds, similarityOrder} = this.props;
        return (
            <div className="user-list">
                {recommendations.map((recommendation, index) =>
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
                        loggedUserId={userId}
                        profile={profile}
                        handleSelectProfile={this.props.handleSelectProfile}
                        online={onlineUserIds.some(id => id == recommendation.id)}
                        similarityOrder={similarityOrder}
                        slug={recommendation.slug ? recommendation.slug : encodeURI(recommendation.username.toLowerCase())}
                    />
                )}
            </div>
        );
    }

}
