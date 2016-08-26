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
        arrowUpLeft    : PropTypes.string.isRequired,
        // Injected by @connectToStores:
        isGuest        : PropTypes.bool
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let {activeLinkIndex, links, arrowUpLeft, isGuest} = this.props;
        let className = isGuest ? "toolbar toolbar-guest" : "toolbar";
        return (
            <div id="bottom-toolbar" className={className}>
                <div className="arrow-up" style={{ left: arrowUpLeft }}></div>
                <div className="toolbar-inner">
                    {links.map((link, index) => {
                        return (
                            <div key={index} className="toolbar-link-wrapper">
                                <Link to={link.url}>{activeLinkIndex === index ? <strong>{link.text}</strong> : link.text}</Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
