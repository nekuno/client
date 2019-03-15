import React from 'react';
import InputNumber from '../../../src/js/components/ui/InputNumber/InputNumber.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test InputNumber component', () => {
    const mockFn = jest.fn();
    const inputNumber = shallow(<InputNumber placeholder={'Placeholder'} defaultValue={'Default value'} minNum={8} maxNum={80} onChange={mockFn}/>);

    it('should be defined', () => {
        expect(inputNumber).toBeDefined();
    });
    it('should render correctly', () => {
        expect(inputNumber).toMatchSnapshot();
    });
});
