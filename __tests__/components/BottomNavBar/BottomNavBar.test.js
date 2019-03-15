import React from 'react';
import BottomNavBar from '../../../src/js/components/BottomNavBar/BottomNavBar.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test BottomNavBar component', () => {
    const mockFn = jest.fn();
    const bottomNavBar = shallow(<BottomNavBar onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(BottomNavBar).toBeDefined();
    });
    it('should render correctly', () => {
        expect(bottomNavBar).toMatchSnapshot();
    });
});
