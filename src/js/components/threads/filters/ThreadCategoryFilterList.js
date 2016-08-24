import React, { PropTypes, Component } from 'react';
import InputCheckbox from '../../ui/InputCheckbox';

export default class ThreadCategoryFilterList extends Component {

    static propTypes = {
        categories             : PropTypes.array,
        filters                : PropTypes.object.isRequired,
        filtersMetadata        : PropTypes.object.isRequired,
        handleClickFilterOnList: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.renderCategory = this.renderCategory.bind(this);
        this.renderField = this.renderField.bind(this);
    }

    renderField(field) {
        const {filters, filtersMetadata, handleClickFilterOnList} = this.props;
        if (!filtersMetadata[field]) {
            return null;
        }
        let text = filtersMetadata[field].label;
        let checked = typeof filters[field] !== 'undefined';
        return <li key={field}>
            <InputCheckbox value={field} name={field} text={text} checked={checked} onClickHandler={handleClickFilterOnList} reverse={true}/>
        </li>;
    }

    renderCategory(category) {
        const choicesLength = Object.keys(category.fields).length || 0;
        return <div>
            <ul key="1" className="checkbox-filters-list">
                {category.fields.map((field, i) => {
                    if (i >= choicesLength / 2) {
                        return;
                    }
                    return this.renderField(field);
                })}
            </ul>
            <ul key="2" className="checkbox-filters-list">
                {category.fields.map((field, i) => {
                    if (i < choicesLength / 2) {
                        return;
                    }
                    return this.renderField(field);
                })}
            </ul>
        </div>
    }

    render() {
        const {categories} = this.props;
        document.getElementsByClassName('view')[0].scrollTop = 0;

        return (
            <div className="list-block">
                {categories.map(category => {
                    return <div key={category.label}>
                        <div className="profile-category"><h3>{category.label}</h3></div>
                        {this.renderCategory(category)}
                    </div>;
                })}
            </div>
        );
    }

}