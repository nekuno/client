import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import selectn from 'selectn';
import ProfileData from './ProfileData'

export default class ProfileDataList extends Component {
    static propTypes = {
        profile: PropTypes.object.isRequired
    };

    //shouldComponentUpdate = shouldPureComponentUpdate;

    locationToString(location){

        const locality = selectn('locality', location);
        const country = selectn('country', location);

        return  locality && country?
                locality + ', '+country :
                selectn('address', location);
    }

    birthdayToAge(birthday){
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
            if (this.props.profile.hasOwnProperty(profileDataName)){
                profileDataValue = this.props.profile[profileDataName];
            } else {
                continue;
            }

            if (profileDataName === 'location') {
                profileDataValue = this.locationToString(profileDataValue);
            } else if (profileDataName === 'birthday') {
                profileDataName = 'age';
                profileDataValue = this.birthdayToAge(profileDataValue);
            }

            profileDataList[counter++] = <ProfileData name = {profileDataName} value = {profileDataValue} />;
        }

        return (
            <div>
                {profileDataList.map(profileDataValue => profileDataValue)}
            </div>
        );
    }

}
