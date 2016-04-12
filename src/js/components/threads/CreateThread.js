import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import TextInput from '../ui/TextInput';
import CreateContentThread from './CreateContentThread';
import CreateUsersThread from './CreateUsersThread';
import TextRadios from '../ui/TextRadios';

export default class CreateThread extends Component {
    static propTypes = {
        userId: PropTypes.number.isRequired,
        filters: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickCategory = this.handleClickCategory.bind(this);

        this.state = {
            category: null
        };
    }

    render() {
        let verticalLines = [];
        let content = '';
        switch (this.state.category) {
            case 'contents':
                verticalLines = [<div key={1} className="content-first-vertical-line"></div>, <div key={2} className="content-last-vertical-line"></div>];
                content = <CreateContentThread userId={this.props.userId} filters={this.props.filters['contentFilters']}/>;
                break;
            case 'persons':
                verticalLines = [<div key={1} className="users-first-vertical-line"></div>, <div key={2} className="users-last-vertical-line"></div>];
                content = <CreateUsersThread userId={this.props.userId} filters={this.props.filters['profileFilters']}/>;
                break;
        }
        return (
            <div>
                <div className="thread-title list-block">
                    <ul>
                        <TextInput placeholder={'Escribe un título descriptivo del hilo'} />
                    </ul>
                </div>
                {verticalLines.map(verticalLine => verticalLine)}
                <div className="main-filter-wprapper">
                    <div className="thread-filter radio-filter">
                        <div className="thread-filter-dot">
                            <span className={this.state.category ? "icon-circle active" : "icon-circle"}></span>
                        </div>
                        <TextRadios labels={[{key: 'persons', text: 'Personas'}, {key: 'contents', text: 'Contenidos'}]} onClickHandler={this.handleClickCategory} value={this.state.category} />
                    </div>
                </div>
                {content}
            </div>
        );
    }

    handleClickCategory(category) {
        this.setState({
            category: category
        });
    }
}
