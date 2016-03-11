import React, { PropTypes, Component } from 'react';

export default class SocialWheels extends Component {
    static propTypes = {
        picture: PropTypes.string,
        data: PropTypes.array
    };

    render() {
        const picture = "https://nekuno.com/media/cache/user_avatar_180x180/user/images/msalsas_1445885030.jpg";
        const posX = 155;
        const posY = 155;
        const data = [
            {
                // already processed, but not received 'processed' message
                // (same as processed, just to check 100%)
                resource: 'facebook',
                fetching: false,
                fetched: false,
                processing: true,
                process: 100,
                processed: false
            },
            {
                // already fetched and waiting for processing
                resource: 'spotify',
                fetching: false,
                fetched: true,
                processing: false,
                process: 0,
                processed: false
            },
            {
                // processing at 50%
                resource: 'twitter',
                fetching: false,
                fetched: false,
                processing: true,
                process: 50,
                processed: false
            },
            {
                // already processed
                resource: 'google-plus',
                fetching: false,
                fetched: false,
                processing: false,
                process: 0,
                processed: true
            }
        ];

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
                        {data.map(message => {
                            let captured = message.fetching || message.fetched || message.processing || message.processed;
                            switch(message.resource) {
                                case 'facebook':
                                    return this.renderIcon('facebook', 45, posX, posY, captured);
                                case 'spotify':
                                    return this.renderIcon('spotify', 135, posX, posY, captured);
                                case 'twitter':
                                    return this.renderIcon('twitter', 225, posX, posY, captured);
                                case 'google-plus':
                                    return this.renderIcon('google-plus', 315, posX, posY, captured);
                            }
                        })}

                        {/* Social networks wheels */}
                        {data.map((message, index) => {
                            let radius = initialRadius + index * 25;
                            let progress = message.processed ? 359 : message.process * 3.6;
                            return (
                                <path d={this.describeArc(posX, posY, radius, 0, progress)} className={"wheel-" + message.resource}/>
                            );
                        })}

                        {/* Small icons */}
                        {data.map((message, index) => {
                            let radius = initialRadius + index * 25;
                            let progress = message.processed ? 359 : message.process * 3.6;
                            return this.renderSmallIcon(message.resource, radius, progress, posX, posY, message.fetching, message.fetched);
                        })}
                    </g>
                </svg>
            </div>
        );
    }

    renderProcessingIcon = function (resource, radius, degrees, posX, posY) {
        return (
            <foreignObject x={this.textXValue(posX, posY, radius, 0, degrees)} y={this.textYValue(posX, posY, radius, 0, degrees)} width="15" height="15" requiredExtensions="http://www.w3.org/1999/xhtml">
                <div className={"icon-wrapper text-" + resource}>
                    <div className={"icon-" + resource}></div>
                </div>
            </foreignObject>
        );
    };

    renderFetchingIcon = function (resource, radius, posX, posY) {
        return (
            <foreignObject x={this.textXValue(posX, posY, radius, 0, 0)} y={this.textYValue(posX, posY, radius, 0, 0)} width="15" height="15" requiredExtensions="http://www.w3.org/1999/xhtml">
                <div className={"fetching-icon icon-wrapper text-" + resource}>
                    <div className={"icon-" + resource}></div>
                </div>
            </foreignObject>
        );
    };

    renderFetchedIcon = function (resource, radius, posX, posY) {
        return (
            <foreignObject x={this.textXValue(posX, posY, radius, 0, 0)} y={this.textYValue(posX, posY, radius, 0, 0)} width="15" height="15" requiredExtensions="http://www.w3.org/1999/xhtml">
                <div className={"fetched-icon icon-wrapper text-" + resource}>
                    <div className={"icon-" + resource}></div>
                </div>
            </foreignObject>
        );
    };

    renderSmallIcon = function (resource, radius, degrees, posX, posY, fetching, fetched) {
        if (fetching) {
            return this.renderFetchingIcon(resource, radius, posX, posY);
        } else if (fetched) {
            return this.renderFetchedIcon(resource, radius, posX, posY);
        } else {
            return this.renderProcessingIcon(resource, radius, degrees, posX, posY);
        }
    };

    renderIcon = function (resource, degrees, posX, posY, captured = false) {
        const iconWrapperClass = captured ? "disabled icon-wrapper big-icon-wrapper text-" + resource : "icon-wrapper big-icon-wrapper text-" + resource;

        return (
            <foreignObject x={this.textXValue(posX, posY, 137.5, 0, degrees)} y={this.textYValue(posX, posY, 137.5, 0, degrees)} width="30" height="30" requiredExtensions="http://www.w3.org/1999/xhtml">
                <div className={iconWrapperClass} onClick={function() {
                  console.log('clicked')
                }}>
                    <div className={"icon-" + resource}></div>
                </div>
            </foreignObject>
        )
    };

    polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    describeArc = function (x, y, radius, startAngle, endAngle) {
        endAngle = endAngle === 360 ? 359 : endAngle;
        var start = this.polarToCartesian(x, y, radius, endAngle);
        var end = this.polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    };

    textXValue = function (x, y, radius, startAngle, endAngle) {
        var end = this.polarToCartesian(x, y, radius, endAngle);

        return end.x - 7.5;
    };

    textYValue = function (x, y, radius, startAngle, endAngle) {
        var end = this.polarToCartesian(x, y, radius, endAngle);

        return end.y - 7.5;
    };
}