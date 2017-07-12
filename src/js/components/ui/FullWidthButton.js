import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class FullWidthButton extends Component {

    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes = {
        disabled: PropTypes.bool,
        onClick : PropTypes.func,
    };

    render() {
        const {disabled, onClick} = this.props;
        return (
            <button disabled={disabled} className="button button-fill button-big button-round" onClick={onClick}>
                {this.props.children}
            </button>
        );
    }
}

FullWidthButton.defaultProps = {
    disabled: false,
    onClick : () => {
    },
};