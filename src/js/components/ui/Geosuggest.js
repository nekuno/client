import BaseGeosuggest from 'react-geosuggest';

class Geosuggest extends BaseGeosuggest {
    componentWillMount() {
        super.componentWillMount();
        if (this.state.userInput) {
            this.selectSuggest();
        }
    }
}

export default Geosuggest;