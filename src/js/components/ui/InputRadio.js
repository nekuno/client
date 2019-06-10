import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RoundedImage from "./RoundedImage/RoundedImage";

export default class InputRadio extends Component {

    static propTypes = {
        value         : PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        text          : PropTypes.string.isRequired,
        checked       : PropTypes.bool.isRequired,
        onClickHandler: PropTypes.func.isRequired,
        reverse       : PropTypes.bool,
        image         : PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler() {
        this.props.onClickHandler(this.props.value);
    }

    renderImage() {
        const {image} = this.props;

        if (!image){
            return null;
        }

        return <div className="item-image">
            <RoundedImage url={image} size={'small'} />
        </div>
    }

    render() {
        const {reverse, checked, text} = this.props;
        const className = checked ? 'icon icon-form-checkbox checked' : 'icon icon-form-checkbox';
        return (
            reverse ?
                <label className="label-checkbox item-content" onClick={this.onClickHandler}>
                    {this.renderImage()}
                    <div className="item-media">
                        <i className={className}/>
                    </div>
                    <div className="item-inner">
                        <div className="item-title">{text}</div>
                    </div>
                </label>
                :
                <label className="label-checkbox item-content" onClick={this.onClickHandler}>
                    <div className="item-inner">
                        <div className="item-title">{text}</div>
                    </div>
                    <div className="item-media">
                        <i className={className}/>
                    </div>
                    {this.renderImage()}
                </label>
        );
    }

}
