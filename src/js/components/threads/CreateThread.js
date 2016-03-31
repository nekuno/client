import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import TextInput from '../ui/TextInput';
import CreateContentThread from './CreateContentThread';
import CreateUsersThread from './CreateUsersThread';
import TextRadios from '../ui/TextRadios';
import FullWidthButton from '../ui/FullWidthButton';

export default class CreateThread extends Component {
    static propTypes = {
        userId: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickCategory = this.handleClickCategory.bind(this);
        this.handleClickFilters = this.handleClickFilters.bind(this);
        this.createThread = this.createThread.bind(this);

        this.state = {
            category: null,
            filters: {}}

    }

    render() {
        return (
            <div>
                <div className="list-block">
                    <ul>
                        <TextInput placeholder={'Escribe un título descriptivo del hilo'} />
                    </ul>
                </div>
                <div className="thread-filter">
                    <div className="thread-filter-dot">
                        <span className={this.state.category ? "icon-circle active" : "icon-circle"}></span>
                    </div>
                    <TextRadios labels={[{key: 'persons', text: 'Personas'}, {key: 'contents', text: 'Contenidos'}]} onClickHandler={this.handleClickCategory} value={this.state.category} />
                    {this.state.category ? <div className="vertical-line"></div> : ''}
                </div>
                {this.state.category === 'contents' ?
                    <CreateContentThread onClickHandler={this.handleClickFilters}/> : '' }
                {this.state.category === 'persons' ?
                    <CreateUsersThread onClickHandler={this.handleClickFilters}/> : '' }
                <br />
                <br />
                <br />
                <br />
                <br />
                {this.state.category ? <FullWidthButton onClick={this.createThread}>Crear hilo</FullWidthButton> : ''}
                <br />
                <br />
                <br />
            </div>
        );
    }

    handleClickCategory(category) {
        this.setState({
            category: category
        });
    }

    handleClickFilters(filters)
    {
        let state = this.state;

        for (var attrname in filters) {
            if (filters.hasOwnProperty(attrname)){
                state.filters[attrname] = filters[attrname];
            }
        }

        this.setState(state);
    }

    createThread()
    {
        let data={
            name: document.querySelector('.list-block input').value,
            filters: {}
        };

        if (this.state.category == null) {
            return false;
        } else if (this.state.category == 'contents'){
                data.category='ThreadContent';
            if (this.state.filters.type.length > 0){
                data.filters.type = this.state.filters.type;
            }
            if (this.state.filters.tags.length > 0){
                data.filters.tags = this.state.filters.tags;
            }

        } else if (this.state.category == 'persons'){
            //TODO: UsersThread
            return false;
        } else {
            return false;
        }

        UserActionCreators.createThread(this.props.userId, data);
    }

}
