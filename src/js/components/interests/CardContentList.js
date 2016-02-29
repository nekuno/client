import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import selectn from 'selectn';
import CardContent from '../ui/CardContent';

export default class CardContentList extends Component {
    static propTypes = {
        contents: PropTypes.array.isRequired,
        userId: PropTypes.number.isRequired
    };

    render() {
        return (
            <div>
                {this.props.contents.map((content, index) => <CardContent key={index} hideLikeButton={true} {...content} loggedUserId={1} />)}
            </div>
        );
    }
}
