import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import CardUser from './../ui/CardUser';

export default class RecommendationUser extends Component {
    static propTypes = {
        recommendation: PropTypes.object.isRequired,
        last: PropTypes.bool.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let recommendation = this.props.recommendation;
        let last = this.props.last;
        return (
            <div className="recommendation">
                <CardUser username={recommendation.username} location={recommendation.location} canSendMessage={true} image={'http://www.tvchoicemagazine.co.uk/sites/default/files/imagecache/interview_image/intex/michael_emerson.png'} matching={Math.round(recommendation.similarity * 100)} liked={recommendation.like} hideLikeButton={false} />
            </div>
        );
    }
}
