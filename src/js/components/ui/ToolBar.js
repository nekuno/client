import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import connectToStores from '../../utils/connectToStores';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import LoginStore from '../../stores/LoginStore';

function getState() {
    const isGuest = LoginStore.isGuest();

    return {isGuest};
}

@connectToStores([LoginStore], getState)
export default class ToolBar extends Component {
    static propTypes = {
        links          : PropTypes.array.isRequired,
        activeLinkIndex: PropTypes.number.isRequired,
        // Injected by @connectToStores:
        isGuest        : PropTypes.bool.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let {activeLinkIndex, isGuest} = this.props;
        let className = isGuest ? "toolbar toolbar-guest" : "toolbar";
        return (
            <div className={className}>
                <div className="toolbar-inner">
                    {this.props.links.map((link, index) => {
                        return <Link key={index} to={link.url}>{activeLinkIndex === index ? <strong>{link.text}</strong> : link.text}</Link>
                    })}
                </div>
            </div>
        );
    }
}
