import React from 'react';
import AvailabilityEdit from '../../../src/js/components/Availability/AvailabilityEdit/AvailabilityEdit.js';
import styles from '../../../src/js/components/Availability/AvailabilityEdit/AvailabilityEdit.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test AvailabilityEdit component', () => {
    const mockFn = jest.fn();
    const availabilityEdit = shallow(<AvailabilityEdit onSave={mockFn}/>);

    it('should be defined', () => {
        expect(availabilityEdit).toBeDefined();
    });
    it('should render correctly', () => {
        expect(availabilityEdit).toMatchSnapshot();
    });
    // it('AvailabilityEdit click event', () => {
    //     availabilityEdit.find(`.${styles.availabilityEdit}`).simulate('click');
    //     expect(mockFn).toHaveBeenCalledTimes(1);
    // });
});
