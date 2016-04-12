import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import selectn from 'selectn';
import CardContent from '../ui/CardContent';

export default class CardContentList extends Component {
    static propTypes = {
        contents: PropTypes.array.isRequired,
        userId: PropTypes.number.isRequired,
        onClickHandler: PropTypes.func
    };

    render() {
        return (
            <div className="content-list">
                {this.props.contents.map((content, index) => <CardContent key={index} hideLikeButton={false} {...content} loggedUserId={this.props.userId} onClickHandler={this.onClickHandler.bind(this, index - 1)}/>)}
            </div>
        );
    }

    onClickHandler(key) {
        if (typeof this.props.onClickHandler !== 'undefined') {
            this.props.onClickHandler(key);
        }
    }

}
