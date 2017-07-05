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
        isLoading     : PropTypes.bool,
        loadingFirst  : PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.onReport = this.onReport.bind(this);
        this.getCardContents = this.getCardContents.bind(this);
    }

    onReport(contentId, reason) {
        this.props.onReport(contentId, reason);
    }

    buildCardContent(content, index) {
        const {userId, otherUserId} = this.props;

        return <CardContent key={index} hideLikeButton={false} {...content} loggedUserId={userId} otherUserId={otherUserId}
                            embed_id={content.embed ? content.embed.id : null} embed_type={content.embed ? content.embed.type : null}
                            fixedHeight={true} onReport={this.onReport}/>
    }

    getCardContents() {
        return this.props.contents.map((content, index) => {
            return this.buildCardContent(content, index);
        });
    }

    render() {
        return (
            <div className="content-list">
                <InfiniteScroll
                    items = {this.getCardContents()}
                    firstItems={this.props.firstItems}
                    columns = {2}
                    // preloadAdditionalHeight={window.innerHeight*2}
                    // useWindowAsScrollContainer
                    onInfiniteLoad={this.props.onBottomScroll}
                    containerId="interests-view-main"
                    loading = {this.props.isLoading}
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
    'isLoading'     : false,
    'loadingFirst' : false,
};