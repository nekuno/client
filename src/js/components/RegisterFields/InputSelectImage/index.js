import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Input from '../../ui/Input/';
import styles from './InputSelectImage.scss';

export default class InputSelectImage extends Component {

    static propTypes = {
        placeholder    : PropTypes.string,
        options        : PropTypes.array,
        onChangeHandler: PropTypes.func,
        onClickHandler : PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            selected: [],
            suggested: props.options
        }
    }

    handleChange(text) {
        const {options} = this.props;

        if (text) {
            this.setState({
                suggested: options.filter(
                    option => option.text.toLowerCase().indexOf(text.toLowerCase()) !== -1
                )
            });
        } else {
            this.setState({suggested: options});
        }
        if (this.props.onChangeHandler) {
            this.props.onChangeHandler(text);
        }
    }

    handleClick(id) {
        const {options} = this.props;
        const {selected} = this.state;
        let newSelected = selected.slice(0);
        const index = selected.findIndex(option => option.id === id);

        if (index !== -1) {
            newSelected.splice(index, 1);
        } else {
            newSelected.push(options.find(option => option.id === id));
        }
        this.setState({selected: newSelected});

        this.refs["input"].clearValue();

        if (this.props.onClickHandler) {
            this.props.onClickHandler(newSelected.map(option => option.id));
        }
    }

    render() {
        const {placeholder} = this.props;
        const {selected, suggested} = this.state;

        return (
            <div className={styles.inputSelectImage}>
                <Input ref="input" placeholder={placeholder} searchIcon={true} size={'small'} onChange={this.handleChange} doNotScroll={true}/>

                {suggested.map((item, index) =>
                    <div key={index} className={styles.suggestedItem}>
                        <div className={styles.suggestedImageWrapper} onClick={this.handleClick.bind(this, item.id)}>
                            <div className={styles.suggestedImage}>
                                <img className={styles.picture} src={item.picture} />
                            </div>
                            {selected.some(selectedItem => selectedItem.id === item.id) ?
                                <div className={styles.selectedItem}>
                                    <span className={styles.iconCheck + ' icon icon-check'}/>
                                </div>
                                : null
                            }
                        </div>
                        {selected.some(selectedItem => selectedItem.id === item.id) ?
                            <div className={styles.text + ' ' + styles.selected + ' small'}>{item.text}</div>
                            :
                            <div className={styles.text + ' small'}>{item.text}</div>
                        }
                    </div>
                )}
            </div>
        );
    }
}