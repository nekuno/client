import React, { PropTypes, Component } from 'react';

export default class SelectedEdit extends Component {

    static propTypes = {
        children             : PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        type                 : PropTypes.string.isRequired,
        addedClass           : PropTypes.string,
        plusIcon             : PropTypes.bool,
        handleClickRemoveEdit: PropTypes.func,
        onClickHandler       : PropTypes.func
    };

    renderSelectedEditBackground(handleClickRemoveEdit) {
        return (
            <div className="profile-field-remove" onClick={this.handleClickRemoveEdit.bind(this)}>
                {handleClickRemoveEdit ?
                    <div className="small-icon-wrapper">
                        <span className="icon-delete"/>
                    </div> : null}
            </div>
        );
    }

    handleClickRemoveEdit() {
        this.props.handleClickRemoveEdit();
    }

    render() {
        const {type, addedClass, children, onClickHandler, handleClickRemoveEdit} = this.props;
        const className = addedClass ? addedClass + ' profile-field ' + type + '-filter' : 'profile-field ' + type + '-filter';
        return (
            <div className={className} onClick={onClickHandler}>
                {this.renderSelectedEditBackground(handleClickRemoveEdit)}
                {children}
                <div className="table-row"></div>
            </div>
        );
    }

}