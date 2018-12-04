import React from 'react';
import RoundOption from '../../../src/js/components/ui/RoundOption/RoundOption.js';
import styles from '../../../src/js/components/ui/RoundOption/RoundOption.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test RoundOption component', () => {
    const mockFn = jest.fn();
    const roundoption = shallow(<RoundOption onClickHandler={mockFn}>Lorem ipsum</RoundOption>);

    it('should be defined', () => {
        expect(roundoption).toBeDefined();
    });
    it('should render correctly', () => {
        expect(roundoption).toMatchSnapshot();
    });
    it('RoundOption click event', () => {
        roundoption.find(`.${styles.roundoption}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
