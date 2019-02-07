import { REQUIRED_REGISTER_PROFILE_FIELDS, SOCIAL_NETWORKS_NAMES } from '../constants/Constants';
import { waitFor } from '../dispatcher/Dispatcher';
import { isInBag, mergeIntoBag } from '../utils/StoreUtils';
import BaseStore from './BaseStore';
import UserStore from '../stores/UserStore';
import LoginStore from '../stores/LoginStore';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';
import { getValidationErrors } from '../utils/StoreUtils';

class ProfileStore extends BaseStore {

    setInitial() {
        this._profiles = {};
        this._metadata = null;
        this._categories = null;
        this._isLoadingCategories = false;
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
                this._initialize(action.slug);
                const newProfiles = {[action.slug]: action.response};
                mergeIntoBag(this._profiles, newProfiles);
                this._setInitialRequiredProfileQuestionsCount(action.slug);
                this.emitChange();
                break;
            case ActionTypes.CONNECT_ACCOUNT_SUCCESS:
                if (action.resource === SOCIAL_NETWORKS_NAMES.LINKEDIN) {
                    this._profiles[LoginStore.user.slug] = null;
                    this.emitChange();
                }
                break;
            case ActionTypes.REQUEST_LOGIN_USER_SUCCESS:
            case ActionTypes.REQUEST_AUTOLOGIN_SUCCESS:
                this._initialize(LoginStore.user.slug);
                mergeIntoBag(this._profiles[LoginStore.user.slug], action.response.profile);
                this._setInitialRequiredProfileQuestionsCount(LoginStore.user.slug);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PROFILE_SUCCESS:
                this._initialize(action.slug);
                mergeIntoBag(this._profiles[action.slug], action.response);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_OTHER_USER_SUCCESS:
                this._initialize(action.slug);
                const profile = {location: action.response.location, birthday: action.response.birthday};
                mergeIntoBag(this._profiles[action.slug], profile);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_METADATA_SUCCESS:
                this._metadata = action.response;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_CATEGORIES:
                this._isLoadingCategories = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_CATEGORIES_SUCCESS:
                this._isLoadingCategories = false;
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
            case ActionTypes.EDIT_PROFILE:
                this._profiles[LoginStore.user.slug] = action.data;
                this.emitChange();
                break;
            case ActionTypes.EDIT_PROFILE_ERROR:
                this._errors = getValidationErrors(action.error);
                this._profiles[LoginStore.user.slug] = action.oldProfile;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS:
                action.response.items.forEach(item => this._profiles[item.slug] = item.profile ? item.profile : null);
                this.emitChange();
                break;
            default:
                break;
        }
    }

    _initialize(slug)
    {
        this._profiles[slug] = this._profiles[slug] || {};
    }

    contains(slug, fields) {
        return isInBag(this._profiles, slug, fields);
    }

    get(slug) {
        this._initialize(slug);
        return this._profiles[slug];
    }

    getErrors() {
        const errors = this._errors;
        this._errors = null;
        return errors;
    }

    getMetadata() {
        return this._metadata;
    }

    getCategories() {
        return this._categories;
    }

    isLoadingCategories() {
        return this._isLoadingCategories;
    }

    getWithMetadata(slug) {
        const basicProfile = this.get(slug);
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
                    value = this.getFieldText(type, thisMetadata, basicProfile, field);

                    if (value === '' || value === false) {
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

    getFieldText(type, thisMetadata, basicProfile, field) {
        switch (type) {
            case 'choice':
                let choices = thisMetadata.choices;
                return choices.find(choice => choice.id === basicProfile[field]).text;
            case 'double_choice':
                let firstChoices = thisMetadata.choices;
                const doubleChoices = thisMetadata.doubleChoices;
                let firstChoice = basicProfile[field]['choice'];
                let doubleChoiceValue = basicProfile[field]['detail'] ? doubleChoices[firstChoice][basicProfile[field]['detail']] : '';
                return firstChoices.find(choice => choice.id === firstChoice).text + ' ' + doubleChoiceValue;
            case 'tags':
                return basicProfile[field].map(function(tag){
                    return tag['name'];
                });
            case 'multiple_choices':
                let multiple_choices = thisMetadata['choices'];
                let mchoices = [];
                if (typeof basicProfile[field] === 'string') {
                    mchoices.push(multiple_choices.find(choice => choice.id === basicProfile[field]).text);
                } else {
                    for (let mchoice_label in basicProfile[field]) {
                        mchoices.push(multiple_choices.find(choice => choice.id === basicProfile[field][mchoice_label]).text);
                    }
                }
                return mchoices.join(', ');
            case 'multiple_locations':
                values = [];
                basicProfile[field].forEach(location => values.push(this.locationToString(location)));
                return values.join(', ');
            case 'multiple_fields':
                values = [];
                if (basicProfile[field].length > 0) {
                    basicProfile[field].forEach((item) => {
                        Object.keys(item).forEach(multipleField => {
                            const fieldMetadata = thisMetadata.metadata[multipleField] || null;
                            if (fieldMetadata && fieldMetadata.type) {
                                let value = this.getFieldText(fieldMetadata.type, fieldMetadata, item, multipleField);
                                value = value.length > 100 ? value.substr(0, 97) + '...' : value;
                                values.push(value + '\n');
                            }
                        });
                        values.push('\n');
                    });
                }

                return values.join('');
            case 'tags_and_choice':
                let tagChoices = thisMetadata['choices'];
                let level = thisMetadata['choiceLabel']['es'];
                let objects = basicProfile[field];
                let values = [];
                Object.keys(objects).forEach(index => {
                    let object = objects[index];
                    let newTag = object['tag']['name'];
                    if (object['choice']) {
                        newTag += ': ' + level + ' ' + tagChoices[object['choice']];
                    }
                    values.push(newTag);
                });
                return values.join(', ');
            case 'integer':
                return basicProfile[field];
            case 'birthday':
                const name = thisMetadata.label == 'Birthday' ? 'Age' : 'Edad';
                const thatDate = new Date(basicProfile[field]);
                const ageDifMs = Date.now() - thatDate.getTime();
                const ageDate = new Date(ageDifMs); // miliseconds from epoch
                return Math.abs(ageDate.getUTCFullYear() - 1970);
            case 'location':
                return this.locationToString(basicProfile[field]);
            case 'textarea':
                return basicProfile[field];
            default:
                return null;
        }
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
            case 'multiple_locations':
                return data && data.length > 0;
            case 'double_multiple_choices':
                return data && data.length > 0;
            case 'tags':
                return data && data.length > 0;
            case 'tags_and_choice':
                return data && data.length > 0;
            case 'tags_and_multiple_choices':
                return data && data.length > 0;
            case 'multiple_fields':
                return data && data.length > 0;
            default:
                return false;
        }
    }

    orientationMustBeAsked() {
        const profile = this._profiles[LoginStore.user.slug];

        return profile && profile.orientationRequired && !profile.orientation && profile.objective && profile.objective.some(obj => obj === 'human-contact')
    }

    locationToString(location) {

        const locality = selectn('locality', location);
        const country = selectn('country', location);

        return locality && country ?
            locality + ', ' + country :
            selectn('address', location);
    }

    isComplete(slug) {
        return this.getRequiredProfileQuestionsLeftCount(slug) === 0;
    }

    getInitialRequiredProfileQuestionsCount() {
        return this._initialRequiredProfileQuestionsCount;
    }

    getRequiredProfileQuestionsLeftCount(slug) {
        let count = 0;
        REQUIRED_REGISTER_PROFILE_FIELDS.forEach(field => {
            if (!this._profiles[slug] || !this._profiles[slug][field.name] || !this.isProfileSet(field, this._profiles[slug][field.name])) {
                count++;
            }
        });

        return count;
    }

    getNextRequiredProfileField(slug) {
        return typeof this._profiles[slug] !== 'undefined' && this._profiles[slug] ? REQUIRED_REGISTER_PROFILE_FIELDS.find(field =>
                !(typeof this._profiles[slug][field.name] !== 'undefined' && this._profiles[slug][field.name])
            ) || null : null;
    }

    _setInitialRequiredProfileQuestionsCount(slug) {
        let count = 0;
        REQUIRED_REGISTER_PROFILE_FIELDS.forEach(field => {
            if (!this._profiles[slug] || !this.isProfileSet(field, this._profiles[slug][field.name])) {
                count++;
            }
        });

        this._initialRequiredProfileQuestionsCount = count;
    }

    setLikedUser(slug, profiles) {
        if (profiles.hasOwnProperty(slug)) {
            profiles[slug]['like'] = 1;
        }

        return profiles;
    }

    setUnlikedUser(slug, profiles) {
        if (profiles.hasOwnProperty(slug)) {
            profiles[slug]['like'] = 0;
        }
        return profiles;
    }
}

export default new ProfileStore();