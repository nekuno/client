import React from 'react';
import SquareIcon from '../../../src/js/components/ui/SquareIcon/SquareIcon.js';
import styles from '../../../src/js/components/ui/SquareIcon/SquareIcon.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test SquareIcon component', () => {
    const mockFn = jest.fn();
    const squareicon = shallow(<SquareIcon onClickHandler={mockFn}>Lorem ipsum</SquareIcon>);

    it('should be defined', () => {
        expect(squareicon).toBeDefined();
    });
    it('should render correctly', () => {
        expect(squareicon).toMatchSnapshot();
    });
    it('SquareIcon click event', () => {
        squareicon.find(`.${styles.squareicon}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
