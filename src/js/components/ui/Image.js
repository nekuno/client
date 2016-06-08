import React, { PropTypes, Component } from 'react';

export default class Image extends Component {

    static propTypes = {
        className : PropTypes.string,
        src       : PropTypes.string,
        defaultSrc: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.onImageError = this.onImageError.bind(this);
        
        this.state = {
            src: props.src || props.defaultSrc
        }
    }

    onImageError() {
        if (!this.props.defaultSrc) {
            this.setState({
                src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
            });
        } else {
            this.setState({
                src: this.props.defaultSrc
            });
        }
    }

    render() {
        const {className} = this.props;
        return (
            <img className={className ? className : ''} src={this.state.src} onError={this.onImageError}/>
        );
    }
}