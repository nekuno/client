import React, { PropTypes, Component } from 'react';
import translate from '../../i18n/Translate';
import TextArea from '../ui/TextArea';
import FullWidthButton from '../ui/FullWidthButton';

@translate('ReportContentPopup')
export default class ReportContentPopup extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onReport = this.onReport.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            reportText: null
        };
    }

    onChange() {
        const value = this.refs.reportTextarea.getValue();
        this.setState({
            reportText: value
        });
    }

    onReport() {
        nekunoApp.closeModal('.popup-report-content');
        this.props.onClick(this.state.reportText);
    }

    render() {
        const strings = this.props.strings;
        return (
            <div className="popup popup-report-content tablet-fullscreen">
                <div className="content-block">
                    <p><a className="close-popup">{strings.close}</a></p>
                    <div className="list-block">
                        <ul>
                            <TextArea ref="reportTextarea" title={strings.title} placeholder={strings.placeholder} onChange={this.onChange}/>
                        </ul>
                    </div>
                    <FullWidthButton onClick={this.onReport}> {strings.send}</FullWidthButton>
                </div>
            </div>
        );
    }
}

ReportContentPopup.defaultProps = {
    strings: {
        title      : 'Write a brief explanation of the report',
        placeholder: 'Text...',
        send       : 'Send report',
        close      : 'Close'
    }
};
