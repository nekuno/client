import React, { PropTypes, Component } from 'react';
import TextInput from '../ui/TextInput';
import CreateContentThread from './CreateContentThread';
import CreateUsersThread from './CreateUsersThread';
import TextRadios from '../ui/TextRadios';
import FullWidthButton from '../ui/FullWidthButton';

export default class CreateThread extends Component {
    static propTypes = {
    };

    constructor(props) {
        super(props);

        this.handleClickCategory = this.handleClickCategory.bind(this);
        this.handleClickFilters = this.handleClickFilters.bind(this);

        this.state = {
            category: null,
            filters: {}
        }
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
                {this.state.category ? <FullWidthButton>Crear hilo</FullWidthButton> : ''}
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


}
