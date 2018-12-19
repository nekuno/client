import React from 'react';
import CarouselContinuous from '../../../src/js/components/ui/CarouselContinuous/CarouselContinuous.js';
import styles from '../../../src/js/components/ui/CarouselContinuous/CarouselContinuous.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test CarouselContinuous component', () => {
    const mockFn = jest.fn();
    const carouselcontinuous = shallow(<CarouselContinuous onClickHandler={mockFn}>Lorem ipsum</CarouselContinuous>);

    it('should be defined', () => {
        expect(carouselcontinuous).toBeDefined();
    });
    it('should render correctly', () => {
        expect(carouselcontinuous).toMatchSnapshot();
    });
    it('CarouselContinuous click event', () => {
        carouselcontinuous.find(`.${styles.carouselcontinuous}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
