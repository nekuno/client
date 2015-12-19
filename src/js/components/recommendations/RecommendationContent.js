import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';

export default class RecommendationContent extends Component {
    static propTypes = {
        recommendation: PropTypes.object.isRequired,
        last: PropTypes.bool.isRequired,
        accessibleKey: PropTypes.number.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let recommendation = this.props.recommendation;
        let last = this.props.last;
        let key = this.props.accessibleKey;
        return (
            <div className="recommendation">
                {/* TODO: <CardContent {...this.props} />*/}
            </div>
        );
    }
}
