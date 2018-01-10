import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FullWidthButton from '../ui/FullWidthButton';
import Button from '../ui/Button';
import translate from '../../i18n/Translate';
import Framework7Service from '../../services/Framework7Service';

@translate('ObjectivesField')
export default class ObjectivesField extends Component {
    static propTypes = {
        onChangeField    : PropTypes.func,
        onSaveHandler   : PropTypes.func,
        // Injected by @translate:
        strings         : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onClickObjective = this.onClickObjective.bind(this);
        this.handleClickSave = this.handleClickSave.bind(this);
        this.renderWorkDetail = this.renderWorkDetail.bind(this);

        this.state = {
            objectives: [],
            objectiveSelected: null,
            savedDetails: null,
        }
    }
    
    handleClickSave() {
        this.setState({selectedObjective: null, savedDetails: true});
    }

    onClickObjective(objective) {
        console.log(objective)
        const {objectives} = this.state;
        let objectivesClone = objectives.slice(0);
        const objectiveIndex = objectivesClone.findIndex(obj => obj === objective);

        if (objectiveIndex !== -1) {
            // Do nothing
        } else {
            objectivesClone.push(objective);
            this.setState({selectedObjective: objective});
        }
        this.setState({
            objectives: objectivesClone
        });

        this.props.onClickField();
    }

    renderFieldDetail = function(objective) {
        let detail;
        switch (objective) {
            case 'work':
                detail = this.renderWorkDetail();
        }

        return <div className="register-field-detail objectives-field-detail">{detail}</div>
    };

    renderWorkDetail() {
        const {strings} = this.props;
        return <div>
            Connect Linkedin...
            <div className="button-wrapper">
                <FullWidthButton type="submit" onClick={this.handleClickSave}>{strings.save}</FullWidthButton>
            </div>
        </div>
    };
    
    render() {
        const {strings} = this.props;
        const {objectives, selectedObjective, savedDetails} = this.state;
        const objectivesClass = "register-field objectives-field";

        return (
            <div className="register-fields">
                <div className={selectedObjective ? "hide " + objectivesClass : savedDetails ? "show " + objectivesClass : objectivesClass}>
                    {savedDetails ?
                        <div className="register-fields-continue">
                            <Button onClick={this.props.onSaveHandler}>{strings.save}</Button>
                            <div className="title">{strings.selectOther}</div>
                        </div>
                        : null
                    }
                    <div className="register-field-icons">
                        <div className={objectives.some(objective => objective === 'work') ? "register-field-icon active" : "register-field-icon"} onClick={this.onClickObjective.bind(this, 'work')}>
                            <span className="icon-lightbulb"/>
                            <div className="register-filed-icon-text">{strings.work1}</div>
                            <div className="register-filed-icon-text">{strings.work2}</div>
                        </div>
                        <div className={objectives.some(objective => objective === 'hobbies') ? "register-field-icon active" : "register-field-icon"} onClick={this.onClickObjective.bind(this, 'hobbies')}>
                            <span className="icon-gamepad"/>
                            <div className="register-filed-icon-text">{strings.hobbies1}</div>
                            <div className="register-filed-icon-text">{strings.hobbies2}</div>
                        </div>
                        <div className={objectives.some(objective => objective === 'explore') ? "register-field-icon active" : "register-field-icon"} onClick={this.onClickObjective.bind(this, 'explore')}>
                            <span className="icon-compass"/>
                            <div className="register-filed-icon-text">{strings.explore1}</div>
                            <div className="register-filed-icon-text">{strings.explore2}</div>
                        </div>
                    </div>
                </div>
                {selectedObjective ? this.renderFieldDetail(selectedObjective) : null}
            </div>
        );
    }
}

ObjectivesField.defaultProps = {
    strings: {
        work1   : 'Work',
        work2   : '& ideas',
        hobbies1: 'Hobbies',
        hobbies2: '& games',
        explore1: 'Adventures',
        explore2: '& activity',
        save   : 'Continue',
        selectOther: 'Select other objectives if you want'
    }
};
