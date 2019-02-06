import React from 'react';
import IconCollapsible from '../../../src/js/components/ui/IconCollapsible/IconCollapsible.js';
import styles from '../../../src/js/components/ui/IconCollapsible/IconCollapsible.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test IconCollapsible component', () => {
    const mockFn = jest.fn();
    const iconcollapsible = shallow(<IconCollapsible onClickHandler={mockFn}>Lorem ipsum</IconCollapsible>);

    it('should be defined', () => {
        expect(iconcollapsible).toBeDefined();
    });
    it('should render correctly', () => {
        expect(iconcollapsible).toMatchSnapshot();
    });
    it('IconCollapsible click event', () => {
        iconcollapsible.find(`.${styles.iconcollapsible}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
