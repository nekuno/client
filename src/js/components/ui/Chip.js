import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Chip extends Component {

    static propTypes = {
        label         : PropTypes.string.isRequired,
        disabled      : PropTypes.bool,
        value         : PropTypes.string,
        onClickHandler: PropTypes.func,
        chipClass     : PropTypes.string
    };

    constructor(props) {

        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        this.props.onClickHandler(this.props.value, event);
    }

    render() {
        const {disabled, label} = this.props;
        let chipClass = this.props.chipClass ? this.props.chipClass + ' chip' : 'chip';
        return (
            <div className={disabled ? chipClass + " disabled-chip" : chipClass} onClick={this.handleClick}>
                <div className="chip-label">
                    {label}
                </div>
            </div>
        );
    }
}
