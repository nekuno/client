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
        if (types.some((type) => type === 'CreatorFacebook')) {
            return this.renderFacebookCreatorIcons();
        } else if (types.some((type) => type === 'CreatorTwitter')) {
            return this.renderTwitterCreatorIcons();
        } else if (types.some((type) => type === 'CreatorInstagram')) {
            return this.renderInstagramCreatorIcons();
        } else if (types.some((type) => type === 'CreatorTwitter')) {
            return this.renderTwitterCreatorIcons();
        } else if (types.some((type) => type === 'FacebookVideo')) {
            return this.renderFacebookVideoIcons();
        } else if (types.some((type) => type === 'FacebookLink')) {
            return this.renderFacebookLinkIcons();
        } else if (types.some((type) => type === 'Audio')) {
            return this.renderAudioIcons();
        } else if (types.some((type) => type === 'Video')) {
            return this.renderVideoIcons();
        } else if (types.some((type) => type === 'Image')) {
            return this.renderImageIcons();
        } else {
            return this.renderLinkIcons();
        }
    };

    renderLinkIcons = function() {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper link-icon-wrapper"><span className="icon-web-site"></span></div>
            </div>
        );
    };

    renderImageIcons = function() {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper image-icon-wrapper"><span className="icon-photo"></span></div>
            </div>
        );
    };

    renderVideoIcons = function() {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper"><span className="icon-video"></span></div>
                <div className="icon-wrapper youtube-icon-wrapper"><span className="icon-youtube"></span></div>
            </div>
        );
    };

    renderAudioIcons = function() {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper"><span className="icon-audio"></span></div>
                <div className="icon-wrapper spotify-icon-wrapper"><span className="icon-spotify"></span></div>
            </div>
        );
    };

    renderTwitterCreatorIcons = function() {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper"><span className="icon-channels"></span></div>
                <div className="icon-wrapper twitter-icon-wrapper"><span className="icon-twitter"></span></div>
            </div>
        );
    };

    renderFacebookLinkIcons = function() {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper link-icon-wrapper"><span className="icon-web-site"></span></div>
                <div className="icon-wrapper facebook-icon-wrapper"><span className="icon-facebook"></span></div>
            </div>
        );
    };

    renderFacebookVideoIcons = function() {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper"><span className="icon-video"></span></div>
                <div className="icon-wrapper facebook-icon-wrapper"><span className="icon-facebook"></span></div>
            </div>
        );
    };

    renderFacebookCreatorIcons = function() {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper"><span className="icon-channels"></span></div>
                <div className="icon-wrapper facebook-icon-wrapper"><span className="icon-facebook"></span></div>
            </div>
        );
    };

    renderInstagramCreatorIcons = function() {
        return (
            <div className="absolute-wrapper">
                <div className="icon-wrapper"><span className="icon-channels"></span></div>
                <div className="icon-wrapper instagram-icon-wrapper"><span className="icon-instagram"></span></div>
            </div>
        );
    };
}