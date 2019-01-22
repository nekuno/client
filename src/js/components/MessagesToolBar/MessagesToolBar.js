import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MAX_MESSAGES_LENGTH } from '../../constants/Constants';
import translate from '../../i18n/Translate';
import Framework7Service from '../../services/Framework7Service';
import styles from './MessagesToolBar.scss';
import RoundedImage from "../ui/RoundedImage/RoundedImage";

@translate('MessagesToolBar')
export default class MessagesToolBar extends Component {

    static propTypes = {
        placeholder    : PropTypes.string.isRequired,
        text           : PropTypes.string.isRequired,
        onClickHandler : PropTypes.func.isRequired,
        onFocusHandler : PropTypes.func.isRequired,
        image          : PropTypes.string,
        // Injected by @translate:
        strings        : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);

        this.myMessagebar = {};
        this.state = {
            disable: false
        };
    }

    componentDidMount() {
        this.myMessagebar = Framework7Service.nekunoApp().messagebar('.messagebar', {
            maxHeight: 100
        });
    }

    componentWillUnmount() {
        // this.myMessagebar = {};
        this.myMessagebar.destroy('.messagebar');
    }

    handleClick() {
        const {strings} = this.props;
        let text = this.refs.textarea.value.trim();
        this.refs.textarea.value = '';
        if (text.length > MAX_MESSAGES_LENGTH) {
            Framework7Service.nekunoApp().alert(strings.maxLengthIs + MAX_MESSAGES_LENGTH);
            this.setState({disable: true});
            return;
        }
        if (text) {
            this.props.onClickHandler(text);
        }
    }

    handleFocus(e) {
        this.props.onFocusHandler(e);
    }

    _onKeyDown(event) {
        const ENTER_KEY_CODE = 13;
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            this.handleClick();
        }
    }

    _onKeyUp() {
        const {disable} = this.state;
        const {strings} = this.props;
        let text = this.refs.textarea.value.trim();
        if (text.length > MAX_MESSAGES_LENGTH && disable === false) {
            Framework7Service.nekunoApp().alert(strings.maxLengthIs + MAX_MESSAGES_LENGTH);
            this.setState({disable: true});
        } else if (text.length <= MAX_MESSAGES_LENGTH && disable === true) {
            this.setState({disable: false});
        }
    }

    onClickHandler() {
        this.props.onClickHandler();
    }

    render() {
        const {placeholder, text, image} = this.props;
        return (
            <div className={styles.toolbar}>
                <div className={styles.toolbarInner}>
                    <div className={styles.textareaWrapper}>
                        <RoundedImage url={image} size={"xx-small"}/>
                        <textarea placeholder={placeholder} ref="textarea" onKeyDown={this._onKeyDown} onKeyUp={this._onKeyUp} onFocus={this.handleFocus}/>
                    </div>
                    <a className={styles.link} onClick={this.handleClick} disabled={this.state.disable ? "disabled" : ""} style={this.state.disable ? {color: "#F44336"} : {}}>{text}</a>
                </div>
            </div>
        );
    }
}

MessagesToolBar.defaultProps = {
    strings: {
        maxLengthIs: 'Maximum message length is '
    }
};