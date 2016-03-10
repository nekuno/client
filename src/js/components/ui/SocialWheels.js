import React, { PropTypes, Component } from 'react';

export default class SocialWheels extends Component {
    static propTypes = {
        picture: PropTypes.string,
        twitterFetching: PropTypes.bool,
        twitterFetched: PropTypes.bool,
        twitterProgress: PropTypes.number,
        facebookFetching: PropTypes.bool,
        facebookFetched: PropTypes.bool,
        facebookProgress: PropTypes.number,
        googlePlusFetching: PropTypes.bool,
        googlePlusFetched: PropTypes.bool,
        googlePlusProgress: PropTypes.number,
        spotifyFetching: PropTypes.bool,
        spotifyFetched: PropTypes.bool,
        spotifyProgress: PropTypes.number
    };

    render() {
        const picture = "https://nekuno.com/media/cache/user_avatar_180x180/user/images/msalsas_1445885030.jpg";
        const posX = 125;
        const posY = 125;
        const facebookFetching = true;
        const twitterFetching = false;
        const spotifyFetching = false;
        const googlePlusFetching = false;
        const facebookFetched = false;
        const twitterFetched = false;
        const spotifyFetched = true;
        const googlePlusFetched = false;
        const facebookProgress = 0;
        const twitterProgress = 300;
        const spotifyProgress = 0;
        const googlePlusProgress = 95;

        return (
            <div className="social-wheels">
                <svg width="250" height="250" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path d={this.describeArc(posX, posY, 112.5, 0, 359.9)} className="wheel-separator"/>
                        <path d={this.describeArc(posX, posY, 100, 0, 359.9)} className="wheel-separator"/>
                        <path d={this.describeArc(posX, posY, 87.5, 0, 359.9)} className="wheel-separator"/>
                        <path d={this.describeArc(posX, posY, 75, 0, 359.9)} className="wheel-separator"/>
                        <path d={this.describeArc(posX, posY, 62.5, 0, 359.9)} className="wheel-separator"/>
                        <path d={this.describeArc(posX, posY, 50, 0, 359.9)} className="wheel-separator"/>
                        <path d={this.describeArc(posX, posY, 37.5, 0, 359.9)} className="wheel-separator"/>

                        <image xlinkHref={picture} x={posX - 25} y={posY - 25} height="50px" width="50px" clipPath="url(#clip)"/>
                        <clipPath id="clip">
                            <rect id="rect" x={posX - 25} y={posY - 25} width="50px" height="50px" rx="25"/>
                        </clipPath>
                        <path d={this.describeArc(posX, posY, 25, 0, 359.9)} className="wheel-picture"/>

                        <path d={this.describeArc(posX, posY, 112.5, 0, facebookProgress)} className="wheel-facebook"/>
                        {this.renderIcon('facebook', 112.5, facebookProgress, posX, posY, facebookFetching, facebookFetched)}
                        <path d={this.describeArc(posX, posY, 87.5, 0, spotifyProgress)} className="wheel-spotify"/>
                        {this.renderIcon('spotify', 87.5, spotifyProgress, posX, posY, spotifyFetching, spotifyFetched)}
                        <path d={this.describeArc(posX, posY, 62.5, 0, twitterProgress)} className="wheel-twitter"/>
                        {this.renderIcon('twitter', 62.5, twitterProgress, posX, posY, twitterFetching, twitterFetched)}
                        <path d={this.describeArc(posX, posY, 37.5, 0, googlePlusProgress)} className="wheel-google-plus"/>
                        {this.renderIcon('google-plus', 37.5, googlePlusProgress, posX, posY, googlePlusFetching, googlePlusFetched)}
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

    renderIcon = function (resource, radius, degrees, posX, posY, fetching, fetched) {
        if (fetching) {
            return this.renderFetchingIcon(resource, radius, posX, posY);
        } else if (fetched) {
            return this.renderFetchedIcon(resource, radius, posX, posY);
        } else {
            return this.renderProcessingIcon(resource, radius, degrees, posX, posY);
        }
    };

    polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    describeArc = function (x, y, radius, startAngle, endAngle){

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