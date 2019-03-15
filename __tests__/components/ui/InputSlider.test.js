import React from 'react';
import InputSlider from '../../../src/js/components/ui/InputSlider/InputSlider.js';
import styles from '../../../src/js/components/ui/InputSlider/InputSlider.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test InputSlider component', () => {
    const mockFn = jest.fn();
    const inputslider = shallow(<InputSlider handleChangeInputSlider={mockFn}>Lorem ipsum</InputSlider>);

    it('should be defined', () => {
        expect(inputslider).toBeDefined();
    });
    it('should render correctly', () => {
        expect(inputslider).toMatchSnapshot();
    });
});
