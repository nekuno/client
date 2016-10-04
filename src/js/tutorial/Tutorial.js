import { default as React } from 'react';
import en from '../i18n/en';
import es from '../i18n/es';

const locales = {en, es};

function setStepsStyles(steps) {
    steps.forEach(step => {
        step.style = {
            mainColor: '#6342b1',
            beacon: {
                offsetX: 0,
                offsetY: 0,
                inner: '#a350f0',
                outer: '#a350f0'
            }
        };
    });

    return steps;
}

function setStepsStrings(steps, strings) {
    steps.forEach(step => {
        step.title = strings[step.titleRef];
        step.text = strings[step.textRef];
    });

    return steps;
}

function getLocale(props) {
    const strings = locales[props.locale]['TutorialComponent'];
    return {
        back: strings.back,
        close: strings.close,
        last: strings.last,
        next: strings.next,
        skip: strings.skip
    };
}

export default function tutorial() {

    return Component => {
        class TutorialComponent extends React.Component {

            static propTypes = {
                steps         : React.PropTypes.array,
                startTutorial : React.PropTypes.bool,
                tutorialLocale: React.PropTypes.object,
                strings       : React.PropTypes.object
            };

            constructor(props) {
                super(props);

                this.state = {
                    defaultSteps: props.steps,
                    steps: props.steps,
                    displayed: false
                };

                this.start = this.start.bind(this);
                this.reset = this.reset.bind(this);
                this.removeSteps = this.removeSteps.bind(this);
            }

            addSteps(steps, joyride, strings) {
                if (!steps.length) {
                    return false;
                }

                steps = setStepsStyles(steps);
                steps = setStepsStrings(steps, strings);
                this.setState({
                    steps: joyride.parseSteps(steps)
                });
            }

            removeSteps() {
                this.setState({
                    steps: [],
                    displayed: false
                });
            }

            addTooltip(data) {
                this.refs.joyride.addTooltip(data);
            }

            start(joyride) {
                let steps = this.state.defaultSteps.slice(0);
                const {strings} = this.props;
                if (!this.state.displayed) {
                    this.addSteps(steps, joyride, strings);
                    window.setTimeout(() => { joyride.start() }, 0);
                    this.setState({displayed: true});
                }
            }

            reset(joyride) {
                joyride.stop();
                joyride.reset();
                this.removeSteps();
            }

            render() {
                return (
                    <Component {...this.props} startTutorial={this.start} resetTutorial={this.reset} tutorialLocale={getLocale(this.props)}/>
                );
            }
        }

        TutorialComponent.contextTypes = {
            steps         : React.PropTypes.array,
            startTutorial : React.PropTypes.func,
            resetTutorial : React.PropTypes.func,
            tutorialLocale: React.PropTypes.object,
        };

        return TutorialComponent;
    };
};