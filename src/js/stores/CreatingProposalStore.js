import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import { getValidationErrors } from '../utils/StoreUtils';

class CreatingProposalStore extends BaseStore {

    setInitial() {
        this._proposal = {}
    }

    _registerToActions(action) {
        super._registerToActions(action);
        switch (action.type) {
            case ActionTypes.MERGE_CREATING_PROPOSAL:
                Object.assign(this._proposal, action.data);
                this.emitChange();
                break;
            default:
                break;
        }
    }

    get proposal() {
        return this._proposal;
    }
}

export default new CreatingProposalStore();
