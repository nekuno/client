import React, { PropTypes, Component } from 'react';

export default class LoadingSpinnerCSS extends Component {

    static propTypes = {
        small: PropTypes.bool
    };

    render() {
        const {small} = this.props;
        return (
            small ?
                <div className="spinner-wrapper spinner-wrapper-small">
                    <div className="icon-spinner rotation-animation"></div>
                </div>
                :
                <div className="spinner-wrapper">
                    <div className="icon-spinner rotation-animation"></div>
                </div>
        );
    }
}