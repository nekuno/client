import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CardContent from './../ui/CardContent';

export default class RecommendationContent extends Component {
    static propTypes = {
        recommendation: PropTypes.object.isRequired,
        accessibleKey : PropTypes.number.isRequired
    };

    render() {
        let recommendation = this.props.recommendation;
        let content = recommendation.content;
        let key = this.props.accessibleKey;

        return (
            <div className="swiper-slide">
                <div className={'recommendation recommendation-' + key}>
                    <CardContent loggedUserId={this.props.userId} contentId={content.id} title={content.title} description={content.description} types={recommendation.types} url={content.url} embed_id={content.embed_id} matching={Math.round(recommendation.match * 100)} rate={recommendation.rate}
                                 embed_type={content.embed_type} synonymous={recommendation.synonymous} thumbnail={content.thumbnail} hideLikeButton={false}/>
                </div>
            </div>
        );
    }
}
