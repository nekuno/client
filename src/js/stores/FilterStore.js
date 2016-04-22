import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import selectn from 'selectn';

//Store which filters can the logged user apply
class FilterStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._error = null;
        this._filters = null;
    }

    _registerToActions(action) {
        switch (action.type) {

            case ActionTypes.REQUEST_FILTERS:
                this._error = null;
                this._filters = null;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_FILTERS_SUCCESS:
                this._error = null;
                this._filters = action.response;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_FILTERS_ERROR:
                this._error = action.error;
                this._filters = null;
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

    getFiltersText(filters) {

        let texts = [];

        if (this._filters) {

            if (selectn('profileFilters') || selectn('userFilters')) {
                // Users
                texts.push({label: 'Personas'});
                Object.keys(filters).forEach((category) => {
                    Object.keys(filters[category]).forEach((widgetKey) => {
                        if (selectn(category + '.' + widgetKey, this._filters)) {
                            let filter = selectn(category + '.' + widgetKey, this._filters);
                            let widget = filters[category][widgetKey];
                            switch (filter.type) {
                                case 'location':
                                    texts.push({label: 'A ' + widget.distance + ' km de ' + widget.location.latitude + ', ' + widget.location.longitude});
                                    break;
                                case 'choice':
                                    widget.forEach((item) => {
                                        texts.push({label: filter.choices[item]});
                                    });
                                    break;
                                case 'multiple_choices':
                                    break;
                                case 'double_choice':
                                    break;
                                case 'tags':
                                    break;
                                case 'tags_and_choice':
                                    break;
                                case 'birthday':
                                    break;
                                case 'integer':
                                    break;
                            }
                        }
                    });
                });

            } else {
                // Content
                texts.push({label: 'Contenido'});
            }
        }

        console.log(this._filters);
        console.log(filters);

        return texts;
    }
    
    getFilterLabel(filter) {
        let text, choice, choiceLabel, detail, address, values, textArray, tags;
        switch (filter.type) {
            case 'location_distance':
                address = filter.value ? filter.value.address : '';
                return address ? filter.label + ' - ' + address : filter.label;
            case 'integer_range':
                text = filter.label;
                text += !isNaN(filter.value_min) ? ' - Min: ' + filter.value_min : '';
                text += !isNaN(filter.value_max) ? ' - Max: ' + filter.value_max : '';
                return text;
            case 'integer':
                text = filter.label;
                text += !isNaN(filter.value) ? ' - ' + filter.value : '';
                return text;
            case 'choice':
                choice = filter.choices.find(choice => choice.value === filter.choice);
                choiceLabel = choice ? choice.label : '';
                return choiceLabel ? filter.label + ' - ' + choiceLabel : filter.label;
            case 'double_choice':
                choice = filter.choices[Object.keys(filter.choices).find(key => key === filter.choice)];
                detail = filter.detail ? filter.doubleChoices[filter.choice][Object.keys(filter.doubleChoices[filter.choice]).find(key => key === filter.detail)] : '';
                return choice ? filter.label + ' - ' + choice + ' ' + detail : filter.label;
            case 'multiple_choices':
                values = filter.values || [];
                textArray = values.map(value => filter.choices[value]);
                return textArray.length > 0 ? filter.label + ' - ' + textArray.join(', ') : filter.label;
            case 'double_multiple_choices':
                values = filter.values || [];
                textArray = values.map(value => filter.doubleChoices[value.choice][value.detail] ? filter.choices[value.choice] + ' ' + filter.doubleChoices[value.choice][value.detail] : filter.choices[value.choice]);
                return textArray.length > 0 ? filter.label + ' - ' + textArray.join(', ') : filter.label;
            case 'tags':
                tags = filter.values;
                return tags && tags.length > 0 ? filter.label + ' - ' + tags.join(', ') : filter.label;
            case 'tags_and_choice':
                values = filter.values;
                return values && values.length > 0 ? filter.label + ' - ' + values.map(value => value.choice ? value.tag + ' ' + filter.choices[value.choice] : value.tag).join(', ') : filter.label;
        }
        
        return '';
    }

    isFilterSet(filter) {
        switch (filter.type) {
            case 'location_distance':
                return filter.value && filter.value.address;
            case 'integer_range':
                return filter.value_min || filter.value_max;
            case 'integer':
                return filter.value;
            case 'choice':
                return !!filter.choice;
            case 'double_choice':
                return !!filter.choice;
            case 'multiple_choices':
                return filter.values && filter.values.length > 0;
            case 'double_multiple_choices':
                return filter.values && filter.values.length > 0;
            case 'tags':
                return filter.values && filter.values.length > 0;
            case 'tags_and_choice':
                return filter.values && filter.values.length > 0;
            default:
                return false;
        }
    }
}

export default new FilterStore();