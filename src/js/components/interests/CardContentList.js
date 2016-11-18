import React, { PropTypes, Component } from 'react';
import CardContent from '../ui/CardContent';

export default class CardContentList extends Component {
    static propTypes = {
        contents      : PropTypes.array.isRequired,
        userId        : PropTypes.number.isRequired,
        otherUserId   : PropTypes.number,
        onClickHandler: PropTypes.func
    };

    render() {
        const {contents, userId, otherUserId, onClickHandler} = this.props;
        return (
            <div className="content-list">
                {contents.map((content, index) => <CardContent key={index} hideLikeButton={false} {...content} loggedUserId={userId} otherUserId={otherUserId}
                                                               embed_id={content.embed ? content.embed.id : null} embed_type={content.embed ? content.embed.type : null}
                                                               onClickHandler={onClickHandler ? this.onClickHandler.bind(this, index - 1) : null}
                                                               fixedHeight={true}/>)}
            </div>
        );
    }

    onClickHandler(key) {
        if (typeof this.props.onClickHandler !== 'undefined') {
            this.props.onClickHandler(key);
        }
    }

}
