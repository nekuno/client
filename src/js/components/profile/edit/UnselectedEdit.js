import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ProfileStore from '../../../stores/ProfileStore';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class UnselectedEdit extends Component {
    static propTypes = {
        editKey: PropTypes.string.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.string]),
        handleClickEdit: PropTypes.func.isRequired
    };
    
    render() {
        const {editKey, metadata, data} = this.props;
        return(
            <div className="profile-field">
                <TextCheckboxes labels={[{key: editKey, text: ProfileStore.getMetadataLabel(metadata, data)}]}
                                onClickHandler={this.handleClickEdit.bind(this, editKey)}
                                values={ProfileStore.isProfileSet(metadata, data) ? [editKey] : []} />
                <div className="table-row"></div>
            </div>
        );
    }


    handleClickEdit() {
        this.props.handleClickEdit(this.props.editKey);
    }
}