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
        let _self = this;
        document.getElementsByClassName('view')[0].scrollTop = document.getElementsByClassName('view')[0].scrollHeight;
        window.setTimeout(function () {
            _self.refs.tagInput.focus();
        }, 500);
    }

    render() {
        return (
            <div className="tag-input-wrapper">
                <div className="tag-input">
                    <input placeholder={this.props.placeholder} ref="tagInput" type="text" onKeyUp={this.onKeyUpHandler}/>
                </div>
                <div className="tag-suggestions">
                    <ul>
                        {this.props.tags.map((tag, index) => <li key={index} className="tag-suggestion" ><Chip onClickHandler={this.onClickTagHandler.bind(this, tag)} label={tag} value={tag}/></li>)}
                    </ul>
                </div>
            </div>
        );
    }

    onKeyUpHandler() {
        this.props.onKeyUpHandler(this.refs.tagInput.value);
    }

    onClickTagHandler(tag) {
        this.refs.tagInput.value = '';
        this.props.onClickTagHandler(tag);
    }
}