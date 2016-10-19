import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import selectn from 'selectn';

//Store which filters can the logged user apply
class FilterStore extends BaseStore {

    setInitial() {
        this._error = null;
        this._groups = [];
    }

    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.REQUEST_STATS:
                this._error = null;
                this._groups = [];
                this.emitChange();
                break;

            case ActionTypes.REQUEST_STATS_SUCCESS:
                this._error = null;
                this._groups = action.response;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_FILTERS_ERROR:
                this._error = action.error;
                this._groups = null;
                this.emitChange();
                break;

            default:
                break;
        }
    }

    get error() {
        return this._error;
    }

    get filters() {
        return this._filters;
    }
    
    getFilterLabel(filter, data) {
        let text, address, choice, choiceLabel, detail, textArray, tags;
        switch (filter.type) {
            case 'location_distance':
                address = data && data.location && data.location.address ? data.location.address : data && data.location && data.location.location ? data.location.location : '';
                address = address && data.distance ? address + ' (' + data.distance + ' Km)' : address;
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
                //choice = filter.choices.find(choice => choice.value === data);
                //choiceLabel = choice ? choice.label : '';
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
    }

    isFilterSet(filter, data) {
        switch (filter.type) {
            case 'location_distance':
                return data && data.location && (data.location.address || data.location.location);
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
    }
}

export default new FilterStore();