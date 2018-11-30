import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class CreatingProposalStore extends BaseStore {

    setInitial() {
        this._proposal = {'fields': {}}
    }

    _registerToActions(action) {
        super._registerToActions(action);
        switch (action.type) {
            case ActionTypes.MERGE_CREATING_PROPOSAL:
                this._mergeData(action.data);
                this.emitChange();
                break;
            case ActionTypes.CLEAN_CREATING_PROPOSAL:
                this.setInitial();
                this.emitChange();
                break;
            default:
                break;
        }
    }

    _mergeData(data)
    {
        Object.keys(data).forEach(function(key) {

            if (key === 'fields'){
                Object.keys(data[key]).forEach((fieldKey => {
                    const fieldValue = data[key][fieldKey];
                    this._proposal.fields[fieldKey] = fieldValue;
                }));
                return;
            }

            const baseLevelKeys = ['filters', 'type', 'locale', 'availability', 'participantLimit'];
            if (baseLevelKeys.includes(key)){
                Object.assign(this._proposal, data);
            } else {
                Object.assign(this._proposal.fields, data);
            }

        }.bind(this));
    }

    get proposal() {
        return this._proposal;
    }
}

export default new CreatingProposalStore();
