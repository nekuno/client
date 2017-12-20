import PropTypes from 'prop-types';
import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class CardIcons extends Component {
    static propTypes = {
        types: PropTypes.array
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <div>
                {this.renderIcons(this.props.types)}
            </div>
        );
    }

    renderIcons = function(types) {
        let network = null;
        const networkIndex = types.findIndex(type => type.length > 4 && type.substr(0, 4) === 'Link');
        if (networkIndex !== -1) {
            network = types[networkIndex].substr(4).toLowerCase();
        }

        if (types.some((type) => type === 'Audio')) {
            return this.renderAudioIcons(network);
        } else if (types.some((type) => type === 'Video')) {
            return this.renderVideoIcons(network);
        } else if (types.some((type) => type === 'Image')) {
            return this.renderImageIcons(network);
        } else if (types.some((type) => type === 'Creator')) {
            return this.renderCreatorIcons(network);
        } else if (types.some((type) => type === 'Game')) {
            return this.renderGameIcons(network);
        } else {
            return this.renderWebIcons(network);
        }
    };

    renderAudioIcons = function(network) {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper"><span className="icon-audio"></span></div>
                {this.renderNetworkIcon(network)}
            </div>
        );
    };

    renderVideoIcons = function(network) {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper"><span className="icon-video"></span></div>
                {this.renderNetworkIcon(network)}
            </div>
        );
    };

    renderImageIcons = function(network) {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper image-icon-wrapper"><span className="icon-photo"></span></div>
                {this.renderNetworkIcon(network)}
            </div>
        );
    };

    renderCreatorIcons = function(network) {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper"><span className="icon-channels"></span></div>
                {this.renderNetworkIcon(network)}
            </div>
        );
    };

    renderGameIcons = function(network) {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper"><span className="icon-gamepad"></span></div>
                {this.renderNetworkIcon(network)}
            </div>
        );
    };

    renderWebIcons = function(network) {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper link-icon-wrapper"><span className="icon-web-site"></span></div>
                {this.renderNetworkIcon(network)}
            </div>
        );
    };

    renderNetworkIcon = function(network) {
        const wrapperClass = network ? `icon-wrapper ${network}-icon-wrapper` : null;
        const iconClass = network ? `icon-${network}` : null;

        return network ? <div className={wrapperClass}><span className={iconClass}></span></div> : null
    };
}