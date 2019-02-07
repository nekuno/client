import React from 'react';
import EditProfilePage from '../../../src/js/components/ui/EditProfilePage/EditProfilePage.js';
import styles from '../../../src/js/components/ui/EditProfilePage/EditProfilePage.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test EditProfilePage component', () => {
    const mockFn = jest.fn();
    const editprofilepage = shallow(<EditProfilePage onClickHandler={mockFn}>Lorem ipsum</EditProfilePage>);

    it('should be defined', () => {
        expect(editprofilepage).toBeDefined();
    });
    it('should render correctly', () => {
        expect(editprofilepage).toMatchSnapshot();
    });
    it('EditProfilePage click event', () => {
        editprofilepage.find(`.${styles.editprofilepage}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
