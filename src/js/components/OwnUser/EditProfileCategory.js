import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './EditProfileCategory.scss';
import FrameCollapsible from "../ui/FrameCollapsible/FrameCollapsible";

export default class EditProfileCategory extends Component {

    static propTypes = {
        onToggleCollapse: PropTypes.func,
        title           : PropTypes.string,
        fields          : PropTypes.array,
    };

    render() {
        const {fields, title} = this.props;

        return (
            <div className={styles.frame}>
                <FrameCollapsible title={title}>
                    {fields}
                </FrameCollapsible>
            </div>
        );
    }
}