import React from 'react';
import ButtonOverlayBottomPage from '../../../src/js/components/ui/ButtonOverlayBottomPage/ButtonOverlayBottomPage.js';
import styles from '../../../src/js/components/ui/ButtonOverlayBottomPage/ButtonOverlayBottomPage.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test ButtonOverlayBottomPage component', () => {
    const mockFn = jest.fn();
    const buttonoverlaybottompage = shallow(<ButtonOverlayBottomPage onClickHandler={mockFn}>Lorem ipsum</ButtonOverlayBottomPage>);

    it('should be defined', () => {
        expect(buttonoverlaybottompage).toBeDefined();
    });
    it('should render correctly', () => {
        expect(buttonoverlaybottompage).toMatchSnapshot();
    });
    it('ButtonOverlayBottomPage click event', () => {
        buttonoverlaybottompage.find(`.${styles.buttonoverlaybottompage}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
