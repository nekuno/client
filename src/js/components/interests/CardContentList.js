import React, { PropTypes, Component } from 'react';
import CardContent from '../ui/CardContent';
import InfiniteScroll from '../scroll/InfiniteScroll';
import FilterContentButtons from '../ui/FilterContentButtons';
import SocialNetworksBanner from '../socialNetworks/SocialNetworksBanner';


export default class CardContentList extends Component {
    static propTypes = {
        contents      : PropTypes.array.isRequired,
        userId        : PropTypes.number.isRequired,
        otherUserId   : PropTypes.number,
        onReport      : PropTypes.func,
        items         : PropTypes.array,
        networks      : PropTypes.array
    };

    constructor(props) {
        super(props);

        this.onReport = this.onReport.bind(this);
        this.getItems = this.getItems.bind(this);
    }

    onReport(contentId, reason) {
        this.props.onReport(contentId, reason);
    }

    getBanner() {
        const {networks, user} = this.props;
        const connectedNetworks = networks.filter(network => network.fetching || network.fetched || network.processing || network.processed);
        return connectedNetworks.length < 4 ? <SocialNetworksBanner networks={networks} user={user}/> : ''
    }

    getFilterButtons() {
        const {pagination, totals, userId} = this.props;
        return <FilterContentButtons userId={userId} contentsCount={pagination.total || 0} ownContent={true}
                                     linksCount={totals.Link}
                                     audiosCount={totals.Audio}
                                     videosCount={totals.Video}
                                     imagesCount={totals.Image}
                                     channelsCount={totals.Creator}
        />
    }

    getItems() {
        const banner = this.getBanner.bind(this)();
        const filterButtons = this.getFilterButtons.bind(this)();
        const contents = this.getCardContents.bind(this)();
        return [
            banner,
            filterButtons,
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
                    // list={this.getItems()}
                    // preloadAdditionalHeight={window.innerHeight*2}
                    // useWindowAsScrollContainer
                    onInfiniteLoad={this.props.onBottomScroll}
                    scrollContainer={document.getElementById("interests-view-main")}
                />
            </div>
        );
    }
}
