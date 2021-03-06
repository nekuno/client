import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InputCheckbox from '../../ui/InputCheckbox';

export default class ThreadFilterList extends Component {

    static propTypes = {
        categories             : PropTypes.array,
        filters                : PropTypes.object.isRequired,
        filtersMetadata        : PropTypes.object.isRequired,
        handleClickFilterOnList: PropTypes.func.isRequired
    };

    render() {
        const {filters, filtersMetadata, handleClickFilterOnList} = this.props;
        const choicesLength = Object.keys(filtersMetadata).length || 0;
        let firstColumnCounter = 0;
        let secondColumnCounter = 0;
        document.getElementsByClassName('view')[0].scrollTop = 0;
        return (
            <div className="list-block">
                <ul className="checkbox-filters-list">
                    {Object.keys(filtersMetadata).map(key => {
                        firstColumnCounter++;
                        if (firstColumnCounter > (choicesLength / 2) + 1) {
                            return '';
                        }
                        let text = filtersMetadata[key].label;
                        let checked = typeof filters[key] !== 'undefined';
                        return (
                            <li key={key}>
                                <InputCheckbox value={key} text={text} checked={checked} onClickHandler={handleClickFilterOnList} reverse={true}/>
                            </li>
                        )
                    })}
                </ul>
                <ul className="checkbox-filters-list">
                    {Object.keys(filtersMetadata).map(key => {
                        secondColumnCounter++;
                        if (secondColumnCounter <= (choicesLength / 2) + 1) {
                            return '';
                        }
                        let text = filtersMetadata[key].label;
                        let checked = typeof filters[key] !== 'undefined';
                        return (
                            <li key={key}>
                                <InputCheckbox value={key} text={text} checked={checked} onClickHandler={handleClickFilterOnList} reverse={true}/>
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }

}