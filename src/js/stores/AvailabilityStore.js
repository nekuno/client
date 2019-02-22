import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class AvailabilityStore extends BaseStore {

    setInitial() {
        this._availability = {'static': [], 'dynamic': []}
    }

    _registerToActions(action) {
        super._registerToActions(action);
        switch (action.type) {
            case ActionTypes.EDIT_AVAILABILITY:
                this.availability = action.availability;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_LOGIN_USER_SUCCESS:
            case ActionTypes.REQUEST_AUTOLOGIN_SUCCESS:
                this.availability = action.response.user.availability ? action.response.user.availability : this._availability;
                console.log(this.ownAvailability);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_REGISTER_USER_SUCCESS:
                this.availability = action.availability;
                this.emitChange();
                break;
            default:
                break;
        }
    }

    get ownAvailability() {
        return this._availability;
    }

    set availability(availability) {
        availability.dynamic.forEach((dynamicCase) => {
            dynamicCase.weekday = dynamicCase.weekday.toLowerCase();
        });

        this._availability = availability;
    }

}

export default new AvailabilityStore();
