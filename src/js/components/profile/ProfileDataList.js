import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import selectn from 'selectn';
import ProfileData from './ProfileData'
import ProfileAboutMe from './ProfileAboutMe'

export default class ProfileDataList extends Component {
    static propTypes = {
        profile: PropTypes.object.isRequired
    };

    //shouldComponentUpdate = shouldPureComponentUpdate;

    locationToString(location){

        const locality = selectn('locality', location);
        const country = selectn('country', location);

        return  locality && country?
                locality + ', ' + country :
                selectn('address', location);
    }

    birthdayToAge(birthday){
        birthday = new Date(birthday);
        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
    }

    getTexts(name, value){
        switch(name){
            case 'location':
                name = 'Ubicación';
                value = this.locationToString(value);
                break;
            case 'birthday':
                name = 'Edad';
                value = this.birthdayToAge(value);
                break;
            case 'zodiacSign':
                name = 'Signo del zodíaco';
                //TODO: Translate sign
                break;
            case 'orientation':
                name = 'Orientación sexual';
                break;
            case 'gender':
                name = 'Género';
                value = (value === 'male'? 'Hombre' : 'Mujer');
                break;
            case 'interfaceLanguage':
                name = 'Idioma de la intefaz';
                value = 'Español';
                break;

        }

        return {name, value}
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

            if (profileDataName === 'description'){
                const profileAboutMeName = 'Sobre mí';
                profileDataList[counter++] = <ProfileAboutMe key = {profileAboutMeName} name = {profileAboutMeName} value = {profileDataValue} />;
            } else {
                const texts = this.getTexts(profileDataName, profileDataValue);

                profileDataName = texts.name;
                profileDataValue = texts.value;

                profileDataList[counter++] = <ProfileData key={profileDataName} name={profileDataName} value={profileDataValue} />;
            }

        }

        return (
            <div className="profileDataList">
                {profileDataList.map(profileDataValue => profileDataValue)}
            </div>
        );
    }

}
