import React, { PropTypes, Component } from 'react';
import translate from '../../i18n/Translate';
import TextInput from '../ui/TextInput';
import FullWidthButton from '../ui/FullWidthButton';

@translate('SetThreadTitlePopup')
export default class SetThreadTitlePopup extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onFinish = this.onFinish.bind(this);
        this._onChange = this._onChange.bind(this);

        this.state = {
            threadName: ''
        };
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
        const strings = this.props.strings;
        return (

            <div className={popupClass}>
                <div className="content-block">
                    <div className="popup-set-thread-title-title title"> {strings.title}</div>
                    <div className="list-block">
                        <ul>
                            <TextInput placeholder={strings.placeholder} onChange={this._onChange}/>
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
