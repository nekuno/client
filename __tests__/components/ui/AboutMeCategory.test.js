import React from 'react';
import AboutMeCategory from '../../../src/js/components/ui/AboutMeCategory/AboutMeCategory.js';
import styles from '../../../src/js/components/ui/AboutMeCategory/AboutMeCategory.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test AboutMeCategory component', () => {
    const mockFn = jest.fn();
    const aboutmecategory = shallow(<AboutMeCategory onClickHandler={mockFn}>Lorem ipsum</AboutMeCategory>);

    it('should be defined', () => {
        expect(aboutmecategory).toBeDefined();
    });
    it('should render correctly', () => {
        expect(aboutmecategory).toMatchSnapshot();
    });
    it('AboutMeCategory click event', () => {
        aboutmecategory.find(`.${styles.aboutmecategory}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
