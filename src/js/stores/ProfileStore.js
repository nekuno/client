import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore'
import selectn from 'selectn';

const _profiles = {};

const ProfileStore = createStore({
    contains(login, fields) {
        return isInBag(_profiles, login, fields);
    },

    get(login) {
        return _profiles[login];
    }
});

ProfileStore.dispatchToken = register(action => {
    waitFor([UserStore.dispatchToken]);
    const responseProfiles = selectn('response.entities.profiles', action);
    if (responseProfiles) {

        const {login} = action;

        //undefined comes from not id selected on normalizr
        responseProfiles[login] = responseProfiles.undefined;
        delete responseProfiles.undefined;

        mergeIntoBag(_profiles, responseProfiles);
        ProfileStore.emitChange();
    }
});

export default ProfileStore;