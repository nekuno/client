import { REQUIRED_REGISTER_PROFILE_FIELDS, SOCIAL_NETWORKS_NAMES } from '../constants/Constants';
import { waitFor } from '../dispatcher/Dispatcher';
import { isInBag, mergeIntoBag } from '../utils/StoreUtils';
import BaseStore from './BaseStore';
import UserStore from '../stores/UserStore';
import LoginStore from '../stores/LoginStore';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';
import { getValidationErrors } from '../utils/StoreUtils';

class NaturalCategoryStore extends BaseStore {

    setInitial() {
        this._natural = {};
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken, LoginStore.dispatchToken]);
        super._registerToActions(action);
        let slug;
        switch (action.type) {
            case ActionTypes.REQUEST_OTHER_USER_SUCCESS:
                slug = action.slug;
                this._initialize(slug);
                this._natural[slug] = action.response.naturalProfile;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_OWN_USER_PAGE_SUCCESS:
                slug = LoginStore.user.slug;
                this._initialize(slug);
                this._natural[slug] = action.response.naturalProfile;
                this.emitChange();
                break;
        }
    }

    _initialize(slug)
    {
        this._natural[slug] = this._natural[slug] || {};
    }

    get(slug) {
        return this._natural[slug];
    }
}

export default new NaturalCategoryStore();