import React, { PropTypes, Component } from 'react';

export default class Image extends Component {

    static propTypes = {
        className  : PropTypes.string,
        src        : PropTypes.string,
        defaultSrc : PropTypes.string,
        showLoading: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.onImageError = this.onImageError.bind(this);
        this.onImageLoaded = this.onImageLoaded.bind(this);

        this.state = {
            src: props.src || props.defaultSrc,
            loading: true
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.src !== nextProps.src) {
            this.setState({
                src: nextProps.src
            });
        }
    }

    onImageError() {
        if (!this.props.defaultSrc) {
            this.setState({
                src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
                loading: false
            });
        } else {
            this.setState({
                src: this.props.defaultSrc,
                loading: false
            });
        }
    }

    onImageLoaded() {
        this.setState({
            loading: false
        });
    }

    renderLoadingImage() {
        const {className} = this.props;
        const {src} = this.state;
        return <div>
            <div className="loading-gif"></div>
            <img style={{opacity: 0}} className={className ? className : ''} src={src} onError={this.onImageError} onLoad={this.onImageLoaded}/>
        </div>
    }

    renderImage() {
        const {className} = this.props;
        const {src} = this.state;
        return <img className={className ? className : ''} src={src} onError={this.onImageError} onLoad={this.onImageLoaded}/>;
    }

    render() {
        const {loading} = this.state;
        const {showLoading} = this.props;
        return (
            loading && showLoading ?
                this.renderLoadingImage()
                :
                this.renderImage()
        );
    }
}