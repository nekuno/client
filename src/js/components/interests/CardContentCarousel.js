import React, { PropTypes, Component } from 'react';
import CardContent from '../ui/CardContent';

export default class CardContentCarousel extends Component {
    static propTypes = {
        contents: PropTypes.array.isRequired,
        userId  : PropTypes.number.isRequired
    };

    render() {
        return (
            <div className="swiper-container">
                <div className="swiper-wrapper content-carousel">
                    {this.props.contents.map((content, index) =>
                        <div key={index} className="swiper-slide">
                            <CardContent {...content} embed_id={content.embed ? content.embed.id : null} embed_type={content.embed ? content.embed.type : null} loggedUserId={this.props.userId} hideLikeButton={false}/>
                        </div>)}
                </div>
            </div>
        );
    }
}
