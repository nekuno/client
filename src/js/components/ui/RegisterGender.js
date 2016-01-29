import React, { PropTypes, Component } from 'react';
import Chip from './Chip';

export default class RegisterGender extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func.isRequired
    };

    constructor(props) {

        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            gender: null
        };
    }

    render() {
        return (
            <div className="accepted-answers-importance">
                <div className="accepted-answers-importance-title">Incluirme en las búsquedas como</div>
                <div className="accepted-answers-importance-container">
                    <Chip label={"Hombre"} onClickHandler={this.handleClick} value="male" disabled={this.state.gender !== 'male'}/>
                    <Chip label={"Mujer"} onClickHandler={this.handleClick} value="female" disabled={this.state.gender !== 'female'}/>
                </div>
            </div>

        );
    }

    handleClick(value) {

        this.setState({
            gender: value
        });
        this.props.onClickHandler(value);
    }

}
