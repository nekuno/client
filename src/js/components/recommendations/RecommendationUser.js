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
        return (
            <div className="swiper-slide">
                <div className={'recommendation recommendation-' + key}>
                    <CardUser
                        loggedUserId={this.props.userId}
                        userId={recommendation.id}
                        username={recommendation.username}
                        location={recommendation.location}
                        canSendMessage={true}
                        photo={recommendation.photo}
                        matching={Math.round(recommendation.similarity * 100)}
                        like={recommendation.like}
                        hideLikeButton={false}
                    />
                </div>
            </div>
        );
    }
}
