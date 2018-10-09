import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chip from '../Chip/Chip.js';
import styles from './Select.scss';

export default class Select extends Component {

    static propTypes = {
        title: PropTypes.string,
        labels: PropTypes.array.isRequired,
        values: PropTypes.array.isRequired,
        onClickHandler: PropTypes.func.isRequired
    };

    handleClick(id) {
        this.props.onClickHandler(id);
    }


    onClickOptionHandler(event) {
        const {labels} = this.props;
        const value = event.target.value;

        if (labels.some(label => value == label.id)) {
            this.props.onClickHandler(value);
        }
    }

    render() {
        const {title, labels, values} = this.props;
        const showSelect = labels.length > 40;
        return (
            <div className={styles.select}>
                {showSelect ?
                    <div className={styles.selectTag}>
                        <div className={styles.title + ' small'}>{title}</div>
                        <select onChange={this.onClickOptionHandler.bind(this)}>
                            <option key={'none'} value={''}>{}</option>
                            {labels.map(label => !values.some(value => value == label.id) ?
                                <option key={label.id} value={label.id}>{label.text}</option> : null
                            )}
                        </select>
                        {labels.map(label => values.some(value => value == label.id) ?
                            <Chip key={label.id} text={label.text} onClickHandler={this.handleClick.bind(this, label.id)}/> : null
                        )}
                    </div>
                    :
                    <div className={styles.chips}>
                        {title ? <div className={styles.title + ' small'}>{title}</div> : null}
                        {labels.map(label => <Chip key={label.id} text={label.text} onClickHandler={this.handleClick.bind(this, label.id)} selected={values.some(value => value == label.id)}/>)}
                    </div>
                }
            </div>
        );
    }
}