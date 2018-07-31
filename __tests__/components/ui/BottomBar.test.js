import React from 'react';
import BottomBar from '../../../src/js/components/ui/BottomBar/BottomBar.js';
import styles from '../../../src/js/components/ui/BottomBar/BottomBar.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test BottomBar component', () => {
    const mockFn = jest.fn();
    const bottomBar = shallow(<BottomBar onClickHandler={mockFn}>Lorem ipsum</BottomBar>);

    it('should be defined', () => {
        expect(BottomBar).toBeDefined();
    });
    it('should render correctly', () => {
        expect(bottomBar).toMatchSnapshot();
    });
    it('BottomBar click event', () => {
        bottomBar.find(`.${styles.bottomBar}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
