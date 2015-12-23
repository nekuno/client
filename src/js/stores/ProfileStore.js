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
    }
});

ProfileStore.dispatchToken = register(action => {
    waitFor([UserStore.dispatchToken]);

    if(action.type == ActionTypes.LIKE_USER_SUCCESS) {
        const { to } = action;
        _profiles = setLikedUser(to, _profiles);

        ProfileStore.emitChange();
    }
    else if(action.type == ActionTypes.UNLIKE_USER_SUCCESS) {
        const { to } = action;
        _profiles = setUnlikedUser(to, _profiles);
        ProfileStore.emitChange();
    }

    const responseProfiles = selectn('response.entities.profiles', action);
    if (responseProfiles) {

        const {userId} = action;

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
    //TODO: Move to own store?
    const responseMetadata = selectn('response.entities.metadata', action);
    if (responseMetadata){
        _metadata = responseMetadata.undefined;
        console.log('setting metadata');
        console.log(_metadata);
    }
});

export default ProfileStore;