import React from 'react';
import SliderPhotos from '../../../src/js/components/ui/SliderPhotos/SliderPhotos.js';
import styles from '../../../src/js/components/ui/SliderPhotos/SliderPhotos.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test SliderPhotos component', () => {
    const mockFn = jest.fn();
    const sliderphotos = shallow(<SliderPhotos onClickHandler={mockFn}>Lorem ipsum</SliderPhotos>);

    it('should be defined', () => {
        expect(sliderphotos).toBeDefined();
    });
    it('should render correctly', () => {
        expect(sliderphotos).toMatchSnapshot();
    });
    it('SliderPhotos click event', () => {
        sliderphotos.find(`.${styles.sliderphotos}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
