import React, { Component } from "react";
import PropTypes from 'prop-types';
import styles from './ChoiceEdit.scss';
import SelectInline from "../../../ui/SelectInline/SelectInline";
import InputSelectSingle from "../../../ui/InputSelectSingle/InputSelectSingle";

export default class ChoiceEdit extends Component {
    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        selected             : PropTypes.string,
        choices             : PropTypes.array.isRequired,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit     : PropTypes.func.isRequired,
        title                : PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.handleClickChoice = this.handleClickChoice.bind(this);
        this.handleClickChoiceText = this.handleClickChoiceText.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
    }

    handleClickChoice(editKeyChoice) {
        let {editKey, data} = this.props;
        const choice = editKeyChoice[0].replace(editKey, '');
        if (choice !== data) {
            this.props.handleChangeEdit(choice);
        }
    }

    handleClickChoiceText(editKeyChoice) {
        let {editKey, data} = this.props;
        const choice = editKeyChoice.replace(editKey, '');
        if (choice !== data) {
            this.props.handleChangeEdit(choice);
        }
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
    }

    render() {
        const {selected, choices, title} = this.props;
        const selectedText = selected ? choices.find(choice => {
            return choice.id === selected
        }).text : '';
        const choiceTexts = choices.map((choice) => {
            return choice.text
        });
        const compact = choices.length <= 2;
        return (
            <div>
                <div className={styles.title}> {title} </div>
                {compact ?
                    <SelectInline options={choices} onClickHandler={this.handleClickChoice} multiple={false}/>
                    :

                    <InputSelectSingle options={choiceTexts} onClickHandler={this.handleClickChoiceText} selected={selectedText}/>
                }
            </div>);
    }
}

ChoiceEdit.defaultProps = {
    selected: null,
    title   : '',
};