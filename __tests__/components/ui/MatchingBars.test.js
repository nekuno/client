import React from 'react';
import MatchingBars from '../../../src/js/components/ui/MatchingBars/MatchingBars.js';
import styles from '../../../src/js/components/ui/MatchingBars/MatchingBars.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test MatchingBars component', () => {
    const mockFn = jest.fn();
    const matchingbars = shallow(<MatchingBars onClickHandler={mockFn}>Lorem ipsum</MatchingBars>);

    it('should be defined', () => {
        expect(matchingbars).toBeDefined();
    });
    it('should render correctly', () => {
        expect(matchingbars).toMatchSnapshot();
    });
    it('MatchingBars click event', () => {
        matchingbars.find(`.${styles.matchingbars}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
