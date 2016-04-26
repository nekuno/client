import React, { PropTypes, Component } from 'react';
import CardUser from './../ui/CardUser';

export default class RecommendationUser extends Component {
    static propTypes = {
        recommendation: PropTypes.object.isRequired,
        accessibleKey : PropTypes.number.isRequired,
        userId        : PropTypes.number.isRequired
    };

    render() {
        let recommendation = this.props.recommendation;
        let key = this.props.accessibleKey;
        let liked = recommendation.like == true;
        return (
            <div className="swiper-slide">
                <div className={'recommendation recommendation-' + key}>
                    <CardUser
                        loggedUserId={this.props.userId}
                        userId={recommendation.id}
                        username={recommendation.username}
                        location={recommendation.location}
                        canSendMessage={true}
                        picture={recommendation.picture}
                        matching={Math.round(recommendation.similarity * 100)}
                        liked={liked}
                        hideLikeButton={false}
                    />
                </div>
            </div>
        );
    }
}
