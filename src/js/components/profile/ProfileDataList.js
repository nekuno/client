import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import ProfileData from './ProfileData'
import ProfileAboutMe from './ProfileAboutMe'

export default class ProfileDataList extends Component {

    static propTypes = {
        profile            : PropTypes.object.isRequired,
        profileWithMetadata: PropTypes.array.isRequired
    };

    locationToString(location) {

        const locality = selectn('locality', location);
        const country = selectn('country', location);

        return locality && country ?
        locality + ', ' + country :
            selectn('address', location);
    }

    birthdayToAge(birthday) {
        birthday = new Date(birthday);
        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
    }

    render() {
        const {profile, profileWithMetadata} = this.props;
        let lines = [];
        profileWithMetadata.forEach(
            category => {
                lines.push(<div key={category.label} className="profile-category"><h3>{category.label}</h3></div>);
                Object.keys(category.fields).map(
                    profileDataName => {
                        lines.push(<ProfileData key={profileDataName} name={profileDataName} value={category.fields[profileDataName]}/>);
                    });
            });
        return (
            <div className="profile-data-list">
                <ProfileAboutMe value={profile.description}/>
                {lines}
            </div>
        );
    }

}
