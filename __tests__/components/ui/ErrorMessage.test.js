import React from 'react';
import ErrorMessage from '../../../src/js/components/ui/ErrorMessage/ErrorMessage.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test ErrorMessage component', () => {
    const errorMessage = shallow(<ErrorMessage text={'Lorem ipsum'}/>);

    it('should be defined', () => {
        expect(ErrorMessage).toBeDefined();
    });
    it('should render correctly', () => {
        expect(errorMessage).toMatchSnapshot();
    });
});
