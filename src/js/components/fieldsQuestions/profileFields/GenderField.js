import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextRadios from '../../ui/TextRadios';
import InputCheckbox from '../../ui/InputCheckbox';
import FullWidthButton from '../../ui/FullWidthButton';
import translate from '../../../i18n/Translate';
import selectn from 'selectn';
import Framework7Service from '../../../services/Framework7Service';

@translate('GenderField')
export default class GenderField extends Component {
    static propTypes = {
        gender         : PropTypes.string,
        metadata       : PropTypes.object,
        onSaveHandler  : PropTypes.func,
        // Injected by @translate:
        strings        : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onClickGender = this.onClickGender.bind(this);
        this.onClickDescriptiveGender = this.onClickDescriptiveGender.bind(this);
        this.onClickShowDescriptiveGender = this.onClickShowDescriptiveGender.bind(this);
        this.state = {
            gender               : props.gender,
            descriptiveGender    : [],
            showDescriptiveGender: false
        };
    }
    
    handleClickSave() {
        this.props.onSaveHandler(this.state.gender, this.state.descriptiveGender);
    }

    onClickGender(gender) {
        this.setState({
            gender: gender
        })
    }

    onClickDescriptiveGender(checked, value) {

        let descriptiveGender = this.state.descriptiveGender;
        if (descriptiveGender.length === 5 && checked && descriptiveGender.indexOf(value) === -1) {
            Framework7Service.nekunoApp().alert(this.props.strings.maxDescriptiveGender);
        } else {
            if (checked) {
                descriptiveGender.push(value);
            } else {
                descriptiveGender = descriptiveGender.filter(val => val !== value);
            }
        }
        this.setState({
            descriptiveGender: descriptiveGender
        });
    }

    onClickShowDescriptiveGender() {
        this.setState(
            {showDescriptiveGender: !this.state.showDescriptiveGender}
        );
    }
    
    render() {
        const {metadata, strings} = this.props;
        const descriptiveGenderChoices = selectn('descriptiveGender.choices', metadata) || [];
        const descriptiveGenderChoicesLength = descriptiveGenderChoices.length || 0;
        let descriptiveGenderFirstColumnCounter = 0;
        let descriptiveGenderSecondColumnCounter = 0;
        return (
            <div>
                <div className="answer-question">
                    <div className="title answer-question-title">
                        {strings.title}
                    </div>
                    <TextRadios title={this.state.descriptiveGender.length > 0 ? strings.include : strings.gender} labels={[
						{key: 'female', text: strings.female},
						{key: 'nb', text: strings.nb},
						{key: 'male', text: strings.male},
					]} onClickHandler={this.onClickGender} value={this.state.gender}/>
                    <div style={{textAlign: 'center', marginBottom: '20px'}}>
                        <a onClick={this.onClickShowDescriptiveGender}>{ this.state.showDescriptiveGender ? strings.hideDescriptiveGender : strings.showDescriptiveGender}</a>
                    </div>
                    {this.state.showDescriptiveGender && descriptiveGenderChoices ?
                        <div className="list-block">
                            <ul className="checkbox-genders-list">
                                {descriptiveGenderChoices.map(choice => {
                                    descriptiveGenderFirstColumnCounter++;
                                    if (descriptiveGenderFirstColumnCounter > descriptiveGenderChoicesLength / 2) {
                                        return '';
                                    }
                                    let checked = this.state.descriptiveGender.indexOf(choice.id) !== -1;
                                    return (
                                        <li key={choice.id}>
                                            <InputCheckbox value={choice.id} text={choice.text} checked={checked} onClickHandler={this.onClickDescriptiveGender} reverse={true}/>
                                        </li>
                                    )
                                })}
                            </ul>
                            <ul className="checkbox-genders-list">
                                {descriptiveGenderChoices.map(choice => {
                                    descriptiveGenderSecondColumnCounter++;
                                    if (descriptiveGenderSecondColumnCounter <= descriptiveGenderChoicesLength / 2) {
                                        return '';
                                    }
                                    let checked = this.state.descriptiveGender.indexOf(choice.id) !== -1;
                                    return (<li key={choice.id}>
                                        <InputCheckbox value={choice.id} text={choice.text} checked={checked} onClickHandler={this.onClickDescriptiveGender} reverse={true}/>
                                    </li>)
                                })}
                            </ul>
                        </div>

                        :
                        ''
                    }
                </div>
                <br />
                <br />
                <FullWidthButton type="submit" onClick={this.handleClickSave.bind(this)}>{strings.save}</FullWidthButton>
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }
}

GenderField.defaultProps = {
    strings: {
        include              : 'Include on searches as',
        gender               : 'Gender',
        male                 : 'Male',
        female               : 'Female',
        nb                   : 'Non-binary',
        showDescriptiveGender: 'Show other genders',
        hideDescriptiveGender: 'Hide other genders',
        maxDescriptiveGender : 'The maximum number of options permitted is 5, uncheck any other options to choose this one',
        title                : 'Select your gender',
        save                 : 'Save'
    }
};
