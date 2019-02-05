import React from 'react';
import CheckboxRounded from '../../../src/js/components/ui/CheckboxRounded/CheckboxRounded.js';
import styles from '../../../src/js/components/ui/CheckboxRounded/CheckboxRounded.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test CheckboxRounded component', () => {
    const mockFn = jest.fn();
    const checkboxrounded = shallow(<CheckboxRounded onClickHandler={mockFn}>Lorem ipsum</CheckboxRounded>);

    it('should be defined', () => {
        expect(checkboxrounded).toBeDefined();
    });
    it('should render correctly', () => {
        expect(checkboxrounded).toMatchSnapshot();
    });
    it('CheckboxRounded click event', () => {
        checkboxrounded.find(`.${styles.checkboxrounded}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
