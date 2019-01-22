import React from 'react';
import NetworkLine from '../../../src/js/components/ui/NetworkLine/NetworkLine.js';
import styles from '../../../src/js/components/ui/NetworkLine/NetworkLine.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test NetworkLine component', () => {
    const mockFn = jest.fn();
    const networkline = shallow(<NetworkLine onClickHandler={mockFn}>Lorem ipsum</NetworkLine>);

    it('should be defined', () => {
        expect(networkline).toBeDefined();
    });
    it('should render correctly', () => {
        expect(networkline).toMatchSnapshot();
    });
    it('NetworkLine click event', () => {
        networkline.find(`.${styles.networkline}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
