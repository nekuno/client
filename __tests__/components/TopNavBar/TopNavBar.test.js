import React from 'react';
import TopNavBar from '../../../src/js/components/TopNavBar/TopNavBar.js';
import styles from '../../../src/js/components/TopNavBar/TopNavBar.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test TopNavBar component', () => {
    const leftClickMockFn = jest.fn();
    const rightClickMockFn = jest.fn();
    const context = { router: { getCurrentLocation: () => ({pathname: 'foo'}) } };
    const topNavBar = shallow(
        <TopNavBar leftIcon={'left-arrow'}
                   onLeftLinkClickHandler={leftClickMockFn}
                   textCenter={'Foo'}
                   firstIconRight={'delete'}
                   onRightLinkClickHandler={rightClickMockFn}
        />, {context}
    );

    it('should be defined', () => {
        expect(TopNavBar).toBeDefined();
    });
    it('should render correctly', () => {
        expect(topNavBar).toMatchSnapshot();
    });
    it('TopNavBar left click event', () => {
        topNavBar.find(`.${styles.left}`).simulate('click');
        expect(leftClickMockFn).toHaveBeenCalledTimes(1);
    });
    it('TopNavBar right click event', () => {
        topNavBar.find(`.${styles.right}` + ' ' + `.${styles.icon}`).simulate('click');
        expect(rightClickMockFn).toHaveBeenCalledTimes(1);
    });
});
