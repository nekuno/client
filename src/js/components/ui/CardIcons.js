import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class CardIcons extends Component {
    static propTypes = {
        types: PropTypes.array
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <div>
                {this.props.types.map((value, index, array) => {
                    switch (value) {
                        case 'Link':
                            if (array.length > 1) {
                                break;
                            }
                            return this.renderLinkIcons();
                        case 'Image':
                            return this.renderImageIcons();
                        case 'Video':
                            return this.renderVideoIcons();
                        case 'Audio':
                            return this.renderAudioIcons();
                    }
                })}
            </div>
        );
    }

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
}