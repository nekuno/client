import React, { PropTypes, Component } from 'react';
import translate from '../../i18n/Translate';
import moment from 'moment';

@translate('QuestionEditCountdown')
export default class QuestionEditCountdown extends Component {
    static propTypes = {
        questionId: PropTypes.number.isRequired,
        seconds: PropTypes.number,
        onTimerEnd: PropTypes.func,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.setSeconds = this.setSeconds.bind(this);
        this.checkFinishTick = this.checkFinishTick.bind(this);

        this.state = {seconds: props.seconds};
    }

    setSeconds(seconds) {
        this.setState({
            'seconds': seconds
        })
    }

    componentDidMount() {
        const tickLength = 1;
        this.tickInterval = setInterval(() => {
            const seconds = this.state.seconds;
            this.setSeconds(seconds - tickLength);

            this.checkFinishTick();
        }, tickLength * 1000)
    }

    checkFinishTick() {
        if (this.state.seconds <= 0) {
            clearInterval(this.tickInterval);
            this.props.onTimerEnd(this.props.questionId);
        }
    }

    componentWillUnmount() {
        clearInterval(this.tickInterval);
    }

    render() {
        const seconds = this.state.seconds;
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
    locale: 'en',
    seconds: 0,
    onTimerEnd: () => {}
};