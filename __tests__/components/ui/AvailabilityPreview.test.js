import React from 'react';
import AvailabilityPreview from '../../../src/js/components/ui/AvailabilityPreview/AvailabilityPreview.js';
import styles from '../../../src/js/components/ui/AvailabilityPreview/AvailabilityPreview.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test AvailabilityPreview component', () => {
    const mockFn = jest.fn();
    const availabilitypreview = shallow(<AvailabilityPreview onClickHandler={mockFn}>Lorem ipsum</AvailabilityPreview>);

    it('should be defined', () => {
        expect(availabilitypreview).toBeDefined();
    });
    it('should render correctly', () => {
        expect(availabilitypreview).toMatchSnapshot();
    });
    it('AvailabilityPreview click event', () => {
        availabilitypreview.find(`.${styles.availabilitypreview}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
