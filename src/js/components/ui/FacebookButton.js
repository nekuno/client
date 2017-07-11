import React, { PropTypes, Component } from 'react';
import { SOCIAL_NETWORKS_NAMES, FACEBOOK_SCOPE } from '../../constants/Constants';
import FullWidthButton from './FullWidthButton';

export default class FacebookButton extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func,
        text          : PropTypes.string.isRequired,
        disabled      : PropTypes.bool,
    };

    handleClick() {
        this.props.onClickHandler(SOCIAL_NETWORKS_NAMES.FACEBOOK, FACEBOOK_SCOPE);
    }

    render() {
        const {text, disabled} = this.props;
        const textField = disabled ? <span className="icon-spinner rotation-animation"/> : <span>{text}</span>;

        return (
            <div id="facebook-register-button">
                <FullWidthButton onClick={this.handleClick.bind(this)} disabled={disabled}>
                    <span className={'icon-facebook'}></span>
                    {textField}
                </FullWidthButton>
            </div>
        );
    }
}

FacebookButton.defaultProps = {
    onClickHandler: () => {
    },
    disabled      : false,
};
