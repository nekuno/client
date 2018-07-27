import React from 'react';
import TopBar from '../../../js/components/ui/TopBar/TopBar.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test TopBar component', () => {
    const topBar = shallow(<TopBar>Lorem ipsum</TopBar>);

    it('should be defined', () => {
        expect(TopBar).toBeDefined();
    });
    it('should render correctly', () => {
        expect(topBar).toMatchSnapshot();
    });
});
