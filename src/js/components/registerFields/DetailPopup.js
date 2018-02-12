import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FullWidthButton from '../ui/FullWidthButton';
import EmptyMessage from '../ui/EmptyMessage';
import ChoiceEdit from '../../components/profile/edit/ChoiceEdit';
import LocationEdit from '../../components/profile/edit/LocationEdit';
import IntegerEdit from '../../components/profile/edit/IntegerEdit';
import TagsAndChoiceEdit from '../../components/profile/edit/TagsAndChoiceEdit';
import MultipleChoicesEdit from '../../components/profile/edit/MultipleChoicesEdit';
import DoubleChoiceEdit from '../../components/profile/edit/DoubleChoiceEdit';
import TagEdit from '../../components/profile/edit/TagEdit';
import BirthdayEdit from '../../components/profile/edit/BirthdayEdit';
import TextAreaEdit from '../../components/profile/edit/TextAreaEdit';
import MultipleLocationsEdit from '../../components/profile/edit/MultipleLocationsEdit';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import ProfileStore from '../../stores/ProfileStore';
import TagSuggestionsStore from '../../stores/TagSuggestionsStore';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const metadata = ProfileStore.getMetadata();
    const tags = TagSuggestionsStore.tags;

    return {
        metadata,
        tags
    };
}

@translate('DetailPopup')
@connectToStores([ProfileStore, TagSuggestionsStore], getState)
export default class DetailPopup extends Component {
    static propTypes = {
        detail    : PropTypes.string,
        profile   : PropTypes.object,
        onSave    : PropTypes.func,
        onCancel  : PropTypes.func,
        metadata  : PropTypes.object,
        tags      : PropTypes.array,
        contentRef: PropTypes.func,
        // Injected by @translate:
        strings   : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onCancel = this.onCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderField = this.renderField.bind(this);
    }

    onCancel() {
        this.props.onCancel();
    }

    handleChange(key, data) {
        const {profile} = this.props;
        let newProfile = Object.assign({}, profile);
        newProfile[key] = data;
        newProfile.mode = 'explore';
        if (newProfile.objective && newProfile.objective.some(obj => obj === "human-contact")) {
            newProfile.objective = ['human-contact'];
        } else {
            newProfile.objective = [];
        }

        if (this.profileHasAnyField(newProfile, ['industry', 'skills', 'proposals'])) {
            newProfile['objective'].push('work');
        }
        if (this.profileHasAnyField(newProfile, ['sports', 'games', 'creative'])) {
            newProfile['objective'].push('hobbies');
        }
        if (this.profileHasAnyField(newProfile, ['travelling', 'activities', 'leisureTime', 'leisureMoney'])) {
            newProfile['objective'].push('explore');
        }

        this.props.onSave(newProfile);
    }

    profileHasAnyField = function(profile, fields) {
        return fields.some(field => profile && profile[field] && profile[field].length !== 0);
    };

    renderField(dataArray, metadata, dataName) {
        let data = dataArray.hasOwnProperty(dataName) ? dataArray[dataName] : null;
        let props = {
            editKey : dataName,
            metadata: metadata[dataName],
            selected: true,
        };
        let filter = null;
        switch (metadata[dataName]['type']) {
            case 'choice':
                props.data = data ? data : '';
                props.handleChangeEdit = this.handleChange;
                filter = <ChoiceEdit {...props} />;
                break;
            case 'integer':
                props.data = data ? parseInt(data) : null;
                props.handleChangeEdit = this.handleChange;
                filter = <IntegerEdit {...props}/>;
                break;
            case 'location':
                props.data = data ? data : {};
                props.handleChangeEdit = this.handleChange;
                filter = <LocationEdit {...props}/>;
                break;
            case 'multiple_locations':
                props.data = data ? data : [];
                props.handleChangeEdit = this.handleChange;
                filter = <MultipleLocationsEdit {...props}/>;
                break;
            case 'tags_and_choice':
                props.data = data ? data : [];
                props.handleChangeEdit = this.handleChange;
                props.tags = this.props.tags;
                props.googleSuggestions = true;
                filter = <TagsAndChoiceEdit {...props}/>;
                break;
            case 'multiple_choices':
                props.data = data ? data : [];
                props.handleChangeEdit = this.handleChange;
                filter = <MultipleChoicesEdit {...props} />;
                break;
            case 'double_choice':
                props.data = data ? data : {};
                props.handleChangeEdit = this.handleChange;
                props.handleChangeEditDetail = this.handleChange;
                filter = <DoubleChoiceEdit {...props} />;
                break;
            case 'tags':
                props.data = data ? data : [];
                props.profile = this.props.profile;
                props.handleChangeEdit = this.handleChange;
                props.tags = this.props.tags;
                props.googleSuggestions = true;
                filter = <TagEdit {...props} />;
                break;
            case 'birthday':
                props.data = data ? data : null;
                props.handleChangeEdit = this.handleChange;
                filter = <BirthdayEdit {...props} />;
                break;
            case 'textarea':
                props.data = data ? data : null;
                props.handleChangeEdit = this.handleChange;
                filter = <TextAreaEdit {...props} />;
                break;
        }
        return <div key={dataName} ref={'selectedEdit'}>{filter}</div>;
    }

    render() {
        const {metadata, profile, detail, contentRef, strings} = this.props;
        const popupClass = 'popup popup-detail tablet-fullscreen';

        return (

            <div className={popupClass}>
                <div ref={contentRef} className="content-block">
                    {metadata && detail ?
                        <div>
                            {this.renderField(profile.hasOwnProperty(detail) ? profile : {}, metadata, detail)}
                            <FullWidthButton onClick={this.onCancel}>{strings.continue}</FullWidthButton>
                        </div>
                        :
                        <EmptyMessage text={''} loadingGif={true}/>
                    }

                </div>
            </div>
        );
    }
}

DetailPopup.defaultProps = {
    strings : {
        continue: 'Continue',
    },
    onSave  : () => {
    },
    onCancel: () => {
    }
};