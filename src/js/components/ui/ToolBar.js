import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../../utils/connectToStores';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import LoginStore from '../../stores/LoginStore';
import RouterActionCreators from '../../actions/RouterActionCreators';

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

    onLinkClick(url) {
        RouterActionCreators.replaceRoute(url);
    }

    render() {
        let {activeLinkIndex, links, arrowUpLeft, isGuest} = this.props;
        let className = isGuest ? "toolbar toolbar-guest" : "toolbar";
        return (
            <div id="toolbar-bottom" className={className}>
                <div className="arrow-up" style={{ left: arrowUpLeft }}></div>
                <div className="toolbar-inner">
                    {links.map((link, index) => {
                        return (
                            <div key={index} className="toolbar-link-wrapper" onClick={this.onLinkClick.bind(this, link.url)}>
                                <a href="javascript:void(0)">{activeLinkIndex === index ? <strong>{link.text}</strong> : link.text}</a>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
