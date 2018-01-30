import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LoginActionCreators from '../../actions/LoginActionCreators';
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
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import ProfileStore from '../../stores/ProfileStore';
import Framework7Service from '../../services/Framework7Service';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const metadata = ProfileStore.getMetadata();

    return {
        metadata,
    };
}

@translate('DetailPopup')
@connectToStores([ProfileStore], getState)
export default class DetailPopup extends Component {
    static propTypes = {
        detail    : PropTypes.string,
        profile   : PropTypes.object,
        onContinue: PropTypes.func,
        onClick   : PropTypes.func,
        onCancel  : PropTypes.func,
        metadata  : PropTypes.object,
        // Injected by @translate:
        strings   : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onCancel = this.onCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onCancel() {
        this.props.onCancel();
        Framework7Service.nekunoApp().closeModal();
    }

    handleChange(key, data) {
        let {profile} = this.props;
        profile[key] = data;
        LoginActionCreators.preRegisterProfile(profile);
    }

    renderField(dataArray, metadata, dataName) {
        let data = dataArray.hasOwnProperty(dataName) ? dataArray[dataName] : null;
        let props = {
            editKey              : dataName,
            metadata             : metadata[dataName],
            selected             : true,
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
            case 'tags_and_choice':
                props.data = data ? data : [];
                props.handleChangeEdit = this.handleChange;
                props.tags = this.props.tags;
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
                props.handleChangeEdit = this.handleChange;
                props.tags = this.props.tags;
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
        const {metadata, profile, detail, strings} = this.props;
        const popupClass = 'popup popup-detail tablet-fullscreen';

        return (

            <div className={popupClass}>
                <div className="content-block">
                    {metadata ?
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
    strings   : {
        continue: 'Continue',
    },
    onClick   : () => {
    },
    onContinue: () => {
    },
    onCancel  : () => {
    }
};