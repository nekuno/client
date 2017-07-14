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
        step.title = customStrings[step.titleRef];
        step.text = customStrings[step.textRef];
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

            start(joyride, force = false) {
                const {route, user} = this.props;
                if ((force || !user.tutorials || !user.tutorials.some(tutorial => tutorial === route.name)) && !this.state.displayed) {
                    this.addSteps(this.props, joyride);
                    window.setTimeout(() => {
                        joyride.start(true);
                    }, 0);
                    this.setState({displayed: true});
                }
            }

            reset(joyride) {
                joyride.stop();
                joyride.reset();
                this.setState({displayed: false});
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
                    this.setState({displayed: false});
                }
            }

            render() {
                return (
                    <Component {...this.props} startTutorial={this.start} resetTutorial={this.reset} tutorialLocale={getLocale(this.props)} endTutorialHandler={this.onCallback}/>
                );
            }
        }

        TutorialComponent.contextTypes = {
            steps             : PropTypes.array,
            startTutorial     : PropTypes.func,
            resetTutorial     : PropTypes.func,
            endTutorialHandler: PropTypes.func,
            tutorialLocale    : PropTypes.object,
        };

        return TutorialComponent;
    };
}