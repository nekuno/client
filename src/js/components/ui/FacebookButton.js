import React, { PropTypes, Component } from 'react';
import { SOCIAL_NETWORKS_NAMES, FACEBOOK_SCOPE } from '../../constants/Constants';
import FullWidthButton from './FullWidthButton';

export default class FacebookButton extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func,
        text          : PropTypes.string.isRequired
    };

    handleClick() {
        this.props.onClickHandler(SOCIAL_NETWORKS_NAMES.FACEBOOK, FACEBOOK_SCOPE);
    }

    render() {

        const {text} = this.props;

        return (
            <div id="facebook-register-button">
                <FullWidthButton onClick={this.handleClick.bind(this)}>
                    <span className={'icon-facebook'}></span>
                    <span>{text}</span>
                </FullWidthButton>
            </div>
        );
    }
}
