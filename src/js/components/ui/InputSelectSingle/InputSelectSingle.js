import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './InputSelectSingle.scss';
import translate from "../../../i18n/Translate";
import IconCollapsible from "../IconCollapsible/IconCollapsible";

@translate('InputSelectSingle')
export default class InputSelectSingle extends Component {

    static propTypes = {
        onToggle       : PropTypes.func,
        onClickHandler : PropTypes.func,
        onCancelHandler: PropTypes.func,
        options        : PropTypes.array.isRequired,
        selected       : PropTypes.string,
        placeholderText: PropTypes.string,
        // Injected by @translate:
        strings        : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            open    : false,
            selected: props.selected,
        };

        this.toggleOpen = this.toggleOpen.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    toggleOpen() {
        const current = this.state.open;
        this.props.onToggle();
        this.setState({open: !current});
    }

    handleClick(value) {
        this.setState({selected: value});
        this.props.onClickHandler(value);
        this.toggleOpen();
    }

    handleCancel() {
        this.setState({selected: null});
        this.props.onCancelHandler();
        this.toggleOpen();
    }

    getOptions() {
        const {options, strings} = this.props;
        const {selected} = this.state;

        const firstOption = [<div key={'firstOption'} className={styles.optionUnselected} onClick={this.handleCancel}>
            <div className={styles.text}>
                {strings.placeholder}
            </div>
            <div className={styles.arrow}>
                <IconCollapsible open={open}/>
            </div>
        </div>];

        const nextOptions = options.map((option) => {
            const className = option === selected ? styles.optionSelected : styles.optionUnselected;
            const clickHandler = this.handleClick.bind(this, option);

            return <div key={option} className={className} onClick={clickHandler}>
                <div className={styles.text}>
                    {option}
                </div>
            </div>
        });

        return firstOption.concat(nextOptions);
    }

    render() {
        const {strings, placeholderText} = this.props;
        const {open, selected} = this.state;

        const text = selected ? selected : (placeholderText ? placeholderText : strings.placeholder);

        return (
            <div className={styles.inputSelectSingle}>
                {!open ?
                    <div className={styles.closed} onClick={this.toggleOpen}>
                        <div className={styles.text}>
                            {text}
                        </div>
                        <div className={styles.arrow}>
                            <IconCollapsible open={open}/>
                        </div>
                    </div>
                    :
                    <div className={styles.open}>
                        {this.getOptions()}
                    </div>
                }
            </div>
        );
    }
}

InputSelectSingle.defaultProps = {
    onToggle       : () => {
    },
    onClickHandler : () => {
    },
    onCancelHandler: () => {
    },
    selected       : null,
    strings        : {
        placeholder: 'Choose one'
    }
};