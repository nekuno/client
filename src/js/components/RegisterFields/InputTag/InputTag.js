import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Input from '../../ui/Input/Input.js';
import Chip from '../../ui/Chip/Chip.js';
import styles from './InputTag.scss';

export default class InputTag extends Component {

    static propTypes = {
        placeholder    : PropTypes.string,
        tags           : PropTypes.array,
        selectedLabel  : PropTypes.string,
        chipsColor     : PropTypes.oneOf(['purple', 'blue', 'pink', 'green']),
        onChangeHandler: PropTypes.func,
        onClickHandler : PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            selected: [],
            text: ''
        }
    }

    handleChange(text) {
        if (this.props.onChangeHandler) {
            this.props.onChangeHandler(text);
        }
        this.setState({text: text});
    }

    handleClick(text) {
        const {selected} = this.state;
        let newSelected = selected.slice(0);
        const index = selected.findIndex(tag => tag === text);

        if (index !== -1) {
            newSelected.splice(index, 1);
        } else {
            newSelected.push(text);
        }
        this.setState({selected: newSelected});

        this.refs["input"].clearValue();

        if (this.props.onClickHandler) {
            this.props.onClickHandler(newSelected);
        }
    }

    render() {
        const {tags, placeholder, selectedLabel, chipsColor} = this.props;
        const {selected, text} = this.state;

        return (
            <div className={styles.inputTag}>
                <Input ref="input" placeholder={placeholder} searchIcon={true} size={'small'} onChange={this.handleChange} doNotScroll={true}/>

                {text && text.length > 1 && !selected.some(selectedTag => selectedTag === text) ?
                    <div className={styles.suggestedChip}>
                        <Chip onClickHandler={this.handleClick}
                              text={text}
                              color={chipsColor}
                        />
                    </div> : null
                }
                {tags.filter(tag => !selected.some(selectedTag => selectedTag === tag)).map((tag, index) =>
                    <div key={index} className={styles.suggestedChip}>
                        <Chip onClickHandler={this.handleClick}
                              text={tag}
                              color={chipsColor}
                        />
                    </div>
                )}
                {selected.length > 0 ?
                    <div className={styles.selectedLabel + " small"}>{selectedLabel}</div> : null
                }
                {selected.map((tag, index) =>
                    <div key={index} className={styles.selectedChip}>
                        <Chip onClickHandler={this.handleClick}
                              text={tag}
                              color={chipsColor}
                              selected={true}
                        />
                    </div>
                )}
            </div>
        );
    }
}