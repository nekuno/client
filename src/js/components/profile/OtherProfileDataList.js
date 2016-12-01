import React, { PropTypes, Component } from 'react';
import ProfileData from './ProfileData'

export default class OtherProfileDataList extends Component {

    static propTypes = {
        profileWithMetadata: PropTypes.array.isRequired
    };

    render() {
        const {profileWithMetadata} = this.props;
        let lines = [];
        profileWithMetadata.forEach(
            category => {
                if (Object.keys(category.fields).length === 0 || !Object.keys(category.fields).some(profileDataKey => category.fields[profileDataKey].value)) {
                    return;
                }
                lines.push(<div key={category.label} className="profile-category"><h3>{category.label}</h3></div>);
                Object.keys(category.fields).forEach(
                    profileDataKey => {
                        if (category.fields[profileDataKey].value) {
                            lines.push(<ProfileData key={profileDataKey} name={category.fields[profileDataKey].text}
                                                    value={category.fields[profileDataKey].value}/>);
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
