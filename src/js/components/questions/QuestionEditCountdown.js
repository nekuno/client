import React, { PropTypes, Component } from 'react';
import translate from '../../i18n/Translate';
import moment from 'moment';
//require("moment-duration-format");

@translate('QuestionEditCountdown')
export default class QuestionEditCountdown extends Component {
    static propTypes = {
        questionId: PropTypes.number,
        seconds: PropTypes.number,
        onTimerEnd: PropTypes.func,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.setSeconds = this.setSeconds.bind(this);
    }

    setSeconds(seconds) {
        this.setState({
            'seconds': seconds
        })
    }

    componentDidMount() {
        this.setSeconds(this.props.seconds);

        const tickLength = 1;
        this.tickInterval = setInterval(() => {
            const seconds = this.state.seconds;
            this.setSeconds(seconds - tickLength);

            if (this.state.seconds == 0)
            {
                clearInterval(this.tickInterval);
                this.props.onTimerEnd(this.props.questionId);
            }
        }, tickLength * 1000)
    }

    componentWillUnmount() {
        clearInterval(this.tickInterval);
    }

    render() {
        const isLoaded = !!this.state;
        const seconds = isLoaded ? this.state.seconds : 0;
        const time = moment.duration(seconds, "seconds").humanize();
        const text = this.props.strings.text.replace('%s%', time);

        return (
            <div>
                {text}
            </div>
        );
    }
}

QuestionEditCountdown.defaultProps = {
    strings: {
        text: 'Please wait %s% to answer again'
    },
    locale: 'en'
};