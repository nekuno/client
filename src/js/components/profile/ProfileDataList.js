import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import ProfileData from './ProfileData'
import ProfileAboutMe from './ProfileAboutMe'

export default class ProfileDataList extends Component {
    static propTypes = {
        profile: PropTypes.object.isRequired
    };

    //shouldComponentUpdate = shouldPureComponentUpdate;

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
        let profileDataList = [];
        let counter = 0;
        for (let profileDataName in this.props.profile) {
            //let profileDataValue = selectn('profile['+profileDataName+']', this.props);
            let profileDataValue = null;
            if (this.props.profile.hasOwnProperty(profileDataName)) {
                profileDataValue = this.props.profile[profileDataName];
            } else {
                continue;
            }

            if (profileDataName === 'About Me' || profileDataName === 'Sobre mí') {
                const profileAboutMeName = 'Sobre mí';
                profileDataList[counter++] = <ProfileAboutMe key={profileAboutMeName} name={profileAboutMeName} value={profileDataValue}/>;
            } else {

                profileDataList[counter++] = <ProfileData key={profileDataName} name={profileDataName} value={profileDataValue}/>;
            }

        }

        return (
            <div className="profile-data-list">
                {profileDataList.map(profileDataValue => profileDataValue)}
            </div>
        );
    }

}
