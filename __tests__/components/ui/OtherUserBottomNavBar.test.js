import React from 'react';
import OtherUserBottomNavBar from '../../../src/js/components/ui/OtherUserBottomNavBar/OtherUserBottomNavBar.js';
import styles from '../../../src/js/components/ui/OtherUserBottomNavBar/OtherUserBottomNavBar.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test OtherUserBottomNavBar component', () => {
    const mockFn = jest.fn();
    const otheruserbottomnavbar = shallow(<OtherUserBottomNavBar onClickHandler={mockFn}>Lorem ipsum</OtherUserBottomNavBar>);

    it('should be defined', () => {
        expect(otheruserbottomnavbar).toBeDefined();
    });
    it('should render correctly', () => {
        expect(otheruserbottomnavbar).toMatchSnapshot();
    });
    it('OtherUserBottomNavBar click event', () => {
        otheruserbottomnavbar.find(`.${styles.otheruserbottomnavbar}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
