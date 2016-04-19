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

}

export default new FilterStore();