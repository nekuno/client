import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import TextInput from '../ui/TextInput';
import CreateContentThread from './CreateContentThread';
import CreateUsersThread from './CreateUsersThread';
import TextRadios from '../ui/TextRadios';

export default class CreateThread extends Component {
    static propTypes = {
        userId: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickCategory = this.handleClickCategory.bind(this);

        this.state = {
            category: null
        };
    }

    render() {
        return (
            <div>
                <div className="list-block">
                    <ul>
                        <TextInput placeholder={'Escribe un título descriptivo del hilo'} />
                    </ul>
                </div>
                {this.state.category === 'contents' ? <div className="content-first-vertical-line"></div> : ''}
                {this.state.category === 'persons' ? <div className="users-first-vertical-line"></div> : ''}
                {this.state.category === 'persons' ? <div className="users-last-vertical-line"></div> : ''}
                <div className="thread-filter radio-filter">
                    <div className="thread-filter-dot">
                        <span className={this.state.category ? "icon-circle active" : "icon-circle"}></span>
                    </div>
                    <TextRadios labels={[{key: 'persons', text: 'Personas'}, {key: 'contents', text: 'Contenidos'}]} onClickHandler={this.handleClickCategory} value={this.state.category} />
                </div>
                <div className="table-row"></div>
                {this.state.category === 'contents' ?
                    <CreateContentThread userId={this.props.userId}/> : '' }
                {this.state.category === 'persons' ?
                    <CreateUsersThread userId={this.props.userId}/> : '' }
            </div>
        );
    }

    handleClickCategory(category) {
        this.setState({
            category: category
        });
    }
}
