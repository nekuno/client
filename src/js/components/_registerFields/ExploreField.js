import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from '../ui/Button';
import translate from '../../i18n/Translate';

@translate('ExploreField')
export default class ExploreField extends Component {
    static propTypes = {
        profile          : PropTypes.object.isRequired,
        showContinue     : PropTypes.bool,
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
        this.getButtonText = this.getButtonText.bind(this);

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
            <div className={this.profileHasField(profile, 'profession') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('profession')}>{strings.skills}</Button>
            </div>
            <div className={this.profileHasField(profile, 'proposal') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('proposal')}>{strings.proposalsLiked}</Button>
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
                <Button type="submit" onClick={() => this.props.onDetailSelection('sports')}>{strings.sports}</Button>
            </div>
            <div className={this.profileHasField(profile, 'games') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('games')}>{strings.games}</Button>
            </div>
            <div className={this.profileHasField(profile, 'creative') ? "button-wrapper active" : "button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('creative')}>{strings.creative}</Button>
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
            <div className="register-field-detail-title">{strings.leisure1 + ' ' + strings.leisure2}</div>

            <div className={this.profileHasField(profile, 'leisureMoney') ? "button-wrapper small-width active" : "small-width button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('leisureMoney')}>{strings.leisureMoney}</Button>
            </div>
            <div className={this.profileHasField(profile, 'leisureTime') ? "button-wrapper small-width active" : "small-width button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('leisureTime')}>{strings.leisureTime}</Button>
            </div>
            <div className={this.profileHasField(profile, 'travelling') ? "button-wrapper small-width active" : "small-width button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('travelling')}>{strings.travels}</Button>
            </div>
            <div className={this.profileHasField(profile, 'activity') ? "button-wrapper small-width active" : "small-width button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('activity')}>{strings.activities}</Button>
            </div>
            <div className={this.profileHasField(profile, 'tickets') ? "button-wrapper small-width active" : "small-width button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('tickets')}>{strings.tickets}</Button>
            </div>
            <div className={this.profileHasField(profile, 'leisurePlan') ? "button-wrapper small-width active" : "small-width button-wrapper"}>
                <Button type="submit" onClick={() => this.props.onDetailSelection('leisurePlan')}>{strings.leisurePlans}</Button>
            </div>
            {profile.objective && profile.objective.some(objective => objective === 'explore') ?
                <div className="button-wrapper active">
                    <Button type="submit" onClick={this.handleClickSave}>{strings.save}</Button>
                </div>
                : null
            }
        </div>
    };

    getButtonText() {
        const {profile, showContinue, strings} = this.props;
        if(!showContinue) {
            return strings.finish;
        } else if(this.profileHasAnyField(profile, ['industry', 'profession', 'proposal', 'sports', 'games', 'creative', 'travelling', 'activity', 'tickets', 'leisureTime', 'leisureMoney', 'leisurePlan'])) {
            return strings.save;
        }

        return strings.skip;
    }

    profileHasAnyField = function(profile, fields) {
        return fields.some(field => profile && profile[field] && profile[field].length !== 0);
    };

    profileHasField = function(profile, field) {
        return profile && profile[field] && profile[field].length !== 0;
    };

    render() {
        const {profile, showContinue, strings} = this.props;
        const {selectedObjective, savedDetails} = this.state;
        const objectivesClass = "register-field objectives-field";

        return (
            <div className="register-fields">
                {selectedObjective || savedDetails && !showContinue ?
                    <div className="back-button-icon" onClick={selectedObjective ? this.handleClickSave : this.backToHome}>
                        <span className="icon-left-arrow"/>
                    </div>
                    : null
                }
                {(selectedObjective || savedDetails) && !showContinue ?
                    <div className="main-icon">
                        <span className="icon-compass2"/>
                        <div className="main-icon-text">{strings.explore}</div>
                    </div>
                    : null
                }
                <div className={selectedObjective ? "hide " + objectivesClass : savedDetails || showContinue ? "show " + objectivesClass : objectivesClass}>
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
                    {savedDetails || showContinue ?
                        <div className="register-fields-continue">
                            <Button onClick={this.props.onSaveHandler}>{this.getButtonText()}</Button>
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
        explore       : 'Explore',
        work1         : 'Work',
        work2         : '& ideas',
        hobbies1      : 'Hobbies',
        hobbies2      : '& games',
        leisure1      : 'Adventures',
        leisure2      : '& activity',
        industry      : 'Industry',
        skills        : 'Skills',
        proposalsLiked: 'Proposals',
        sports        : 'Sports',
        games         : 'Games',
        creative      : 'Creative',
        leisureTime   : 'Time',
        leisureMoney  : 'Money',
        travels       : 'Travels',
        tickets       : 'Tickets',
        activities    : 'Activities',
        leisurePlans  : 'Plans',
        save          : 'Continue',
        finish        : 'Finish',
        skip          : 'Skip',
        selectOther   : 'You can select more than one'
    }
};
