import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
const ReactStateSetters = require('react/lib/ReactStateSetters');
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
            threadName: '',
            category: null
        };
    }

    render() {
        let verticalLines = [];
        let content = '';
        const {userId, filters} = this.props;
        const {category, threadName} = this.state;
        switch (category) {
            case 'contents':
                verticalLines = [<div key={1} className="content-first-vertical-line"></div>, <div key={2} className="content-last-vertical-line"></div>];
                content = <CreateContentThread userId={userId} filters={filters['contentFilters']} threadName={threadName}/>;
                break;
            case 'persons':
                verticalLines = [<div key={1} className="users-first-vertical-line"></div>, <div key={2} className="users-last-vertical-line"></div>];
                content = <CreateUsersThread userId={userId} filters={filters['profileFilters']} threadName={threadName}/>;
                break;
        }
        return (
            <div>
                <div className="thread-title list-block">
                    <ul>
                        <TextInput placeholder={'Escribe un título descriptivo del hilo'} valueLink={this.linkState('threadName')}/>
                    </ul>
                </div>
                {verticalLines.map(verticalLine => verticalLine)}
                <div className="main-filter-wprapper">
                    <div className="thread-filter radio-filter">
                        <div className="thread-filter-dot">
                            <span className={category ? "icon-circle active" : "icon-circle"}></span>
                        </div>
                        <TextRadios labels={[{key: 'persons', text: 'Personas'}, {key: 'contents', text: 'Contenidos'}]} onClickHandler={this.handleClickCategory} value={category} />
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

    linkState(key) {
        return new ReactLink(this.state[key], ReactStateSetters.createStateKeySetter(this, key));
    }
}
