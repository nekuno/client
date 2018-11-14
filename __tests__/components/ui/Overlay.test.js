import React from 'react';
import Overlay from '../../../src/js/components/ui/Overlay/Overlay.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test Overlay component', () => {
    const overlay = shallow(<Overlay/>);

    it('should be defined', () => {
        expect(Overlay).toBeDefined();
    });
    it('should render correctly', () => {
        expect(overlay).toMatchSnapshot();
    });
});
