import React, { PropTypes, Component } from 'react';

export default class ButtonFloating extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func.isRequired,
        icon          : PropTypes.string.isRequired
    };

    handleClick() {
        this.props.onClickHandler();
    }

    render() {
        const {icon} = this.props;
        return (
            <div className="button button-floating" onClick={this.handleClick.bind(this)}>
                <span className={'icon icon-' + icon}></span>
            </div>
        );
    }
}