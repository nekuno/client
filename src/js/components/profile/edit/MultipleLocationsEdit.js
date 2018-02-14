import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TextCheckboxes from '../../ui/TextCheckboxes';
import LocationInput from '../../ui/LocationInput';
import translate from '../../../i18n/Translate';
import Framework7Service from '../../../services/Framework7Service';

@translate('MultipleLocationsEdit')
export default class MultipleLocationsEdit extends Component {
    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        selected             : PropTypes.bool.isRequired,
        metadata             : PropTypes.object.isRequired,
        data                 : PropTypes.array,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit     : PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.handleClickLocation = this.handleClickLocation.bind(this);
        this.handleRemoveLocation = this.handleRemoveLocation.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
    }

    handleClickLocation(location) {
        let {editKey, metadata, data, strings} = this.props;
        data = data || [];
        const valueIndex = data.findIndex(value => value == location);
        if (valueIndex <= -1) {
            if (metadata.max && data.length >= metadata.max) {
                Framework7Service.nekunoApp().alert(strings.maxChoices.replace('%max%', metadata.max));
                return;
            }
            data.push(location);
        }
        this.props.handleChangeEdit(editKey, data);
    }

    handleRemoveLocation(index) {
        const {editKey, data} = this.props;
        const valueIndex = data.findIndex((value, key) => key == index);
        if (valueIndex > -1) {
            data.splice(valueIndex, 1);
        }
        this.props.handleChangeEdit(editKey, data);
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
    }

    render() {
        const {editKey, selected, metadata, data, strings} = this.props;

        return (
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'location-tag'} active={data && data.length > 0} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null}>
                <div className="location-filter-wrapper">
                    <div className="list-block">
                        <div className="location-title">{metadata.labelEdit}</div>
                        <LocationInput defaultValue="" placeholder={strings.placeholder} onSuggestSelect={this.handleClickLocation} autoFocus={false} clearOnSelect={true}/>
                    </div>
                </div>

                <TextCheckboxes labels={data.map((location, index) => {
                    return ({key: index, text: location.address ? location.address : location.location})
                })}
                                onClickHandler={this.handleRemoveLocation} values={data.map((location, index) => index)} className={'multiple-choice-filter'}
                                title={''}/>
            </SelectedEdit>
        );
    }
}

MultipleLocationsEdit.defaultProps = {
    strings: {
        placeholder: 'Type a location',
        maxChoices : 'Select up to %max% items'
    }
};