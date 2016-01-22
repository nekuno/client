import React, { PropTypes, Component } from 'react';

export default class ProfileData extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    };

    render() {
        const {name, value} = this.props;

        return (
            <div className="profile-data">
                <span className="profile-data-name">{name}</span>  <span className="profile-data-value">{value}</span>
            </div>
        );
    }

}
