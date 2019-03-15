import React from 'react';
import NetworkInformation from '../../../src/js/components/ui/NetworkInformation/NetworkInformation.js';
import styles from '../../../src/js/components/ui/NetworkInformation/NetworkInformation.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test NetworkInformation component', () => {
    const mockFn = jest.fn();
    const networkinformation = shallow(<NetworkInformation onClickHandler={mockFn}>Lorem ipsum</NetworkInformation>);

    it('should be defined', () => {
        expect(networkinformation).toBeDefined();
    });
    it('should render correctly', () => {
        expect(networkinformation).toMatchSnapshot();
    });
    it('NetworkInformation click event', () => {
        networkinformation.find(`.${styles.networkinformation}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
