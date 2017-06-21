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

        this.onReport = this.onReport.bind(this);
        this.getItems = this.getItems.bind(this);
    }

    onReport(contentId, reason) {
        this.props.onReport(contentId, reason);
    }

    getItems() {
        const firstItems = this.props.firstItems;
        const contents = this.props.isLoading ? [] : this.getCardContents.bind(this)();
        return [
            ...firstItems,
            ...contents
        ];
    }

    buildCardUser(content, index) {
        const {userId, otherUserId} = this.props;

        return <CardContent key={index} hideLikeButton={false} {...content} loggedUserId={userId} otherUserId={otherUserId}
                            embed_id={content.embed ? content.embed.id : null} embed_type={content.embed ? content.embed.type : null}
                            fixedHeight={true} onReport={this.onReport}/>
    }

    buildCardWrapper(card1, card2) {
        let cards = [Object.assign({}, card1)];
        if (card2 instanceof Object) {
            cards.push(Object.assign({}, card2));
        }

        const wrapper = <div>
            {cards}
        </div>;

        card1 = null;

        return wrapper;
    }

    getCardContents() {

        let savedContentCard = null;
        let contentComponents = [];

        this.props.contents.forEach((content, index) => {
            let thisContentCard = this.buildCardUser.bind(this)(content, index);

            if (savedContentCard === null) {
                savedContentCard = thisContentCard;
            } else {
                contentComponents.push(this.buildCardWrapper(savedContentCard, thisContentCard));
                savedContentCard = null;
            }
        });

        if (savedContentCard !== null) {
            contentComponents.push(this.buildCardWrapper(savedContentCard))
            savedContentCard = null;
        }

        return contentComponents;
    }

    render() {
        return (
            <div className="content-list">
                <InfiniteScroll
                    list={this.getItems()}
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