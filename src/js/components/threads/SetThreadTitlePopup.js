import React, { PropTypes, Component } from 'react';
import translate from '../../i18n/Translate';
import Input from '../ui/Input';
import FullWidthButton from '../ui/FullWidthButton';

@translate('SetThreadTitlePopup')
export default class SetThreadTitlePopup extends Component {
    static propTypes = {
        onClick     : PropTypes.func.isRequired,
        defaultTitle: PropTypes.string,
        displaying  : PropTypes.bool,
        contentRef  : PropTypes.func,
        // Injected by @translate:
        strings     : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onFinish = this.onFinish.bind(this);
        this._onChange = this._onChange.bind(this);

        this.state = {
            threadName: props.defaultTitle
        };
    }

    componentDidUpdate() {
        if (this.props.displaying) {
            this.focusThreadTitle();
        }
    }

    focusThreadTitle() {
        this.refs.threadTitle.focus();
    }

    _onChange(event) {
        this.setState({
            threadName: event.target.value
        });
    }

    onFinish() {
        nekunoApp.closeModal('.popup-set-thread-title');
        this.props.onClick(this.state.threadName);
    }

    render() {
        const popupClass = 'popup popup-set-thread-title tablet-fullscreen';
        const {defaultTitle, contentRef, strings} = this.props;
        return (

            <div className={popupClass}>
                <div ref={contentRef} className="content-block">
                    <div className="popup-set-thread-title-title title"> {strings.title}</div>
                    <div className="list-block">
                        <ul>
                            <Input ref="threadTitle" placeholder={strings.placeholder} onChange={this._onChange} defaultValue={defaultTitle}/>
                        </ul>
                    </div>
                    <br />
                    <FullWidthButton onClick={this.onFinish}>{strings.finish}</FullWidthButton>
                </div>
            </div>
        );
    }
}

SetThreadTitlePopup.defaultProps = {
    strings: {
        title      : 'What name do you prefer for this yarn?',
        placeholder: 'Title',
        finish     : 'Finish'
    }
};
