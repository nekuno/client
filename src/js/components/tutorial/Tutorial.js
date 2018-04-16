import PropTypes from 'prop-types';
import { default as React } from 'react';
import connectToStores from '../../utils/connectToStores';
import * as UserActionCreators from '../../actions/UserActionCreators';
import TranslationService from '../../services/TranslationService';
import LoginStore from '../../stores/LoginStore';

function setStepsStyles(steps) {
    steps.forEach(step => {
        step.style = {
            mainColor: '#6342b1',
            beacon: {
                offsetX: 0,
                offsetY: 0,
                inner: '#a350f0',
                outer: '#a350f0'
            },
            close: {
                display: 'none'
            }
        };
    });

    return steps;
}

function setStepsStrings(props, steps) {
    const strings =  TranslationService.getCategoryStrings(props.locale, 'TutorialComponent');
    const customStrings = props.strings;
    steps.forEach(step => {
        if (step.titleRef) {
            step.title = customStrings[step.titleRef];
            delete step.titleRef;
        }
        if (step.textRef) {
            step.text = customStrings[step.textRef];
            delete step.textRef;
        }
        // TODO: Uncomment to show "see more" link
        //step.text += ' ' + strings.seeMore;
    });

    return steps;
}

function getLocale(props) {
    const strings = TranslationService.getCategoryStrings(props.locale, 'TutorialComponent');
    return {
        back: strings.back,
        close: strings.close,
        last: strings.last,
        next: strings.next,
        skip: strings.skip
    };
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const user = LoginStore.user;

    return {
        user
    };
}

export default function tutorial() {

    return Component => {
        @connectToStores([LoginStore], getState)
        class TutorialComponent extends React.Component {

            static propTypes = {
                steps         : PropTypes.array,
                startTutorial : PropTypes.bool,
                tutorialLocale: PropTypes.object,
                strings       : PropTypes.object,
                user          : PropTypes.object
            };

            constructor(props) {
                super(props);

                this.state = {
                    steps: props.steps,
                    running: false
                };

                this.parseSteps = this.parseSteps.bind(this);
                this.start = this.start.bind(this);
                this.onCallback = this.onCallback.bind(this);
            }

            componentWillMount() {
                this.parseSteps();
            }

            addSteps(props) {
                let steps = props.steps;
                if (!steps.length) {
                    return [];
                }
                steps = setStepsStyles(steps);

                return setStepsStrings(props, steps);
            }

            parseSteps() {
                const steps = this.addSteps(this.props);
                this.setState({steps: steps});
            }

            start(force = false) {
                const {route, user} = this.props;
                if ((force || !user.tutorials || !user.tutorials.some(tutorial => tutorial === route.name)) && !this.state.running) {
                    this.setState({running: true});
                }
            }

            onCallback(tour) {
                const {route, user} = this.props;
                if (tour.type === 'finished') {
                    let userData = {};
                    userData.tutorials = user.tutorials || [];
                    if (!userData.tutorials.some(value => value === route.name)) {
                        userData.tutorials.push(route.name);
                    }
                    UserActionCreators.editUser(userData);
                    this.setState({running: false});
                }
            }

            render() {
                const {steps, running} = this.state;
                return (
                    <Component {...this.props} steps={steps} parseSteps={this.parseSteps} startTutorial={this.start} tutorialLocale={getLocale(this.props)} endTutorialHandler={this.onCallback} joyrideRunning={running}/>
                );
            }
        }

        TutorialComponent.contextTypes = {
            steps             : PropTypes.array,
            startTutorial     : PropTypes.func,
            endTutorialHandler: PropTypes.func,
            tutorialLocale    : PropTypes.object,
            joyrideRunning    : PropTypes.bool,
        };

        return TutorialComponent;
    };
}