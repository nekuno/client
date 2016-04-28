import React, { PropTypes, Component } from 'react';
import CardContent from '../ui/CardContent';

export default class CardContentList extends Component {
    static propTypes = {
        contents      : PropTypes.array.isRequired,
        userId        : PropTypes.number.isRequired,
        onClickHandler: PropTypes.func
    };

    render() {
        const {contents, userId} = this.props;
        return (
            <div className="content-list">
                {contents.map((content, index) => <CardContent key={index} hideLikeButton={false} {...content} loggedUserId={userId}
                                                               onClickHandler={this.onClickHandler.bind(this, index - 1)}
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
