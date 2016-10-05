import React, { PropTypes, Component } from 'react';

export default class LoadingSpinnerCSS extends Component {

    static propTypes = {
        small: PropTypes.bool
    };

    render() {
        const {small} = this.props;
        return (
            small ?
                <div id="circularG-small">
                    <div id="circularG_1-small" className="circularG circularG-small"></div>
                    <div id="circularG_2-small" className="circularG circularG-small"></div>
                    <div id="circularG_3-small" className="circularG circularG-small"></div>
                    <div id="circularG_4-small" className="circularG circularG-small"></div>
                    <div id="circularG_5-small" className="circularG circularG-small"></div>
                    <div id="circularG_6-small" className="circularG circularG-small"></div>
                    <div id="circularG_7-small" className="circularG circularG-small"></div>
                    <div id="circularG_8-small" className="circularG circularG-small"></div>
                </div>
                :
                <div id="circularG">
                    <div id="circularG_1" className="circularG"></div>
                    <div id="circularG_2" className="circularG"></div>
                    <div id="circularG_3" className="circularG"></div>
                    <div id="circularG_4" className="circularG"></div>
                    <div id="circularG_5" className="circularG"></div>
                    <div id="circularG_6" className="circularG"></div>
                    <div id="circularG_7" className="circularG"></div>
                    <div id="circularG_8" className="circularG"></div>
                </div>
        );
    }
}