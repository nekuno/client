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
    };

    constructor(props) {
        super(props);

        this.onReport = this.onReport.bind(this);
        this.getItems = this.getItems.bind(this);
    }

    onReport(contentId, reason) {
        this.props.onReport(contentId, reason);
    }

    getItems() {
        const firstItems = this.props.firstItems;
        const contents = this.getCardContents.bind(this)();
        return [
            ...firstItems,
            ...contents
        ];
    }

    getCardContents() {
        const {contents, userId, otherUserId} = this.props;

        return contents.map((content, index) => <CardContent key={index} hideLikeButton={false} {...content} loggedUserId={userId} otherUserId={otherUserId}
                                                             embed_id={content.embed ? content.embed.id : null} embed_type={content.embed ? content.embed.type : null}
                                                             fixedHeight={true}
                                                             onReport={this.props.onReport ? this.onReport : null}/>)
    }

    render() {
        return (
            <div className="content-list">
                <InfiniteScroll
                    list={this.getItems()}
                    // preloadAdditionalHeight={window.innerHeight*2}
                    // useWindowAsScrollContainer
                    onInfiniteLoad={this.props.onBottomScroll}
                    scrollContainer={document.getElementById("interests-view-main")}
                />
            </div>
        );
    }
}

CardContentList.defaultProps = {
    'firstItems': [],
    'onBottomScroll': () => {}
};