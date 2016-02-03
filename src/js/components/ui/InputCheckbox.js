import React, { PropTypes, Component } from 'react';

export default class InputCheckbox extends Component {

    static propTypes = {
        value         : PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        name          : PropTypes.string.isRequired,
        text          : PropTypes.string.isRequired,
        checked       : PropTypes.bool,
        defaultChecked: PropTypes.bool.isRequired,
        onClickHandler: PropTypes.func,
        reverse       : PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    render() {
        return (
            <div>
                {this.props.reverse ?
                    <label className="label-checkbox item-content">
                        <input type="checkbox" ref="checkbox" name={this.props.name} value={this.props.value} checked={this.props.checked} defaultChecked={this.props.defaultChecked} readOnly/>
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
                        <input type="checkbox" ref="checkbox" name={this.props.name} value={this.props.value} checked={this.props.checked} defaultChecked={this.props.defaultChecked} readOnly/>
                        <div className="item-media" onClick={this.onClickHandler}>
                            <i className="icon icon-form-checkbox"></i>
                        </div>
                    </label>
                }
            </div>

        );
    }

    onClickHandler() {

        setTimeout(() => {
            this.props.onClickHandler(!this.props.checked, this.props.value);
        }, 50);
    }
}
