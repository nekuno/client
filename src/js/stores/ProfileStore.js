import { REQUIRED_REGISTER_PROFILE_FIELDS } from '../constants/Constants';
import { waitFor } from '../dispatcher/Dispatcher';
import { isInBag, mergeIntoBag } from '../utils/StoreUtils';
import BaseStore from './BaseStore';
import UserStore from '../stores/UserStore';
import LoginStore from '../stores/LoginStore';
import ActionTypes from '../constants/ActionTypes';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import selectn from 'selectn';
import { getValidationErrors } from '../utils/StoreUtils';

class ProfileStore extends BaseStore {

    setInitial() {
        this._profiles = {};
        this._metadata = null;
        this._categories = null;
        this._initialRequiredProfileQuestionsCount = 0;
        this._errors = null;
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken, LoginStore.dispatchToken]);
        super._registerToActions(action);
        switch (action.type) {
            case ActionTypes.REQUEST_OWN_PROFILE:
            case ActionTypes.REQUEST_PROFILE:
            case ActionTypes.REQUEST_OWN_PROFILE_ERROR:
            case ActionTypes.REQUEST_PROFILE_ERROR:
                break;
            case ActionTypes.REQUEST_OWN_PROFILE_SUCCESS:
                this._profiles[action.userId] = this._profiles[action.userId] || {};
                mergeIntoBag(this._profiles[action.userId], action.response);
                this._setInitialRequiredProfileQuestionsCount(action.userId);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_LOGIN_USER_SUCCESS:
            case ActionTypes.REQUEST_AUTOLOGIN_SUCCESS:
                this._profiles[LoginStore.user.id] = this._profiles[LoginStore.user.id] || {};
                mergeIntoBag(this._profiles[LoginStore.user.id], action.response.profile);
                this._setInitialRequiredProfileQuestionsCount(LoginStore.user.id);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PROFILE_SUCCESS:
                this._profiles[action.userId] = this._profiles[action.userId] || {};
                mergeIntoBag(this._profiles[action.userId], action.response);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_METADATA_SUCCESS:
                this._metadata = action.response;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_CATEGORIES_SUCCESS:
                this._categories = action.response.profile;
                this.emitChange();
                break;
            case ActionTypes.LIKE_USER_SUCCESS:
                this._profiles = this.setLikedUser(action.to, this._profiles);
                this.emitChange();
                break;
            case ActionTypes.UNLIKE_USER_SUCCESS:
                this._profiles = this.setUnlikedUser(action.to, this._profiles);
                this.emitChange();
                break;
            case ActionTypes.EDIT_PROFILE_SUCCESS:
                const currentProfile = this._profiles[LoginStore.user.id];
                if (currentProfile.interfaceLanguage !== action.data.interfaceLanguage) {
                    window.setTimeout(() => {
                        UserActionCreators.requestMetadata();
                        ThreadActionCreators.requestFilters();
                    }, 0);
                }
                this._profiles[LoginStore.user.id] = action.data;
                this.emitChange();
                break;
            case ActionTypes.EDIT_PROFILE_ERROR:
                this._errors = getValidationErrors(action.error);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS:
                action.response.items.forEach(item => this._profiles[item.id] = item.profile ? item.profile : null);
                this.emitChange();
                break;
            default:
                break;
        }
    }

    contains(userId, fields) {
        return isInBag(this._profiles, userId, fields);
    }

    get(userId) {
        return this._profiles[userId];
    }

    getErrors() {
        const errors = this._errors;
        this._errors = null;
        return errors;
    }

    getMetadata(){
        return this._metadata;
    }

    getCategories(){
        return this._categories;
    }

    getWithMetadata(userId) {
        const basicProfile = this.get(userId);
        const metadata = this.getMetadata();
        const categories = this.getCategories();

        if (!basicProfile || !metadata || !categories) {
            return [];
        }

        let profile = [];

        categories.forEach(category => {

            let fields = {};

            Object.keys(category.fields).forEach(id => {

                let field = category.fields[id];
                let name = null;
                let value = '';
                let type = null;

                if (selectn(field, basicProfile) && selectn(field, metadata)) {
                    const thisMetadata = metadata[field];
                    type = thisMetadata.type;
                    name = thisMetadata.label;
                    value = '';
                    switch (type) {
                        case 'choice':
                            let choices = thisMetadata.choices;
                            value = choices[basicProfile[field]];
                            break;
                        case 'double_choice':
                            let firstChoices = thisMetadata.choices;
                            const doubleChoices = thisMetadata.doubleChoices;
                            let firstChoice = basicProfile[field]['choice'];
                            let doubleChoiceValue = basicProfile[field]['detail'] ? doubleChoices[firstChoice][basicProfile[field]['detail']] : '';
                            value = firstChoices[firstChoice] + ' ' + doubleChoiceValue;
                            break;
                        case 'tags':
                            value = basicProfile[field];
                            break;
                        case 'multiple_choices':
                            let multiple_choices = thisMetadata['choices'];
                            let mchoices = [];
                            if (typeof basicProfile[field] === 'string') {
                                mchoices.push(multiple_choices[basicProfile[field]]);
                            } else {
                                for (let mchoice_label in basicProfile[field]) {
                                    mchoices.push(multiple_choices[basicProfile[field][mchoice_label]]);
                                }
                            }
                            value = mchoices.join(', ');
                            break;
                        case 'tags_and_choice':
                            let tagChoices = thisMetadata['choices'];
                            let level = thisMetadata['choiceLabel']['es'];
                            let objects = basicProfile[field];
                            let values = [];
                            for (let index in objects) {
                                let object = objects[index];
                                let newTag = object['tag'];
                                if (object['choice']) {
                                    newTag += ': ' + level + ' ' + tagChoices[object['choice']];
                                }
                                values.push(newTag);
                            }
                            value = values.join(', ');
                            break;
                        case 'integer':
                            value = basicProfile[field];
                            break;
                        case 'birthday':
                            name = thisMetadata.label == 'Birthday' ? 'Age' : 'Edad';
                            const thatDate = new Date(basicProfile[field]);
                            const ageDifMs = Date.now() - thatDate.getTime();
                            const ageDate = new Date(ageDifMs); // miliseconds from epoch
                            value = Math.abs(ageDate.getUTCFullYear() - 1970);
                            break;
                        case 'location':
                            value = this.locationToString(basicProfile[field]);
                            break;
                        case 'textarea':
                            value = basicProfile[field];
                            break;
                        default:
                            break;
                    }
                    if (value === '') {
                        return;
                    } else if (value == false) {
                        return;
                    }
                }
                fields[field] = {
                    text : name,
                    value: value.toString(),
                    type : type
                }
            });

            profile.push(
                {
                    label : category.label,
                    fields: fields
                }
            );
        });

        return profile;
    }

    getMetadataLabel(filter, data) {
        let text, address, choice, choiceLabel, detail, textArray, tags;
        switch (filter.type) {
            case 'location':
                address = data && data && data.address ? data.address : data && data.location ? data.location : '';
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
            case 'birthday':
                text = filter.label;
                text += data ? ' -  ' + data : '';
                return text;
            case 'textarea':
                text = filter.label;
                text += data ? ' -  ' + data : '';
                return text;
            case 'integer':
                text = filter.label;
                text += data ? ' - ' + data : '';
                return text;
            case 'choice':
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

    isProfileSet(field, data) {
        switch (field.type) {
            case 'location':
                return data && (data.address || data.location);
            case 'integer_range':
                return data && (data.min || data.max);
            case 'birthday':
                return data;
            case 'textarea':
                return data;
            case 'integer':
                return !!data;
            case 'choice':
                return !!data;
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

    locationToString(location) {

        const locality = selectn('locality', location);
        const country = selectn('country', location);

        return locality && country ?
            locality + ', ' + country :
            selectn('address', location);
    }

    isComplete(userId) {
        return this.getRequiredProfileQuestionsLeftCount(userId) === 0;
    }

    getInitialRequiredProfileQuestionsCount() {
        return this._initialRequiredProfileQuestionsCount;
    }

    getRequiredProfileQuestionsLeftCount(userId) {
        let count = 0;
        REQUIRED_REGISTER_PROFILE_FIELDS.forEach(field => {
            if (!this._profiles[userId] || !this._profiles[userId][field.name] || !this.isProfileSet(field, this._profiles[userId][field.name])) {
                count++;
            }
        });

        return count;
    }

    getNextRequiredProfileField(userId) {
        return typeof this._profiles[userId] !== 'undefined' ? REQUIRED_REGISTER_PROFILE_FIELDS.find(field =>
                !(typeof this._profiles[userId][field.name] !== 'undefined' && this._profiles[userId][field.name])
            ) || null : null;
    }

    _setInitialRequiredProfileQuestionsCount(userId) {
        let count = 0;
        REQUIRED_REGISTER_PROFILE_FIELDS.forEach(field => {
            if (!this._profiles[userId] || !this.isProfileSet(field, this._profiles[userId][field.name])) {
                count++;
            }
        });

        this._initialRequiredProfileQuestionsCount = count;
    }

    setLikedUser(userId, profiles) {
        if (profiles.hasOwnProperty(userId)) {
            profiles[userId]['like'] = 1;
        }

        return profiles;
    }

    setUnlikedUser(userId, profiles) {
        if (profiles.hasOwnProperty(userId)) {
            profiles[userId]['like'] = 0;
        }
        return profiles;
    }
}

export default new ProfileStore();