import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import ProfileData from './ProfileData'
import ProfileAboutMe from './ProfileAboutMe'

export default class ProfileDataList extends Component {
    static propTypes = {
        profile: PropTypes.object.isRequired
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
        const {profile} = this.props;
        return (
            <div className="profile-data-list">
                {Object.keys(profile).map(profileDataName => profileDataName == 'About me' || profileDataName === 'Sobre mí' ? <ProfileAboutMe key={profileDataName} value={profile[profileDataName]}/> : null)}
                {Object.keys(profile).map(profileDataName => profileDataName !== 'About me' && profileDataName !== 'Sobre mí' ? <ProfileData key={profileDataName} name={profileDataName} value={profile[profileDataName]}/> : null)}
            </div>
        );
    }

}
