import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import selectn from 'selectn';

export default class ProfileData extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    };

    //shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const {name, value} = this.props;

        return (
            <div>
                {name} : {value}
            </div>
        );
    }

}
