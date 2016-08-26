import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import LocationInput from '../../ui/LocationInput';
import translate from '../../../i18n/Translate';

@translate('LocationEdit')
export default class LocationEdit extends Component {

    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        selected             : PropTypes.bool.isRequired,
        metadata             : PropTypes.object.isRequired,
        data                 : PropTypes.object,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit     : PropTypes.func.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClickLocationSuggestion = this.handleClickLocationSuggestion.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
    }

    handleClickLocationSuggestion(location) {
        let {editKey} = this.props;
        this.props.handleChangeEdit(editKey, location);
    }


    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
    }

    render() {
        const {editKey, selected, data, strings} = this.props;
        return (
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'location-tag'} addedClass={'tag-filter'} plusIcon={true} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null}>
                <div className="location-filter-wrapper">
                    <div className="list-block">
                        <div className="location-title">{strings.location}</div>
                        <LocationInput placeholder={data.address ? data.address : data.location ? data.location : strings.placeholder} onSuggestSelect={this.handleClickLocationSuggestion} autoFocus={false}/>
                    </div>
                </div>
            </SelectedEdit>
        );
    }
}

LocationEdit.defaultProps = {
    strings: {
        location   : 'Location',
        placeholder: 'Type a location'
    }
};