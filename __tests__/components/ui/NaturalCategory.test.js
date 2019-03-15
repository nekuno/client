import React from 'react';
import NaturalCategory from '../../../src/js/components/ui/NaturalCategory/NaturalCategory.js';
import styles from '../../../src/js/components/ui/NaturalCategory/NaturalCategory.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test NaturalCategory component', () => {
    const mockFn = jest.fn();
    const naturalcategory = shallow(<NaturalCategory onClickHandler={mockFn}>Lorem ipsum</NaturalCategory>);

    it('should be defined', () => {
        expect(naturalcategory).toBeDefined();
    });
    it('should render correctly', () => {
        expect(naturalcategory).toMatchSnapshot();
    });
    it('NaturalCategory click event', () => {
        naturalcategory.find(`.${styles.naturalcategory}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
