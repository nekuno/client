import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore';
import ActionTypes from '../constants/ActionTypes';
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

        if (!(basicProfile || metadata)) {
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
                        let doubleChoice = basicProfile[label]['detail'];
                        value = firstChoices[firstChoice] + ' ' + doubleChoices[firstChoice][doubleChoice];
                        break;
                    case 'tags':
                        value = basicProfile[label];
                        break;
                    case 'multiple_choices':
                        let multiple_choices = thisMetadata['choices'];
                        let mchoices = [];
                        for (let mchoice_label in basicProfile[label]) {
                            mchoices.push(multiple_choices[mchoice_label]);
                        }
                        value = mchoices.join();
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

    locationToString(location) {

        const locality = selectn('locality', location);
        const country = selectn('country', location);

        return locality && country ?
        locality + ', ' + country :
            selectn('address', location);
    }
});

ProfileStore.dispatchToken = register(action => {

    waitFor([UserStore.dispatchToken]);

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