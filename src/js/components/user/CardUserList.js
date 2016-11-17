import React, { PropTypes, Component } from 'react';
import CardUser from '../ui/CardUser';

export default class CardUserList extends Component {

    static propTypes = {
        recommendations: PropTypes.array.isRequired,
        userId         : PropTypes.number.isRequired
    };

    render() {
        const {recommendations, userId} = this.props;
        return (
            <div className="user-list">
                {recommendations.map((recommendation, index) =>
                    <CardUser
                        key={index}
                        userId={recommendation.id}
                        username={recommendation.username}
                        location={recommendation.location.locality}
                        canSendMessage={true}
                        photo={recommendation.photo}
                        matching={Math.round(recommendation.similarity * 100)}
                        like={recommendation.like}
                        hideLikeButton={false}
                        loggedUserId={userId}
                    />
                )}
            </div>
        );
    }

}
