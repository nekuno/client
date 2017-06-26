import React, { PropTypes, Component } from 'react';
import CardContent from '../ui/CardContent';
import InfiniteScroll from '../scroll/InfiniteScroll';

export default class CardContentList extends Component {
    static propTypes = {
        firstItems    : PropTypes.array,
        contents      : PropTypes.array.isRequired,
        userId        : PropTypes.number.isRequired,
        otherUserId   : PropTypes.number,
        onReport      : PropTypes.func,
        onBottomScroll: PropTypes.func,
        isLoading     : PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.getCardContents = this.getCardContents.bind(this);
    }


    buildCardUser(content, index) {
        const {userId, otherUserId, onReport} = this.props;

        return <CardContent key={index} hideLikeButton={false} {...content} loggedUserId={userId} otherUserId={otherUserId}
                            embed_id={content.embed ? content.embed.id : null} embed_type={content.embed ? content.embed.type : null}
                            fixedHeight={true} onReport={onReport}/>
    }

    getCardContents() {
        return this.props.contents.map((content, index) => {
            return this.buildCardUser(content, index);
        });
    }

    render() {
        return (
            <div className="content-list">
                <InfiniteScroll
                    items={this.getCardContents()}
                    firstItems={this.props.firstItems}
                    columns={2}
                    // preloadAdditionalHeight={window.innerHeight*2}
                    // useWindowAsScrollContainer
                    onInfiniteLoad={this.props.onBottomScroll}
                    containerId="interests-view-main"
                />
            </div>
        );
    }
}

CardContentList.defaultProps = {
    'firstItems'    : [],
    'onBottomScroll': () => {
    },
    'onReport'      : () => {
    },
    'isLoading'     : false
};