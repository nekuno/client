import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chip from '../../ui/Chip';
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
        const {metadata, strings} = this.props;
        const {objectives} = this.state;
        const objectiveMetadata = metadata.objective;
        if (objectiveMetadata && objectiveMetadata.min_choices && objectives.length < objectiveMetadata.min_choices) {
            nekunoApp.alert(strings.minObjectives.replace('%min%', objectiveMetadata.min_choices));
            return;
        }
        this.props.onSaveHandler('objective', objectives);
    }

    onClickObjective(objective) {
        const {objectives} = this.state;
        let objectivesClone = objectives.slice(0);
        const objectiveIndex = objectivesClone.findIndex(obj => obj === objective);

        if (objectiveIndex !== -1) {
            objectivesClone.splice(objectiveIndex, 1);
        } else {
            objectivesClone.push(objective);
        }
        this.setState({
            objectives: objectivesClone
        });
    }

    getIconClass(objective) {
        switch (objective) {
            case 'human-contact':
                return "icon icon-heart";
            case 'talk':
                return "icon icon-comments";
            case 'work':
                return "icon icon-lightbulb";
            case 'explore':
                return "icon icon-compass";
            case 'share-space':
                return "icon icon-cubes";
            case 'hobbies':
                return "icon icon-gamepad";
            default:
                return "";
        }
    }
    
    render() {
        const {metadata, isJustRegistered, strings} = this.props;
        const {objectives} = this.state;
        return (
            metadata && metadata.objective ?
                <div>
                    <div className="answer-question">
                        <div className="title answer-question-title">
                            {isJustRegistered ? strings.title : strings.existingUserTitle}
                        </div>
                        <div className="objectives-field">
                            <div className="text-checkboxes">
                                {Object.keys(metadata.objective.choices).map((index) =>
                                    <Chip key={index} onClickHandler={this.onClickObjective.bind(this, index)} disabled={!objectives.some(value => value == index)}>
                                        <div className={this.getIconClass(index)}></div>
                                        <div className="">{metadata.objective.choices[index]}</div>
                                    </Chip>
                                    )}
                            </div>
                        </div>
                        <div className="button-wrapper">
                            <FullWidthButton type="submit" onClick={this.handleClickSave}>{strings.save}</FullWidthButton>
                        </div>
                    </div>
                </div> : null
        );
    }
}

ObjectivesField.defaultProps = {
    strings: {
        title            : 'I want to meet compatible people for...',
        existingUserTitle: 'I want to meet compatible people for...',
        minObjectives    : 'The minimum number of options permitted is %min%, check any option and save',
        objectives       : 'Select your objectives',
        save             : 'Continue'
    }
};
