import React, { PropTypes, Component } from 'react';
import Chip from './Chip';

export default class TagInput extends Component {

    static propTypes = {
        tags: PropTypes.array.isRequired,
        placeholder: PropTypes.string.isRequired,
        onKeyUpHandler: PropTypes.func,
        onClickTagHandler: PropTypes.func
    };

    constructor() {
        super();

        this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
    }

    componentDidMount() {
        this.refs.input.focus();
    }

    render() {
        return (
            <div className="tag-input-wrapper">
                <div className="tag-input">
                    <input placeholder={this.props.placeholder} ref="input" type="text" onKeyUp={this.onKeyUpHandler}/>
                </div>
                <div className="tag-suggestions">
                    <ul>
                        {this.props.tags.map((tag, index) => <li key={index} className="tag-suggestion" onClick={this.onClickTagHandler.bind(this, tag)}><Chip label={tag} value={tag}/></li>)}
                    </ul>
                </div>
            </div>
        );
    }

    onKeyUpHandler() {
        this.props.onKeyUpHandler(this.refs.input.value);
    }

    onClickTagHandler(tag) {
        this.props.onClickTagHandler(tag);
    }
}