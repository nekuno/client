import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';

export default class ToolBar extends Component {
    static propTypes = {
        links          : PropTypes.array.isRequired,
        activeLinkIndex: PropTypes.number.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let activeLinkIndex = this.props.activeLinkIndex;
        return (
            <div className="toolbar">
                <div className="toolbar-inner">
                    {this.props.links.map((link, index) => {
                        return <Link key={index} to={link.url}>{activeLinkIndex === index ? <strong>{link.text}</strong> : link.text}</Link>
                    })}
                </div>
            </div>
        );
    }
}
