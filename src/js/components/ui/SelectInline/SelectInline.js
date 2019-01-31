import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './SelectInline.scss';

export default class SelectInline extends Component {

    static propTypes = {
        title          : PropTypes.string,
        options        : PropTypes.array.isRequired,
        defaultOption  : PropTypes.string,
        multiple       : PropTypes.bool,
        color          : PropTypes.oneOf(['purple', 'blue', 'pink', 'green']),
        nullable       : PropTypes.bool,
        onClickHandler : PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            selected: props.defaultOption ? [props.defaultOption] : []
        };
    }

    handleClick(value) {
        const {selected} = this.state;
        const {multiple, nullable} = this.props;
        const index = selected.indexOf(value);
        let newSelected = [];

        if (index !== -1 && (nullable || selected.length > 1)) {
            newSelected = selected.filter(option => option !== value);
        } else if (index !== -1 && !nullable && selected.length === 1) {
            newSelected = selected;
        } else if (multiple) {
            newSelected = [...this.state.selected, value];
        } else {
            newSelected = [value];
        }
        this.setState({selected: newSelected});

        if (this.props.onClickHandler) {
            this.props.onClickHandler(newSelected);
        }
    }

    render() {
        const {title, options, color} = this.props;
        const {selected} = this.state;
        const optionWidthPercent = 100 / options.length;

        return (
            <div>
                {title ? <div className={styles.title + ' small'}>{title}</div> : null}
                <div className={styles.selectInlineWrapper + ' ' +  styles[color]}>
                    <div className={styles.selectInline}>
                        {options.map(option => {
                            let optionClass = selected.some(selectedOption => selectedOption === option.id) ? styles.optionWrapper + ' ' + styles.selected : styles.optionWrapper;
                            optionClass = optionClass + ' ' + styles[color];
                            return (
                                <div key={option.id} className={optionClass + ' ' + styles[color]} onClick={this.handleClick.bind(this, option.id)} style={{width: optionWidthPercent + '%'}}>
                                    <div className={styles.option + ' ' + styles[color]}>
                                        <div className={styles.optionText}>
                                            {option.text}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
}