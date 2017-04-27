import React, { PropTypes, Component } from 'react';
import CardContent from '../ui/CardContent';

export default class CardContentList extends Component {
    static propTypes = {
        contents      : PropTypes.array.isRequired,
        userId        : PropTypes.number.isRequired,
        otherUserId   : PropTypes.number,
        onReport      : PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.onReport = this.onReport.bind(this);
    }

    onReport(contentId, reason) {
        if (this.props.onReport) {
            this.props.onReport(contentId, reason);
        }
    }

    render() {
        const {contents, userId, otherUserId, onClickHandler} = this.props;
        return (
            <div className="content-list">
                {contents.map((content, index) => <CardContent key={index} hideLikeButton={false} {...content} loggedUserId={userId} otherUserId={otherUserId}
                                                               embed_id={content.embed ? content.embed.id : null} embed_type={content.embed ? content.embed.type : null}
                                                               fixedHeight={true}
                                                               onReport={this.onReport}/>)}
            </div>
        );
    }
}
