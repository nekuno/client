import React, { PropTypes, Component } from 'react';
import { FACEBOOK_SCOPE, TWITTER_SCOPE, GOOGLE_SCOPE, SPOTIFY_SCOPE } from '../../constants/Constants';
import ConnectActionCreators from '../../actions/ConnectActionCreators';

export default class SocialWheels extends Component {

    static propTypes = {
        picture : PropTypes.string.isRequired,
        networks: PropTypes.array.isRequired
    };

    renderProcessingIcon = function(resource, radius, degrees, posX, posY, key) {
        return (
            <foreignObject key={key} x={this.smallIconXValue(posX, posY, radius, 0, degrees)} y={this.smallIconYValue(posX, posY, radius, 0, degrees)} width="15" height="15" requiredExtensions="http://www.w3.org/1999/xhtml"
                           style={degrees ? null : {opacity: 0}}>
                <div className={"icon-wrapper text-" + resource}>
                    <div className={resource == 'google' ? 'icon-youtube' : 'icon-' + resource}></div>
                </div>
            </foreignObject>
        );
    };

    renderFetchingIcon = function(resource, radius, posX, posY, key) {
        return (
            <foreignObject key={key} x={this.smallIconXValue(posX, posY, radius, 0, 0)} y={this.smallIconYValue(posX, posY, radius, 0, 0)} width="15" height="15" requiredExtensions="http://www.w3.org/1999/xhtml">
                <div className={"fetching-icon icon-wrapper text-" + resource}>
                    <div className={resource == 'google' ? 'icon-youtube' : 'icon-' + resource}></div>
                </div>
            </foreignObject>
        );
    };

    renderFetchedIcon = function(resource, radius, posX, posY, key) {
        return (
            <foreignObject key={key} x={this.smallIconXValue(posX, posY, radius, 0, 0)} y={this.smallIconYValue(posX, posY, radius, 0, 0)} width="15" height="15" requiredExtensions="http://www.w3.org/1999/xhtml">
                <div className={"fetched-icon icon-wrapper text-" + resource}>
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
        } else {
            return this.renderProcessingIcon(resource, radius, degrees, posX, posY, key);
        }
    };

    renderIcon = function(resource, scope, degrees, posX, posY, captured = false, key) {
        return (
            <g key={key} opacity={captured ? 0.5 : 1}>
                <foreignObject x={this.bigIconXValue(posX, posY, 137.5, 0, degrees)} y={this.bigIconYValue(posX, posY, 137.5, 0, degrees)}
                               width="30" height="30" requiredExtensions="http://www.w3.org/1999/xhtml">
                    <div className={"icon-wrapper big-icon-wrapper text-" + resource} style={{ cursor: captured ? 'default' : 'pointer' }}
                         onClick={captured ? () => { } : () => {
                            this.connect(resource, scope);
                         }}>
                        <div className={resource == 'google' ? 'icon-youtube' : 'icon-' + resource}></div>
                    </div>
                </foreignObject>
            </g>
        )
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

    bigIconXValue = function(x, y, radius, startAngle, endAngle) {
        var end = this.polarToCartesian(x, y, radius, endAngle);

        return end.x - 15;
    };

    bigIconYValue = function(x, y, radius, startAngle, endAngle) {
        var end = this.polarToCartesian(x, y, radius, endAngle);

        return end.y - 15;
    };

    connect = function(resource, scope) {

        hello(resource).login({scope: scope}).then(function(response) {
            var accessToken = response.authResponse.access_token;
            console.log('accessToken:', accessToken);
            hello(resource).api('me').then(function(status) {
                    console.log('api(\'me\')', status);
                    var resourceId = status.id.toString();
                    console.log('resourceId: ', resourceId);
                    ConnectActionCreators.connect(resource, accessToken, resourceId)
                        .then(() => {

                        }, (error) => {
                            console.log(error);
                            nekunoApp.alert(error.error);
                        });
                },
                function(status) {
                    nekunoApp.alert(resource + ' login failed: ' + status.error.message);
                }
            )
        }, function(response) {
            nekunoApp.alert(resource + ' login failed: ' + response.error.message);
        });
    };

    render() {

        const posX = 155;
        const posY = 155;
        const networks = this.props.networks;
        const picture = this.props.picture;

        let initialRadius = 37.5;

        return (
            <div className="social-wheels">
                <svg width="310" height="310" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        {/* Wheel separators */}
                        <path d={this.describeArc(posX, posY, 112.5, 0, 359.9)} className="wheel-separator"/>
                        <path d={this.describeArc(posX, posY, 100, 0, 359.9)} className="wheel-separator"/>
                        <path d={this.describeArc(posX, posY, 87.5, 0, 359.9)} className="wheel-separator"/>
                        <path d={this.describeArc(posX, posY, 75, 0, 359.9)} className="wheel-separator"/>
                        <path d={this.describeArc(posX, posY, 62.5, 0, 359.9)} className="wheel-separator"/>
                        <path d={this.describeArc(posX, posY, 50, 0, 359.9)} className="wheel-separator"/>
                        <path d={this.describeArc(posX, posY, 37.5, 0, 359.9)} className="wheel-separator"/>

                        {/* User picture */}
                        <image xlinkHref={picture} x={posX - 25} y={posY - 25} height="50px" width="50px" clipPath="url(#clip)"/>
                        <clipPath id="clip">
                            <rect id="rect" x={posX - 25} y={posY - 25} width="50px" height="50px" rx="25"/>
                        </clipPath>
                        <path d={this.describeArc(posX, posY, 25, 0, 359.9)} className="wheel-picture"/>

                        {/* Big icons */}
                        {/* Use custom degrees bellow for new social networks */}
                        {networks.map((message, index) => {
                            let captured = message.fetching || message.fetched || message.processing || message.processed;
                            switch (message.resource) {
                                case 'facebook':
                                    return this.renderIcon(message.resource, FACEBOOK_SCOPE, 45, posX, posY, captured, index);
                                case 'spotify':
                                    return this.renderIcon(message.resource, SPOTIFY_SCOPE, 135, posX, posY, captured, index);
                                case 'twitter':
                                    return this.renderIcon(message.resource, TWITTER_SCOPE, 225, posX, posY, captured, index);
                                case 'google':
                                    return this.renderIcon(message.resource, GOOGLE_SCOPE, 315, posX, posY, captured, index);
                            }
                        })}

                        {/* Social networks wheels */}
                        {networks.map((message, index) => {
                            let radius = initialRadius + index * 25;
                            let progress = message.processed ? 359 : message.process * 3.6;
                            return (
                                <path key={index} d={this.describeArc(posX, posY, radius, 0, progress)} className={"wheel-" + message.resource}/>
                            );
                        })}

                        {/* Small icons */}
                        {networks.map((message, index) => {
                            let radius = initialRadius + index * 25;
                            let progress = message.processed ? 359 : message.process * 3.6;
                            return this.renderSmallIcon(message.resource, radius, progress, posX, posY, message.fetching, message.fetched, message.processing, message.processed, index);
                        })}
                    </g>
                </svg>
            </div>
        );
    }
}