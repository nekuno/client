import React from 'react';
import InputNumberRange from '../../../src/js/components/ui/InputNumberRange/InputNumberRange.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test InputRange component', () => {
    const mockFn = jest.fn();
    const inputRange = shallow(<InputNumberRange minNum={8} maxNum={80} onChangeHandler={mockFn} value={[8, 11]}/>);

    it('should be defined', () => {
        expect(inputRange).toBeDefined();
    });
    it('should render correctly', () => {
        expect(inputRange).toMatchSnapshot();
    });
});
