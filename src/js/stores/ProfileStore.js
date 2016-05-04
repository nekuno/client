import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore';
import LoginStore from '../stores/LoginStore';
import ActionTypes from '../constants/ActionTypes';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import selectn from 'selectn';

let _profiles = {};
let _metadata = null;

const ProfileStore = createStore({
    contains(userId, fields) {
        return isInBag(_profiles, userId, fields);
    },

    get(userId) {
        return _profiles[userId];
    },

    getMetadata(){
        return _metadata;
    },

    getWithMetadata(userId) {
        const basicProfile = this.get(userId);
        const metadata = this.getMetadata();

        if (!basicProfile || !metadata) {
            return {};
        }

        let profile = {};
        for (let label in basicProfile) {
            if (selectn(label, metadata)) {
                const thisMetadata = metadata[label];
                const type = thisMetadata.type;
                let name = thisMetadata.label;
                let value = '';
                switch (type) {
                    case 'choice':
                        let choices = thisMetadata.choices;
                        value = choices[basicProfile[label]];
                        break;
                    case 'double_choice':
                        let firstChoices = thisMetadata.choices;
                        const doubleChoices = thisMetadata.doubleChoices;
                        let firstChoice = basicProfile[label]['choice'];
                        let doubleChoiceValue = basicProfile[label]['detail'] ? doubleChoices[firstChoice][basicProfile[label]['detail']] : '';
                        value = firstChoices[firstChoice] + ' ' + doubleChoiceValue;
                        break;
                    case 'tags':
                        value = basicProfile[label];
                        break;
                    case 'multiple_choices':
                        let multiple_choices = thisMetadata['choices'];
                        let mchoices = [];
                        if (typeof basicProfile[label] === 'string') {
                            mchoices.push(multiple_choices[basicProfile[label]]);
                        } else {
                            for (let mchoice_label in basicProfile[label]) {
                                mchoices.push(multiple_choices[basicProfile[label][mchoice_label]]);
                            }
                        }
                        value = mchoices.join(', ');
                        break;
                    case 'tags_and_choice':
                        let tagChoices = thisMetadata['choices'];
                        let level = thisMetadata['choiceLabel']['es'];
                        let objects = basicProfile[label];
                        let values = []
                        for (let index in objects) {
                            let object = objects[index];
                            let newTag = object['tag'];
                            if (object['detail']) {
                                newTag += ' con ' + level + ' ' + tagChoices[object['detail']];
                            }
                            values.push(newTag);
                        }
                        value = values.join();
                        break;
                    case 'integer':
                        value = basicProfile[label];
                        break;
                    case 'birthday':
                        name = thisMetadata.label == 'Birthday' ? 'Age' : 'Edad';
                        const thatDate = new Date(basicProfile[label]);
                        const ageDifMs = Date.now() - thatDate.getTime();
                        const ageDate = new Date(ageDifMs); // miliseconds from epoch
                        value = Math.abs(ageDate.getUTCFullYear() - 1970);
                        break;
                    case 'location':
                        value = this.locationToString(basicProfile[label]);
                        break;
                    case 'textarea':
                        value = basicProfile[label];
                        break;
                    default:
                        break;
                }
                if (value === '') {
                    continue;
                } else if (value == false) {
                    value = 'No';
                }
                profile[name] = value.toString();

            }
        }
        return profile;
    },

    getMetadataLabel(filter, data) {
        let text, address, choice, choiceLabel, detail, textArray, tags;
        switch (filter.type) {
            case 'location':
                address = data && data && data.address ? data.address : data  && data.location ? data.location : '';
                return address ? filter.label + ' - ' + address : filter.label;
            case 'integer_range':
                text = filter.label;
                text += data && data.min ? ' - Min: ' + data.min : '';
                text += data && data.max ? ' - Max: ' + data.max : '';
                return text;
            case 'birthday_range':
                text = filter.label;
                text += data && data.min ? ' - Min: ' + data.min : '';
                text += data && data.max ? ' - Max: ' + data.max : '';
                return text;
            case 'integer':
                text = filter.label;
                text += data ? ' - ' + data : '';
                return text;
            case 'choice':
                choiceLabel = filter.choices[data];
                return choiceLabel ? filter.label + ' - ' + choiceLabel : filter.label;
            case 'double_choice':
                choice = filter.choices[Object.keys(filter.choices).find(key => key === data.choice)];
                detail = data.detail ? filter.doubleChoices[data.choice][Object.keys(filter.doubleChoices[data.choice]).find(key => key === data.detail)] : '';
                return choice ? filter.label + ' - ' + choice + ' ' + detail : filter.label;
            case 'multiple_choices':
                data = data || [];
                textArray = data.map(value => filter.choices[value]);
                return textArray.length > 0 ? filter.label + ' - ' + textArray.join(', ') : filter.label;
            case 'double_multiple_choices':
                data = data || [];
                textArray = data.map(value => value.detail && filter.doubleChoices[value.choice][value.detail] ? filter.choices[value.choice] + ' ' + filter.doubleChoices[value.choice][value.detail] : filter.choices[value.choice]);
                return textArray.length > 0 ? filter.label + ' - ' + textArray.join(', ') : filter.label;
            case 'tags':
                return data && data.length > 0 ? filter.label + ' - ' + data.join(', ') : filter.label;
            case 'tags_and_choice':
                return data && data.length > 0 ? filter.label + ' - ' + data.map(value => value.choice ? value.tag + ' ' + filter.choices[value.choice] : value.tag).join(', ') : filter.label;
            case 'tags_and_multiple_choices':
                return data && data.length > 0 ? filter.label + ' - ' + data.map(value => value.choices ? value.tag + ' ' + value.choices.map(choice => filter.choices[choice]['es']).join(', ') : value.tag).join(', ') : filter.label;

        }

        return '';
    },

    isProfileSet(filter, data) {
        switch (filter.type) {
            case 'location':
                return data  && (data.address || data.location);
            case 'integer_range':
                return data && (data.min || data.max);
            case 'birthday_range':
                return data && (data.min || data.max);
            case 'integer':
                return !!data;
            case 'choice':
                return !!data.choice;
            case 'double_choice':
                return !!data.choice;
            case 'multiple_choices':
                return data && data.length > 0;
            case 'double_multiple_choices':
                return data && data.length > 0;
            case 'tags':
                return data && data.length > 0;
            case 'tags_and_choice':
                return data && data.length > 0;
            case 'tags_and_multiple_choices':
                return data && data.length > 0;
            default:
                return false;
        }
    },

    locationToString(location) {

        const locality = selectn('locality', location);
        const country = selectn('country', location);

        return locality && country ?
        locality + ', ' + country :
            selectn('address', location);
    }
});

ProfileStore.dispatchToken = register(action => {

    waitFor([UserStore.dispatchToken, LoginStore.dispatchToken]);

    switch (action.type) {

        case ActionTypes.REQUEST_METADATA_SUCCESS:
            _metadata = action.response;
            ProfileStore.emitChange();
            break;
        case ActionTypes.LIKE_USER_SUCCESS:
            _profiles = setLikedUser(action.to, _profiles);
            ProfileStore.emitChange();
            break;
        case ActionTypes.UNLIKE_USER_SUCCESS:
            _profiles = setUnlikedUser(action.to, _profiles);
            ProfileStore.emitChange();
            break;
        case ActionTypes.EDIT_PROFILE_SUCCESS:
            const currentProfile = _profiles[LoginStore.user.id];
            if (currentProfile.interfaceLanguage !== action.data.interfaceLanguage){
                UserActionCreators.requestMetadata();
                ThreadActionCreators.requestFilters();
            }
            _profiles[LoginStore.user.id]=action.data;
            break;
        default:
            break;
    }

    const responseProfiles = selectn('response.entities.profiles', action);
    if (responseProfiles) {

        const { userId } = action;

        //undefined comes from not id selected on normalizr
        responseProfiles[userId] = responseProfiles.undefined;
        delete responseProfiles.undefined;

        mergeIntoBag(_profiles, responseProfiles);
        ProfileStore.emitChange();
    }

    function setLikedUser(userId, _profiles) {
        if (_profiles.hasOwnProperty(userId)) {
            _profiles[userId]['like'] = 1;
        }

        return _profiles;
    }

    function setUnlikedUser(userId, _profiles) {
        if (_profiles.hasOwnProperty(userId)) {
            _profiles[userId]['like'] = 0;
        }
        return _profiles;
    }
});

export default ProfileStore;