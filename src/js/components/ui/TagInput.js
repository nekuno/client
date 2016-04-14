import React, { PropTypes, Component } from 'react';
import Chip from './Chip';

export default class TagInput extends Component {

    static propTypes = {
        tags: PropTypes.array.isRequired,
        placeholder: PropTypes.string.isRequired,
        title: PropTypes.string,
        onKeyUpHandler: PropTypes.func,
        onClickTagHandler: PropTypes.func
    };

    constructor() {
        super();

        this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
        this.onFocusHandler = this.onFocusHandler.bind(this);
    }

    componentDidMount() {
        this.refs.tagInput.focus();
    }

    render() {
        const {tags, placeholder, title} = this.props;
        return (
            <div className="tag-input-wrapper">
                <div className="tag-input-title">{title ? title : ''}</div>
                <div className="tag-input">
                    <input placeholder={placeholder} ref="tagInput" type="text" onKeyUp={this.onKeyUpHandler} onFocus={this.onFocusHandler}/>
                </div>
                <div className="tag-suggestions">
                    <ul>
                        {tags.map((tag, index) => <li key={index} className="tag-suggestion" ><Chip onClickHandler={this.onClickTagHandler.bind(this, tag)} label={tag} value={tag}/></li>)}
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

    onFocusHandler() {
        let inputElem = this.refs.tagInput;
        window.setTimeout(function () {
            inputElem.scrollIntoView();
            document.getElementsByClassName('view')[0].scrollTop -= 100;
        }, 500)
    }
}