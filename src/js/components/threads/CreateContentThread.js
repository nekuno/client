import React, { PropTypes, Component } from 'react';
import TextInput from '../ui/TextInput';
import TextRadios from '../ui/TextRadios';
import TextCheckboxes from '../ui/TextCheckboxes';
import TagInput from '../ui/TagInput';
import FullWidthButton from '../ui/FullWidthButton';

export default class CreateContentThread extends Component {
    static propTypes = {
        onClickHandler: PropTypes.func.isRequired
        // TODO: tagSuggestions should be a prop
    };

    constructor(props) {
        super(props);

        this.handleClickFilter = this.handleClickFilter.bind(this);
        this.handleKeyUpTag = this.handleKeyUpTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
        this.handleClickTag = this.handleClickTag.bind(this);

        this.state = {
            filters: [],
            tags: [],
            tagSuggestions: []
        }
    }

    render() {
        return (
            <div>
                <div className="thread-filter">
                    <div className="thread-filter-dot">
                        <span className={this.state.filters.length > 0 ? "icon-circle active" : "icon-circle"}></span>
                    </div>
                    <TextCheckboxes labels={[
                        {key: 'Link', text: 'Sitios web'},
                        {key: 'Video', text: 'Videos'},
                        {key: 'Audio', text: 'Audios'},
                        {key: 'Image', text: 'Imágenes'}
                        ]} onClickHandler={this.handleClickFilter} values={this.state.filters} />
                    {this.state.filters.length > 0 ? <div className="vertical-line"></div> : ''}
                </div>
                {this.state.filters.length > 0 && this.state.tags.length > 0 ?
                    <div className="thread-filter">
                        <div className="thread-filter-dot">
                            <span className={this.state.filters.length > 0 ? "icon-circle active" : "icon-circle"}></span>
                        </div>
                        <TextCheckboxes labels={this.state.tags.map(tag => { return({key: tag, text: tag}); }) } onClickHandler={this.handleClickTag} values={this.state.tags} />
                        <div className="vertical-line"></div>
                    </div>
                    : ''}
                {this.state.filters.length > 0 ?
                    <div className="thread-filter tag-filter">
                        <div className="thread-filter-dot">
                            <span className={this.state.filters.length > 0 ? "icon-plus active" : "icon-plus"}></span>
                        </div>
                        {/* TODO: tagSuggestions should be set from props instead of state */}
                        <TagInput placeholder={'Escribe un tag'} tags={this.state.tagSuggestions}
                                  onKeyUpHandler={this.handleKeyUpTag} onClickTagHandler={this.handleClickTagSuggestion}/>
                    </div>
                    : ''}
            </div>
        );
    }

    handleClickFilter(type) {
        let filters = this.state.filters;
        let index = filters.indexOf(type);
        if (index > -1) {
            filters.splice(index, 1);
        } else {
            filters.push(type);
        }

        this.props.onClickHandler({type: filters});
        this.setState({
            filters: filters
        });
    }

    handleKeyUpTag(tag) {
        if (tag.length > 2) {
            // TODO: Call get tags action and save in store
            // TODO: Replace this example setting the tagSuggestions in getState method as props
            console.log(tag);
            this.setState({
                tagSuggestions: [tag + '1', tag + '2', tag + '3']
            });
            window.setTimeout(function () {
                document.getElementsByClassName('view')[0].scrollTop = document.getElementsByClassName('view')[0].scrollHeight;
            }, 500);
        } else if (this.state.tags.length > 0) {
            this.setState({
                tagSuggestions: []
            });
        }
    }

    handleClickTagSuggestion(tag) {
        let tags = this.state.tags;
        let index = tags.indexOf(tag);
        if (index == -1) {
            tags.push(tag);
        }
        this.setState({
            tags: tags
        });

        this.props.onClickHandler({tags: tags});
    }

    handleClickTag(tag) {
        let tags = this.state.tags;
        let index = tags.indexOf(tag);
        if (index > -1) {
            tags.splice(index, 1);
        } else {
            tags.push(tag)
        }
        this.setState({
            tags: tags
        });

        this.props.onClickHandler({tags: tags});
    }
}
