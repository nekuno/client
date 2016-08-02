import React, { PropTypes, Component } from 'react';
import SocialBox from './SocialBox';

import ConnectActionCreators from '../../actions/ConnectActionCreators';
import SocialNetworkService from '../../services/SocialNetworkService';

export default class SocialWheels extends Component {

    static propTypes = {
        picture : PropTypes.string.isRequired,
        networks: PropTypes.array.isRequired
    };

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

    renderSmallIcon = function(resource, radius, degrees, posX, posY, fetching, fetched, processing, processed, key) {
        if (fetching) {
            return this.renderFetchingIcon(resource, radius, posX, posY, key);
        } else if (fetched && !processing && !processed) {
            return this.renderFetchedIcon(resource, radius, posX, posY, key);
        } else if (!fetched && !processing && !processed) {
            return this.renderTransparentIcon(resource, radius, posX, posY, key);
        } else {
            return this.renderProcessingIcon(resource, radius, degrees, posX, posY, key);
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
            nekunoApp.alert(resource + ' login failed: ' + status.error.message);
        });
    };

    render() {

        const posX = 155;
        const posY = 155;
        const initialRadius = 37.5;
        const separation = 12.5;
        const {networks, picture} = this.props;
        const connectedNetworks = networks.filter(network => network.fetching || network.fetched || network.processing || network.processed);
        
        return (
            <div className="social-wheels">
                <SocialBox onClickHandler={this.connect} excludedResources={connectedNetworks.map(network => network.resource)} />
                {connectedNetworks.length > 0 ?
                    <svg width="310" height="310">
                        <g>
                            {/* Wheel separators */}
                            {networks.map((network, index) => {
                                let value = initialRadius + index * separation;
                                return (<path key={'wheel-separator-' + index} d={this.describeArc(posX, posY, value, 0, 359.9)} className="wheel-separator"/>);
                            })}
                            {networks.map((network, index) => {
                                let realIndex = index + networks.length - 1;
                                let value = initialRadius + realIndex * separation;
                                return (<path key={'wheel-separator-' + index * 2} d={this.describeArc(posX, posY, value, 0, 359.9)} className="wheel-separator"/>);
                            })}
                            
                            {/* User picture */}
                            <image xlinkHref={picture} x={posX - 25} y={posY - 25} height="50px" width="50px" clipPath="url(#clip)"/>
                            <clipPath id="clip">
                                <rect id="rect" x={posX - 25} y={posY - 25} width="50px" height="50px" rx="25"/>
                            </clipPath>
                            <path d={this.describeArc(posX, posY, 25, 0, 359.9)} className="wheel-picture"/>
    
                            {/* Social networks wheels */}
                            {networks.map((message, index) => {
                                let radius = initialRadius + index * separation * 2;
                                let progress = message.processed ? 359 : message.process * 3.6;
                                return (<path key={'wheel' + index} d={this.describeArc(posX, posY, radius, 0, progress)} className={"wheel-" + message.resource}/>);
                            })}
                            
                            {/* Small icons */}
                            {networks.map((message, index) => {
                                let radius = initialRadius + index * separation * 2;
                                let progress = message.process * 3.6;
                                return this.renderSmallIcon(message.resource, radius, progress, posX, posY, message.fetching, message.fetched, message.processing, message.processed, index);
                            })}
                        </g>
                    </svg>
                        :
                    null}
            </div>
        );
    }
}