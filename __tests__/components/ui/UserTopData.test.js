import React from 'react';
import UserTopData from '../../../src/js/components/ui/UserTopData/UserTopData.js';
import styles from '../../../src/js/components/ui/UserTopData/UserTopData.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test UserTopData component', () => {
    const mockFn = jest.fn();
    const usertopdata = shallow(<UserTopData onClickHandler={mockFn}>Lorem ipsum</UserTopData>);

    it('should be defined', () => {
        expect(usertopdata).toBeDefined();
    });
    it('should render correctly', () => {
        expect(usertopdata).toMatchSnapshot();
    });
    it('UserTopData click event', () => {
        usertopdata.find(`.${styles.usertopdata}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
