import React, { PropTypes, Component } from 'react';
import CardContent from './../ui/CardContent';

export default class RecommendationContent extends Component {
    static propTypes = {
        recommendation: PropTypes.object.isRequired,
        accessibleKey : PropTypes.number.isRequired,
        rate          : PropTypes.string
    };

    render() {
        let recommendation = this.props.recommendation;
        let content = recommendation.content;
        let rate = this.props.recommendation.rate ? true : false;
        let key = this.props.accessibleKey;

        return (
            <div className="swiper-slide">
                <div className={'recommendation recommendation-' + key}>
                    <CardContent loggedUserId={this.props.userId} contentId={content.id} title={content.title} description={content.description} types={recommendation.types} url={content.url} embed_id={content.embed_id} matching={Math.round(recommendation.match * 100)} rate={rate}
                                 embed_type={content.embed_type} synonymous={recommendation.synonymous} thumbnail={content.thumbnail} hideLikeButton={false}/>
                </div>
            </div>
        );
    }
}
