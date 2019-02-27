import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Input from '../../ui/Input/Input.js';
import Chip from '../../ui/Chip/Chip.js';
import styles from './InputSelectText.scss';

export default class InputSelectText extends Component {

    static propTypes = {
        placeholder    : PropTypes.string,
        options        : PropTypes.array,
        selectedLabel  : PropTypes.string,
        chipsColor     : PropTypes.oneOf(['purple', 'blue', 'pink', 'green']),
        onChangeHandler: PropTypes.func,
        onClickHandler : PropTypes.func,
        selectedValues : PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

        let selected = [];

        if (props.selectedValues) {
            selected = props.selectedValues;
        }

        this.state = {
            selected: selected,
            suggested: []
        }
    }

    handleChange(text) {
        const {options} = this.props;
        const {selected} = this.state;

        this.setState({suggested: options.filter(
            option => text
                && option.text.toLowerCase().indexOf(text.toLowerCase()) !== -1
                && !selected.some(item => item.id === option.id)
        )});

        if (this.props.onChangeHandler) {
            this.props.onChangeHandler(text);
        }
    }

    handleClick(id) {
        const {options} = this.props;
        const {selected} = this.state;
        let newSelected = selected.slice(0);
        const index = selected.findIndex(option => option.id === id);
        console.log(newSelected);

        if (index !== -1) {
            newSelected.splice(index, 1);
        } else {
            console.log(options.find(option => option.id === id));
            const option = options.find(option => option.id === id);
            console.log(option);
            console.log(newSelected);
            const newOption = {
                value: option.id,
                image: null,
            };
            // newSelected.push(options.find(option => option.id === id));
            newSelected.push(newOption);
        }
        this.setState({selected: newSelected, suggested: []});

        this.refs["input"].clearValue();

        if (this.props.onClickHandler) {
            this.props.onClickHandler(newSelected.map(option => option.value));
        }
    }

    render() {
        const {placeholder, options, selectedLabel, chipsColor, selectedValues} = this.props;
        const {selected, suggested} = this.state;

        return (
            <div className={styles.inputSelectText}>
                <Input ref="input" placeholder={placeholder} searchIcon={true} size={'small'} onChange={this.handleChange} doNotScroll={true}/>

                {suggested.map((item, index) =>
                    <div key={index} className={styles.suggestedChip}>
                        <Chip onClickHandler={this.handleClick}
                              text={item.text}
                              value={item.id}
                              color={chipsColor}
                        />
                    </div>
                )}
                {selected.length > 0 ?
                    <div className={styles.selectedLabel + " small"}>{selectedLabel}</div> : null
                }

                {options.length > 0 ?
                    selected.map((item, index) =>
                        <div key={index} className={styles.selectedChip}>
                            <Chip onClickHandler={this.handleClick}
                                  text={options.find(x => x.id === item.value).text}
                                  value={options.find(x => x.id === item.value).id}
                                  color={chipsColor}
                                  selected={true}
                            />
                        </div>
                    )
                    : null
                }
            </div>
        );
    }
}