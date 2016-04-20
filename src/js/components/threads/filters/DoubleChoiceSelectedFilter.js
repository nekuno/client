import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import TextRadios from '../../ui/TextRadios';

export default class DoubleChoiceSelectedFilter extends Component {
    static propTypes = {
        handleClickRemoveFilter: PropTypes.func.isRequired,
        choices: PropTypes.object.isRequired,
        doubleChoices: PropTypes.object.isRequired,
        handleClickDoubleChoiceChoice: PropTypes.func.isRequired,
        handleClickDoubleChoiceDetail: PropTypes.func.isRequired,
        choice: PropTypes.string,
        detail: PropTypes.string,
        label: PropTypes.string
    };

    getSelectedFilter() {
        return this.refs.selectedFilter.getSelectedFilter();
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter.selectedFilterContains(target);
    }

    render() {
        const {handleClickRemoveFilter, choices, doubleChoices, handleClickDoubleChoiceChoice, handleClickDoubleChoiceDetail, choice, detail, label} = this.props;
        return(
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'radio'} active={choice ? true : false} handleClickRemoveFilter={handleClickRemoveFilter}>
                <div className="double-choice-filter">
                    <TextRadios labels={Object.keys(choices).map(choice => { return({key: choice, text: choices[choice]}); }) }
                                onClickHandler={handleClickDoubleChoiceChoice} value={choice} className={'double-choice-choice'}
                                title={label} />
                    {choice ?
                        <TextRadios labels={Object.keys(doubleChoices[choice]).map(doubleChoice => { return({key: doubleChoice, text: doubleChoices[choice][doubleChoice]}); }) }
                                    onClickHandler={handleClickDoubleChoiceDetail} value={detail} className={'double-choice-detail'}/>
                        : ''}
                </div>
            </ThreadSelectedFilter>
        );
    }
}