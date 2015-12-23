import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore'
import selectn from 'selectn';

const _profiles = {};

const ProfileStore = createStore({
    contains(userId, fields) {
        return isInBag(_profiles, userId, fields);
    },

    get(userId) {
        return _profiles[userId];
    }
});

ProfileStore.dispatchToken = register(action => {
    waitFor([UserStore.dispatchToken]);
    const responseProfiles = selectn('response.entities.profiles', action);
    if (responseProfiles) {

        const {userId} = action;

        //undefined comes from not id selected on normalizr
        responseProfiles[userId] = responseProfiles.undefined;
        delete responseProfiles.undefined;

        mergeIntoBag(_profiles, responseProfiles);
        ProfileStore.emitChange();
    }
});

export default ProfileStore;