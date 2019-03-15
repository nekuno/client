import React from 'react';
import EditProfileCategory from '../../../src/js/components/ui/EditProfileCategory/EditProfileCategory.js';
import styles from '../../../src/js/components/ui/EditProfileCategory/EditProfileCategory.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test EditProfileCategory component', () => {
    const mockFn = jest.fn();
    const editprofilecategory = shallow(<EditProfileCategory onClickHandler={mockFn}>Lorem ipsum</EditProfileCategory>);

    it('should be defined', () => {
        expect(editprofilecategory).toBeDefined();
    });
    it('should render correctly', () => {
        expect(editprofilecategory).toMatchSnapshot();
    });
    it('EditProfileCategory click event', () => {
        editprofilecategory.find(`.${styles.editprofilecategory}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
