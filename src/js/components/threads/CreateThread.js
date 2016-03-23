import React, { PropTypes, Component } from 'react';
import TextInput from '../ui/TextInput';
import CreateContentThread from './CreateContentThread';
import CreateUserThread from './CreateUserThread';
import TextRadios from '../ui/TextRadios';
import FullWidthButton from '../ui/FullWidthButton';

export default class CreateThread extends Component {
    static propTypes = {
    };

    constructor(props) {
        super(props);

        this.handleClickType = this.handleClickType.bind(this);

        this.state = {
            type: null
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
                        <span className={this.state.type ? "icon-circle active" : "icon-circle"}></span>
                    </div>
                    <TextRadios labels={[{key: 'persons', text: 'Personas'}, {key: 'contents', text: 'Contenidos'}]} onClickHandler={this.handleClickType} value={this.state.type} />
                    {this.state.type ? <div className="vertical-line"></div> : ''}
                </div>
                {this.state.type === 'contents' ?
                    <CreateContentThread /> : '' }
                {this.state.type === 'persons' ?
                    <CreateUserThread /> : '' }
                <br />
                <br />
                <br />
                <br />
                <br />
                {this.state.type ? <FullWidthButton>Crear hilo</FullWidthButton> : ''}
                <br />
                <br />
                <br />
            </div>
        );
    }

    handleClickType(type) {
        this.setState({
            type: type
        });
    }

    handleClickFilter(type) {
        let filters = this.state.filters;
        let index = filters.indexOf(type);
        if (index > -1) {
            filters.splice(index, 1);
        } else {
            filters.push(type);
        }
        this.setState({
            filters: filters
        });
    }
}
