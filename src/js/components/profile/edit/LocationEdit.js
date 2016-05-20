import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import LocationInput from '../../ui/LocationInput';
import translate from '../../../i18n/Translate';

@translate('LocationEdit')
export default class LocationEdit extends Component {

    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        selected             : PropTypes.bool.isRequired,
        metadata             : PropTypes.object.isRequired,
        data                 : PropTypes.object,
        handleClickRemoveEdit: PropTypes.func.isRequired,
        handleChangeEdit     : PropTypes.func.isRequired,
        handleClickEdit      : PropTypes.func.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClickLocationSuggestion = this.handleClickLocationSuggestion.bind(this);
    }

    handleClickLocationSuggestion(location) {
        let {editKey} = this.props;
        let data = location;
        this.props.handleChangeEdit(editKey, data);
    }

    getSelectedEdit() {
        return this.refs.selectedEdit ? this.refs.selectedEdit.getSelectedEdit() : {};
    }

    selectedEditContains(target) {
        return this.refs.selectedEdit && this.refs.selectedEdit.selectedEditContains(target);
    }

    render() {
        const {editKey, selected, metadata, data, handleClickRemoveEdit, handleClickEdit, strings} = this.props;
        return (
            selected ?
                <SelectedEdit key={'selected-filter'} ref={'selectedEdit'} type={'location-tag'} addedClass={'tag-filter'} plusIcon={true} handleClickRemoveEdit={handleClickRemoveEdit}>
                    <div className="location-filter-wrapper">
                        <div className="list-block">
                            <div className="location-title">{strings.location}</div>
                            <LocationInput placeholder={data.address ? data.address : data.location ? data.location : strings.placeholder} onSuggestSelect={this.handleClickLocationSuggestion}/>
                        </div>
                    </div>
                </SelectedEdit>
                :
                <UnselectedEdit key={editKey} editKey={editKey} metadata={metadata} data={data} handleClickEdit={handleClickEdit}/>
        );
    }
}

LocationEdit.defaultProps = {
    strings: {
        location   : 'Location',
        placeholder: 'Type a location'
    }
};