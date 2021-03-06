import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ProfileData from './ProfileData'

export default class OtherProfileDataList extends Component {

    static propTypes = {
        profileWithMetadata: PropTypes.array.isRequired,
        metadata           : PropTypes.object.isRequired,
    };

    render() {
        const {profileWithMetadata, metadata} = this.props;
        let lines = [];
        profileWithMetadata.forEach(
            category => {
                if (Object.keys(category.fields).length === 0 || !Object.keys(category.fields).some(profileDataKey => category.fields[profileDataKey].value)) {
                    return;
                }
                lines.push(<div key={category.label} className="profile-category"><h3>{category.label}</h3></div>);
                Object.keys(category.fields).forEach(
                    profileDataKey => {
                        if (category.fields[profileDataKey].value && metadata[profileDataKey].hidden !== true) {
                            lines.push(<ProfileData key={profileDataKey} name={category.fields[profileDataKey].text} value={category.fields[profileDataKey].value} forceLong={category.fields[profileDataKey].type === 'textarea'}/>);
                        }
                    });
            });
        return (
            <div className="profile-data-list">
                {lines}
            </div>
        );
    }

}
