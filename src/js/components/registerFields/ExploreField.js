import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from '../ui/Button';
import translate from '../../i18n/Translate';

@translate('ExploreField')
export default class ExploreField extends Component {
    static propTypes = {
        profile          : PropTypes.object.isRequired,
        onSaveHandler    : PropTypes.func.isRequired,
        onClickField     : PropTypes.func.isRequired,
        onBackHandler    : PropTypes.func.isRequired,
        onDetailSelection: PropTypes.func.isRequired,
        // Injected by @translate:
        strings          : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onClickObjective = this.onClickObjective.bind(this);
        this.handleClickSave = this.handleClickSave.bind(this);
        this.renderWorkDetail = this.renderWorkDetail.bind(this);
        this.renderHobbiesDetail = this.renderHobbiesDetail.bind(this);
        this.renderLeisureDetail = this.renderLeisureDetail.bind(this);
        this.backToHome = this.backToHome.bind(this);

        this.state = {
            objectiveSelected: null,
            savedDetails     : null,
        }
    }

    handleClickSave() {
        this.setState({selectedObjective: null, savedDetails: true});
    }

    onClickObjective(objective) {
        this.setState({
            selectedObjective: objective
        });

        this.props.onClickField();
    }

    backToHome() {
        this.setState({selectedObjective: null, savedDetails: null});
        this.props.onBackHandler();
    }

    renderFieldDetail = function(objective) {
        let detail;
        switch (objective) {
            case 'work':
                detail = this.renderWorkDetail();
                break;
            case 'hobbies':
                detail = this.renderHobbiesDetail();
                break;
            case 'explore':
                detail = this.renderLeisureDetail();
                break;
        }

        return <div className="register-field-detail objectives-field-detail">{detail}</div>
    };

    renderWorkDetail() {
        const {profile, strings} = this.props;
        return <div>
            <div className="register-field-detail-title">{strings.work1 + ' ' + strings.work2}</div>

            <div className={this.profileHasField(profile, 'industry') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('industry')}>{strings.industry}</Button>
            </div>
            <div className={this.profileHasField(profile, 'skills') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('industry')}>{strings.skills}</Button>
            </div>
            <div className={this.profileHasField(profile, 'proposals') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('industry')}>{strings.proposals}</Button>
            </div>
            {profile.objective && profile.objective.some(objective => objective === 'work') ?
                <div className="button-wrapper active">
                    <Button type="submit" onClick={this.handleClickSave}>{strings.save}</Button>
                </div>
                : null
            }
        </div>
    };

    renderHobbiesDetail() {
        const {profile, strings} = this.props;
        return <div>
            <div className="register-field-detail-title">{strings.hobbies1 + ' ' + strings.hobbies2}</div>

            <div className={this.profileHasField(profile, 'sports') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('industry')}>{strings.sports}</Button>
            </div>
            <div className={this.profileHasField(profile, 'games') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('industry')}>{strings.games}</Button>
            </div>
            <div className={this.profileHasField(profile, 'creative') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('industry')}>{strings.creative}</Button>
            </div>
            {profile.objective && profile.objective.some(objective => objective === 'hobbies') ?
                <div className="button-wrapper active">
                    <Button type="submit" onClick={this.handleClickSave}>{strings.save}</Button>
                </div>
                : null
            }
        </div>
    };

    renderLeisureDetail() {
        const {profile, strings} = this.props;
        return <div>
            <div className="register-field-detail-title">{strings.hobbies1 + ' ' + strings.hobbies2}</div>

            <div className={this.profileHasField(profile, 'tickets') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('industry')}>{strings.tickets}</Button>
            </div>
            <div className={this.profileHasField(profile, 'activities') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('industry')}>{strings.activities}</Button>
            </div>
            <div className={this.profileHasField(profile, 'travels') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('industry')}>{strings.travels}</Button>
            </div>
            {profile.objective && profile.objective.some(objective => objective === 'explore') ?
                <div className="button-wrapper active">
                    <Button type="submit" onClick={this.handleClickSave}>{strings.save}</Button>
                </div>
                : null
            }
        </div>
    };

    profileHasField = function(profile, field) {
        return profile && profile[field] && profile[field].length !== 0;
    };

    render() {
        const {profile, strings} = this.props;
        const {selectedObjective, savedDetails} = this.state;
        const objectivesClass = "register-field objectives-field";

        return (
            <div className="register-fields">
                {selectedObjective || savedDetails ?
                    <div className="back-button-icon" onClick={selectedObjective ? this.handleClickSave : this.backToHome}>
                        <span className="icon-left-arrow"/>
                    </div>
                    : null
                }
                {selectedObjective || savedDetails ?
                    <div className="main-icon">
                        <span className="icon-compass2"/>
                        <div className="main-icon-text">{strings.explore}</div>
                    </div>
                    : null
                }
                <div className={selectedObjective ? "hide " + objectivesClass : savedDetails ? "show " + objectivesClass : objectivesClass}>
                    <div className="register-field-icons">
                        <div className={profile.objective && profile.objective.some(objective => objective === 'work') ? "register-field-icon active" : "register-field-icon"} onClick={this.onClickObjective.bind(this, 'work')}>
                            <span className="icon-lightbulb"/>
                            <div className="register-filed-icon-text">{strings.work1}</div>
                            <div className="register-filed-icon-text">{strings.work2}</div>
                        </div>
                        <div className={profile.objective && profile.objective.some(objective => objective === 'hobbies') ? "register-field-icon active" : "register-field-icon"} onClick={this.onClickObjective.bind(this, 'hobbies')}>
                            <span className="icon-gamepad"/>
                            <div className="register-filed-icon-text">{strings.hobbies1}</div>
                            <div className="register-filed-icon-text">{strings.hobbies2}</div>
                        </div>
                        <div className={profile.objective && profile.objective.some(objective => objective === 'explore') ? "register-field-icon active" : "register-field-icon"} onClick={this.onClickObjective.bind(this, 'explore')}>
                            <span className="icon-compass"/>
                            <div className="register-filed-icon-text">{strings.leisure1}</div>
                            <div className="register-filed-icon-text">{strings.leisure2}</div>
                        </div>
                    </div>
                    {savedDetails ?
                        <div className="register-fields-continue">
                            <Button onClick={this.props.onSaveHandler}>{strings.finish}</Button>
                            <div className="title">{strings.selectOther}</div>
                        </div>
                        : null
                    }
                </div>
                {selectedObjective ? this.renderFieldDetail(selectedObjective) : null}
            </div>
        );
    }
}

ExploreField.defaultProps = {
    strings: {
        explore    : 'Explore',
        work1      : 'Work',
        work2      : '& ideas',
        hobbies1   : 'Hobbies',
        hobbies2   : '& games',
        leisure1   : 'Adventures',
        leisure2   : '& activity',
        industry   : 'Industry',
        skills     : 'Skills',
        proposals  : 'Proposals',
        sports     : 'Sports',
        games      : 'Games',
        creative   : 'Creative',
        activities : 'Activities',
        travels    : 'Travels',
        tickets    : 'Tickets',
        save       : 'Continue',
        finish     : 'Finish',
        selectOther: 'You can select more than one'
    }
};
