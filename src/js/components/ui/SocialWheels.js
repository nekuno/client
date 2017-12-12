import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {SOCIAL_NETWORKS, OTHER_SOCIAL_NETWORKS} from '../../constants/Constants';
import SocialBox from './SocialBox';
import ConnectActionCreators from '../../actions/ConnectActionCreators';
import SocialNetworkService from '../../services/SocialNetworkService';
import Framework7Service from '../../services/Framework7Service';
import {Motion, spring} from 'react-motion';
import translate from '../../i18n/Translate';

@translate('SocialWheels')
export default class SocialWheels extends Component {

    static propTypes = {
        picture : PropTypes.string.isRequired,
        networks: PropTypes.array.isRequired,
        error   : PropTypes.string,
        isLoading : PropTypes.bool,
        // Injected by @translate:
        strings  : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.posX = 155;
        this.posY = 155;
        this.initialRadius = 37.5;
        this.separation = 12.5;

        this.state = {
            prevNetworks: props.networks.slice(0)
        };
    }

    componentWillReceiveProps(nextProps) {
        const {networks} = this.props;
        const {error} = nextProps;
        this.setState({
            prevNetworks: networks
        });

        if (error) {
            Framework7Service.nekunoApp().alert(error);
            setTimeout(ConnectActionCreators.removeError, 0);
        }
    }

    renderProcessingIcon = function(resource, radius, degrees, posX, posY, key) {
        return (
            <foreignObject key={key} x={this.smallIconXValue(posX, posY, radius, 0, degrees)} y={this.smallIconYValue(posX, posY, radius, 0, degrees)} width="15" height="15">
                <div className={"icon-wrapper text-" + resource}>
                    <div className={resource == 'google' ? 'icon-youtube' : 'icon-' + resource}></div>
                </div>
            </foreignObject>
        );
    };

    renderFetchingIcon = function(resource, radius, posX, posY, key) {
        return (
            <foreignObject key={key} x={this.smallIconXValue(posX, posY, radius, 0, 0)} y={this.smallIconYValue(posX, posY, radius, 0, 0)} width="15" height="15">
                <div className={"fetching-icon icon-wrapper text-" + resource}>
                    <div className={resource == 'google' ? 'icon-youtube' : 'icon-' + resource}></div>
                </div>
            </foreignObject>
        );
    };

    renderFetchedIcon = function(resource, radius, posX, posY, key) {
        return (
            <foreignObject key={key} x={this.smallIconXValue(posX, posY, radius, 0, 0)} y={this.smallIconYValue(posX, posY, radius, 0, 0)} width="15" height="15">
                <div className={"fetched-icon icon-wrapper text-" + resource}>
                    <div className={resource == 'google' ? 'icon-youtube' : 'icon-' + resource}></div>
                </div>
            </foreignObject>
        );
    };

    renderTransparentIcon = function(resource, radius, posX, posY, key) {
        return (
            <foreignObject key={key} x={this.smallIconXValue(posX, posY, radius, 0, 0)} y={this.smallIconYValue(posX, posY, radius, 0, 0)} width="15" height="15"
                           style={{opacity: 0}}>
                <div className={"icon-wrapper text-" + resource}>
                    <div className={resource == 'google' ? 'icon-youtube' : 'icon-' + resource}></div>
                </div>
            </foreignObject>
        );
    };

    renderSmallIcon = function(resource, radius, degrees, posX, posY, fetching, fetched, processing, processed, connected, key) {
        if (fetching) {
            return this.renderFetchingIcon(resource, radius, posX, posY, key);
        } else if (fetched && !processing && !processed) {
            return this.renderFetchedIcon(resource, radius, posX, posY, key);
        } else if (!fetched && !processing && !processed && !connected) {
            return this.renderTransparentIcon(resource, radius, posX, posY, key);
        } else if (processed || processing) {
            return this.renderProcessingIcon(resource, radius, degrees, posX, posY, key);
        } else {
            return this.renderFetchingIcon(resource, radius, posX, posY, key);
        }
    };

    polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    describeArc = function(x, y, radius, startAngle, endAngle) {
        endAngle = endAngle === 360 ? 359 : endAngle;
        var start = this.polarToCartesian(x, y, radius, endAngle);
        var end = this.polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    };

    smallIconXValue = function(x, y, radius, startAngle, endAngle) {
        var end = this.polarToCartesian(x, y, radius, endAngle);

        return end.x - 7.5;
    };

    smallIconYValue = function(x, y, radius, startAngle, endAngle) {
        var end = this.polarToCartesian(x, y, radius, endAngle);

        return end.y - 7.5;
    };

    connect = function(resource, scope) {
        SocialNetworkService.login(resource, scope, true).then(() => {
            ConnectActionCreators.connect(resource, SocialNetworkService.getAccessToken(resource), SocialNetworkService.getResourceId(resource), SocialNetworkService.getExpireTime(resource), SocialNetworkService.getRefreshToken(resource));
        }, (status) => {
            Framework7Service.nekunoApp().alert(resource + ' login failed: ' + status.error.message);
        });
    };

    getProcessing(network) {
        return network.processed ? 359 : network.process * 3.6;
    }

    render() {
        const {prevNetworks} = this.state;
        const {networks, picture, isLoading, strings} = this.props;
        const connectedNetworks = networks.filter(network => network.connected).sort((networkA, networkB) => parseInt(networkA.processed) - parseInt(networkB.processed));
        const notConnectedNetworks = networks.filter(network => !network.connected);
        const wheelNetworks = connectedNetworks.length > 5 ? connectedNetworks.slice(0, 5) : connectedNetworks.concat(notConnectedNetworks.slice(0, 5 - connectedNetworks.length));
        const belowWheelNetworks = connectedNetworks.length > 5 ? connectedNetworks.slice(5) : [];

        return (
            <div className="social-wheels">
                <SocialBox onClickHandler={this.connect} excludedResources={connectedNetworks.map(network => network.resource)} disabled={isLoading} />
                <br/>
                <div className="excerpt">{strings.excerpt}</div>
                {wheelNetworks.length > 0 ?
                    <svg width="310" height="310">
                        <g>
                            {/* Wheel separators */}
                            {wheelNetworks.map((network, index) => {
                                let value = this.initialRadius + index * this.separation;
                                return (<path key={'wheel-separator-' + index} d={this.describeArc(this.posX, this.posY, value, 0, 359.9)} className="wheel-separator"/>);
                            })}
                            {wheelNetworks.map((network, index) => {
                                let realIndex = index + networks.length - 1;
                                let value = this.initialRadius + realIndex * this.separation;
                                return (<path key={'wheel-separator-' + index * 2} d={this.describeArc(this.posX, this.posY, value, 0, 359.9)} className="wheel-separator"/>);
                            })}
                            
                            {/* User picture */}
                            <image xlinkHref={picture} x={this.posX - 25} y={this.posY - 25} height="50px" width="50px" clipPath="url(#clip)"/>
                            <clipPath id="clip">
                                <rect id="rect" x={this.posX - 25} y={this.posY - 25} width="50px" height="50px" rx="25"/>
                            </clipPath>
                            <path d={this.describeArc(this.posX, this.posY, 25, 0, 359.9)} className="wheel-picture"/>
    
                            {/* Social networks wheels */}
                            {wheelNetworks.map((message, index) => {
                                let radius = this.initialRadius + index * this.separation * 2;
                                let progress = this.getProcessing(message);
                                let prevProgress = prevNetworks[index] ? this.getProcessing(prevNetworks[index]) : progress;
                                return (
                                    <Motion
                                        key={index}
                                        defaultStyle={{progress: prevProgress}}
                                        style={{progress: spring(progress)}}
                                    >
                                        {val =>
                                            <path key={'wheel' + index} d={this.describeArc(this.posX, this.posY, radius, 0, val.progress)} className={"wheel-" + message.resource}/>
                                        }
                                    </Motion>
                                );
                            })}
                            
                            {/* Small icons */}
                            {wheelNetworks.map((message, index) => {
                                let radius = this.initialRadius + index * this.separation * 2;
                                let progress = message.processed ? 359 : message.process * 3.6;
                                return (
                                    <Motion
                                        key={index}
                                        defaultStyle={{progress: prevNetworks[index] ? prevNetworks[index].processed ? 359 : prevNetworks[index].process * 3.6 : progress}}
                                        style={{progress: spring(progress)}}
                                    >
                                        {val =>
                                            this.renderSmallIcon(message.resource, radius, val.progress, this.posX, this.posY, message.fetching, message.fetched, message.processing, message.processed, message.connected, index)
                                        }
                                    </Motion>
                                )
                            })}
                        </g>
                    </svg>
                        :
                    null}
                {belowWheelNetworks.length > 0 ?
                    <div id="other-social-networks">
                        <div className="title">{strings.otherNetworks}</div>
                        <SocialBox onClickHandler={this.connect} excludedResources={SOCIAL_NETWORKS.filter(network => !belowWheelNetworks.some(belowWheelNetwork => belowWheelNetwork.resource === network.resourceOwner)).map(network => network.resourceOwner)} disabled={isLoading} disabledButtons={true} />
                    </div>
                    : null
                }
            </div>
        );
    }
}

SocialWheels.defaultProps = {
    strings  : {
        excerpt      : 'Nekuno will never publish anything on your networks',
        otherNetworks: 'Other connected networks'
    },
    isLoading : false,
};