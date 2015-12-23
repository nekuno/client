import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';

export default class ToolBar extends Component {
    static propTypes = {
        links: PropTypes.array.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <div className="toolbar">
                <div className="toolbar-inner">
                    {this.props.links.map(link => {
                        return <Link to={link.url}>{link.text}</Link>
                    })}
                </div>
            </div>
        );
    }
}
