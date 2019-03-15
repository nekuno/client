import React from 'react';
import CheckboxSquare from '../../../src/js/components/ui/CheckboxSquare/CheckboxSquare.js';
import styles from '../../../src/js/components/ui/CheckboxSquare/CheckboxSquare.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test CheckboxSquare component', () => {
    const mockFn = jest.fn();
    const checkboxsquare = shallow(<CheckboxSquare onClickHandler={mockFn}>Lorem ipsum</CheckboxSquare>);

    it('should be defined', () => {
        expect(checkboxsquare).toBeDefined();
    });
    it('should render correctly', () => {
        expect(checkboxsquare).toMatchSnapshot();
    });
    it('CheckboxSquare click event', () => {
        checkboxsquare.find(`.${styles.checkboxsquare}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
