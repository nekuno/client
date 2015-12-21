import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import CardUser from './../ui/CardUser';

export default class RecommendationUser extends Component {
    static propTypes = {
        recommendation: PropTypes.object.isRequired,
        last: PropTypes.bool.isRequired,
        accessibleKey: PropTypes.number.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let recommendation = this.props.recommendation;
        let last = this.props.last;
        let key = this.props.accessibleKey;
        return (
            <div className="swiper-slide">
                <div className={'recommendation recommendation-' + key}>
                    <CardUser username={recommendation.username} location={recommendation.location} canSendMessage={true} picture={recommendation.picture} matching={Math.round(recommendation.similarity * 100)} liked={recommendation.like == true} hideLikeButton={false} />
                </div>
            </div>
        );
    }
}
