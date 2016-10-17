import { default as React } from 'react';
import en from '../../i18n/en';
import es from '../../i18n/es';
import LocalStorageService from '../../services/LocalStorageService';

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

function setStepsStrings(props, steps) {
    const strings =  locales[props.locale]['TutorialComponent'];
    const customStrings = props.strings;
    steps.forEach(step => {
        step.title = customStrings[step.titleRef];
        step.text = customStrings[step.textRef];
        step.text += ' ' + strings.seeMore;
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
                    displayed: false
                };

                this.start = this.start.bind(this);
                this.reset = this.reset.bind(this);
                this.onCallback = this.onCallback.bind(this);
            }

            addSteps(props, joyride) {
                let steps = props.steps;
                if (!steps.length) {
                    return false;
                }

                steps = setStepsStyles(steps);
                steps = setStepsStrings(props, steps);
                joyride.parseSteps(steps);
            }

            start(joyride) {
                const {route} = this.props;
                if (!LocalStorageService.getObjectProperty('nekuno_tutorial', route.name) && !this.state.displayed) {
                    this.addSteps(this.props, joyride);
                    window.setTimeout(() => {
                        joyride.start()
                    }, 0);
                    this.setState({displayed: true});
                }
            }

            reset(joyride) {
                joyride.stop();
                joyride.reset();
            }

            onCallback(tour) {
                const {route} = this.props;
                if (tour.type === 'finished') {
                    LocalStorageService.setObjectProperty('nekuno_tutorial', route.name);
                }
            }

            render() {
                return (
                    <Component {...this.props} startTutorial={this.start} resetTutorial={this.reset} tutorialLocale={getLocale(this.props)} endTutorialHandler={this.onCallback}/>
                );
            }
        }

        TutorialComponent.contextTypes = {
            steps             : React.PropTypes.array,
            startTutorial     : React.PropTypes.func,
            resetTutorial     : React.PropTypes.func,
            endTutorialHandler: React.PropTypes.func,
            tutorialLocale    : React.PropTypes.object,
        };

        return TutorialComponent;
    };
};