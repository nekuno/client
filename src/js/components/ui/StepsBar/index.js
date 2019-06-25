import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './StepsBar.scss';

export default class StepsBar extends Component {

    static propTypes = {
        color         : PropTypes.oneOf(['purple', 'blue', 'pink', 'green']),
        totalSteps    : PropTypes.number,
        currentStep   : PropTypes.number,
        canContinue   : PropTypes.bool,
        continueText: PropTypes.string,
        cantContinueText: PropTypes.string,
        onClickHandler: PropTypes.func
    };

    handleClick() {
        const {canContinue} = this.props;
        if (canContinue && this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    renderDots = function(totalSteps, currentStep) {
        let dots = [];

        for (let i = 0; i < totalSteps; i++) {
            dots.push(<li key={i} className={i === currentStep ? styles.active : null}>
                <div className={styles.dot}/>
            </li>);
        }

        return <ul className={styles.dots}>
            {dots.map(dot => dot)}
        </ul>;
    };

    render() {
        const {color, totalSteps, currentStep, canContinue, continueText, cantContinueText} = this.props;
        const textClass = totalSteps > 0 ?
            canContinue ? styles.continue : styles.cantContinue
            : canContinue ? styles.noSteps + ' ' + styles.continue : styles.noSteps + ' ' + styles.cantContinue;

        let stepsBarClass = styles.stepsBar + ' ' + styles[color];
        stepsBarClass = !canContinue ? stepsBarClass + ' ' + styles.cantContinue : stepsBarClass;

        return (
            <div className={styles.stepsBarWrapper}>
                <div className={stepsBarClass} onClick={this.handleClick.bind(this)}>
                    {totalSteps > 0 ?
                        this.renderDots(totalSteps, currentStep)
                        : null
                    }
                    <div className={textClass + ' small'}>
                        {canContinue ? continueText + ' ' : cantContinueText}
                        {totalSteps > 0 && canContinue ? <span className="icon icon-arrow-right" /> : null}
                    </div>
                </div>
            </div>
        );
    }
}