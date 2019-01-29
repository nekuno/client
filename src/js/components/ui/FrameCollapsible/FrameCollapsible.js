import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Frame from '../Frame/Frame.js';
import styles from './FrameCollapsible.scss';

export default class FrameCollapsible extends Component {

    static propTypes = {
        title         : PropTypes.string,
        onToggle : PropTypes.func,
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

        this.props.onToggle();
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
                    <div className={styles.content} style={{display: open ? 'block' : 'none'}}>
                        {children}
                    </div>
                </div>
            </Frame>
        );
    }
}

FrameCollapsible.defaultProps = {
    onToggle: () => {},
};