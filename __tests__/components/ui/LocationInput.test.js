import React from 'react';
import LocationInput from '../../../src/js/components/ui/LocationInput/LocationInput.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test LocationInput component', () => {
    const mockFn = jest.fn();
    const locationInput = shallow(<LocationInput title={'Lorem ipsum'} placeholder={'Write a location'} onSuggestSelect={mockFn}/>);

    it('should be defined', () => {
        expect(locationInput).toBeDefined();
    });
    it('should render correctly', () => {
        expect(locationInput).toMatchSnapshot();
    });
});
