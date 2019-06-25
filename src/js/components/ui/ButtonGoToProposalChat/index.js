import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ButtonGoToProposalChat.scss';
import ButtonOverlayBottomPage from "../ButtonOverlayBottomPage";
import translate from "../../../i18n/Translate";

@translate('ButtonGoToProposalChat')
export default class ButtonGoToProposalChat extends Component {

    static propTypes = {
        user: PropTypes.object,
        // Injected by @translate:
        strings        : PropTypes.object,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const {user} = this.props;
        const slug = user.slug;

        const chatUrl = '/p/' + slug + '/conversations';
        this.context.router.push(chatUrl);
    }

    render() {
        const {strings} = this.props;
        return (
            <ButtonOverlayBottomPage text={strings.chat} onClickHandler={this.handleClick}/>
        );
    }
}