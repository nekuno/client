import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './DoubleChoiceEdit.scss';
import ChoiceEdit from "../ChoiceEdit/ChoiceEdit";

export default class DoubleChoiceEdit extends Component {
    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        metadata             : PropTypes.object.isRequired,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit     : PropTypes.func.isRequired,
        firstChoiceSelected  : PropTypes.string,
        detailSelected       : PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
            firstChoiceSelected: props.firstChoiceSelected,
            detailSelected     : props.detailSelected,
        };

        this.handleClickDetail = this.handleClickDetail.bind(this);
        this.handleClickChoice = this.handleClickChoice.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
    }

    handleClickChoice(choice) {
        this.setState({firstChoiceSelected: choice});
    }

    handleClickDetail(detail) {
        const data = {
            choice: this.state.firstChoiceSelected,
            detail: detail,
        };
        this.props.handleChangeEdit(data);
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
    }

    buildDoubleChoicesAsChoices() {
        const {metadata} = this.props;
        const firstChoiceSelected = this.state.firstChoiceSelected;
        if (null === firstChoiceSelected) {
            return [];
        }
        const doubleChoices = metadata.doubleChoices[firstChoiceSelected];

        return Object.keys(doubleChoices).map(key => {
            const choiceText = doubleChoices[key];

            return {
                id  : key,
                text: choiceText,
            }
        })
    }

    render() {
        const {editKey, metadata} = this.props;
        const {firstChoiceSelected, detailSelected} = this.state;
        const choices = metadata.choices;
        const doubleChoices = this.buildDoubleChoicesAsChoices();
        return (
            <div className={styles.doubleChoiceEdit}>
                <div className={styles.firstChoice}>
                    <ChoiceEdit editKey={editKey + 'first'} choices={choices} handleChangeEdit={this.handleClickChoice} selected={firstChoiceSelected}/>
                </div>
                {firstChoiceSelected ?
                    <div className={styles.secondChoice}>
                        <ChoiceEdit editKey={editKey + 'second'} choices={doubleChoices} handleChangeEdit={this.handleClickDetail} selected={detailSelected}/>
                    </div>
                    :
                    null
                }

            </div>
        );
    }
}

DoubleChoiceEdit.defaultProps = {
    firstChoiceSelected: null,
};