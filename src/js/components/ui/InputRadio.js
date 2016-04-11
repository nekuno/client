import React, { PropTypes, Component } from 'react';

export default class InputRadio extends Component {

    static propTypes = {
        value         : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        name          : PropTypes.string.isRequired,
        text          : PropTypes.string.isRequired,
        checked       : PropTypes.bool.isRequired,
        defaultChecked: PropTypes.bool.isRequired,
        onClickHandler: PropTypes.func.isRequired,
        reverse       : PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    render() {
        return (
            this.props.reverse ?
                <label className="label-checkbox item-content">
                    <input type="radio" name={this.props.name} value={this.props.value} checked={this.props.checked} defaultChecked={this.props.defaultChecked} readOnly/>
                    <div className="item-media" onClick={this.onClickHandler}>
                        <i className="icon icon-form-checkbox"></i>
                    </div>
                    <div className="item-inner">
                        <div className="item-title">{this.props.text}</div>
                    </div>
                </label>
                :
                <label className="label-checkbox item-content">
                    <div className="item-inner">
                        <div className="item-title">{this.props.text}</div>
                    </div>
                    <input type="radio" name={this.props.name} value={this.props.value} checked={this.props.checked} defaultChecked={this.props.defaultChecked} readOnly/>
                    <div className="item-media" onClick={this.onClickHandler}>
                        <i className="icon icon-form-checkbox"></i>
                    </div>
                </label>
        );
    }

    onClickHandler() {
        setTimeout(() => {
            this.props.onClickHandler(this.props.value);
        }, 50);
    }
}
