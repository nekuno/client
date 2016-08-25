import React, { PropTypes, Component } from 'react';

export default class SelectedEdit extends Component {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        type: PropTypes.string.isRequired,
        addedClass: PropTypes.string,
        plusIcon: PropTypes.bool,
        handleClickRemoveEdit: PropTypes.func.isRequired,
        onClickHandler: PropTypes.func
    };

    render() {
        const {type, addedClass, children, onClickHandler} = this.props;
        const className = addedClass ? addedClass + ' profile-field ' + type + '-filter' : 'profile-field ' + type + '-filter';
        return(
            <div className={className} onClick={onClickHandler}>
                {this.renderSelectedEditBackground()}
                {children}
                <div className="table-row"></div>
            </div>
        );
    }

    renderSelectedEditBackground() {
        return (
                <div className="profile-field-remove" onClick={this.handleClickRemoveEdit.bind(this)}>
                    <div className="small-icon-wrapper">
                        <span className="icon-delete"></span>
                    </div>
                </div>
        );
    }

    handleClickRemoveEdit() {
        this.props.handleClickRemoveEdit();
    }
}