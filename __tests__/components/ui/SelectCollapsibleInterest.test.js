import React from 'react';
import SelectCollapsibleInterest from '../../../src/js/components/ui/SelectCollapsibleInterest/SelectCollapsibleInterest.js';
import styles from '../../../src/js/components/ui/SelectCollapsibleInterest/SelectCollapsibleInterest.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test SelectCollapsibleInterest component', () => {
    const mockFn = jest.fn();
    const selectcollapsibleinterest = shallow(<SelectCollapsibleInterest onClickHandler={mockFn}>Lorem ipsum</SelectCollapsibleInterest>);

    it('should be defined', () => {
        expect(selectcollapsibleinterest).toBeDefined();
    });
    it('should render correctly', () => {
        expect(selectcollapsibleinterest).toMatchSnapshot();
    });
    it('SelectCollapsibleInterest click event', () => {
        selectcollapsibleinterest.find(`.${styles.selectcollapsibleinterest}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
