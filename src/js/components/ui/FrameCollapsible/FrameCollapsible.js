import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Frame from '../Frame/Frame.js';
import styles from './FrameCollapsible.scss';

export default class FrameCollapsible extends Component {

    static propTypes = {
        title         : PropTypes.string
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            open: false
        };
    }

    handleClick() {
        const {open} = this.state;

        this.setState({open: !open});
    }

    render() {
        const {title, children} = this.props;
        const {open} = this.state;

        return (
            <Frame>
                <div className={styles.frameCollapsible}>
                    <div className={styles.frameTop} onClick={this.handleClick}>
                        <div className={styles.title}>
                            {title}
                        </div>
                        <div className={styles.arrow}>
                            {open ?
                                <div className={styles.arrow + ' icon icon-chevron-up'}/>
                                :
                                <div className={styles.arrow + ' icon icon-chevron-down'}/>
                            }
                        </div>
                    </div>
                    {open ?
                        <div className={styles.content}>
                            {children}
                        </div>
                        : null
                    }
                </div>
            </Frame>
        );
    }
}