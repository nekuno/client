import React from 'react';
import Frame from '../../../src/js/components/ui/Frame/Frame.js';
import styles from '../../../src/js/components/ui/Frame/Frame.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test Frame component', () => {
    const mockFn = jest.fn();
    const frame = shallow(<Frame onClickHandler={mockFn}>Lorem ipsum</Frame>);
    const frameWithTitle = shallow(<Frame onClickHandler={mockFn} title="Lorem ipsum">Lorem ipsum</Frame>);

    it('should be defined', () => {
        expect(Frame).toBeDefined();
    });
    it('should render correctly', () => {
        expect(frame).toMatchSnapshot();
        expect(frameWithTitle).toMatchSnapshot();
    });
    it('Frame click event', () => {
        frame.find(`.${styles.frame}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
        frameWithTitle.find(`.${styles.frame}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(2);
    });
});
