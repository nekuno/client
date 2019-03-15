import React from 'react';
import LoadingGif from '../../../src/js/components/ui/LoadingGif/LoadingGif.js';
import styles from '../../../src/js/components/ui/LoadingGif/LoadingGif.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test LoadingGif component', () => {
    const mockFn = jest.fn();
    const loadinggif = shallow(<LoadingGif onClickHandler={mockFn}>Lorem ipsum</LoadingGif>);

    it('should be defined', () => {
        expect(loadinggif).toBeDefined();
    });
    it('should render correctly', () => {
        expect(loadinggif).toMatchSnapshot();
    });
    it('LoadingGif click event', () => {
        loadinggif.find(`.${styles.loadinggif}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
