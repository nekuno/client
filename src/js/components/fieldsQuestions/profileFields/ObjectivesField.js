import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextCheckboxes from '../../ui/TextCheckboxes';
import FullWidthButton from '../../ui/FullWidthButton';
import translate from '../../../i18n/Translate';

@translate('ObjectivesField')
export default class ObjectivesField extends Component {
    static propTypes = {
        objectives      : PropTypes.array,
        metadata        : PropTypes.object,
        onSaveHandler   : PropTypes.func,
        isJustRegistered: PropTypes.bool,
        // Injected by @translate:
        strings         : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onClickObjective = this.onClickObjective.bind(this);
        this.handleClickSave = this.handleClickSave.bind(this);
        this.state = {
            objectives: props.objectives
        };
    }
    
    handleClickSave() {
        const {strings} = this.props;
        const {objectives} = this.state;
        if (objectives.length < 1) {
            nekunoApp.alert(strings.minObjectives);
            return;
        }
        this.props.onSaveHandler('objective', objectives);
    }

    onClickObjective(objective) {
        const {strings} = this.props;
        const {objectives} = this.state;
        let objectivesClone = objectives.slice(0);
        const objectiveIndex = objectivesClone.findIndex(obj => obj === objective);

        if (objectiveIndex !== -1) {
            if (objectivesClone.length <= 1) {
                nekunoApp.alert(strings.minObjectives);
                return;
            }
            objectivesClone.splice(objectiveIndex, 1);
        } else {
            objectivesClone.push(objective);
        }
        this.setState({
            objectives: objectivesClone
        });
    }

    getLabels(metadata) {
        let labels = [];
        if (metadata && metadata.objective) {
            Object.keys(metadata.objective.choices).forEach((index) => {
                labels.push({
                    key: index,
                    text: metadata.objective.choices[index]
                });
            });
        }

        return labels;
    }
    
    render() {
        const {metadata, isJustRegistered, strings} = this.props;
        const {objectives} = this.state;
        return (
            <div>
                <div className="answer-question">
                    <div className="title answer-question-title">
                        {isJustRegistered ? strings.title : strings.existingUserTitle}
                    </div>
                    <div className="objectives-field">
                        <TextCheckboxes title={strings.objectives} labels={this.getLabels(metadata)} onClickHandler={this.onClickObjective} values={objectives}/>
                    </div>
                </div>
                <br />
                <br />
                <FullWidthButton type="submit" onClick={this.handleClickSave}>{strings.save}</FullWidthButton>
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }
}

ObjectivesField.defaultProps = {
    strings: {
        title            : 'What are you objectives at Nekuno?',
        existingUserTitle: 'We are improving your recommendations. Please select your objectives at Nekuno',
        minObjectives    : 'The minimum number of options permitted is 1, check any option and save',
        objectives       : 'Select your objectives',
        save             : 'Save'
    }
};
