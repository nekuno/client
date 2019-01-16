import React from 'react';
import OwnUserBottomNavBar from '../../../src/js/components/ui/OwnUserBottomNavBar/OwnUserBottomNavBar.js';
import styles from '../../../src/js/components/ui/OwnUserBottomNavBar/OwnUserBottomNavBar.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test OwnUserBottomNavBar component', () => {
    const mockFn = jest.fn();
    const ownuserbottomnavbar = shallow(<OwnUserBottomNavBar onClickHandler={mockFn}>Lorem ipsum</OwnUserBottomNavBar>);

    it('should be defined', () => {
        expect(ownuserbottomnavbar).toBeDefined();
    });
    it('should render correctly', () => {
        expect(ownuserbottomnavbar).toMatchSnapshot();
    });
    it('OwnUserBottomNavBar click event', () => {
        ownuserbottomnavbar.find(`.${styles.ownuserbottomnavbar}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
