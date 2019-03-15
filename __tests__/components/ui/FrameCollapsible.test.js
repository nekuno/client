import React from 'react';
import FrameCollapsible from '../../../src/js/components/ui/FrameCollapsible/FrameCollapsible.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test FrameCollapsible component', () => {
    const frameCollapsible = shallow(<FrameCollapsible title={'Title'}>Lorem ipsum</FrameCollapsible>);

    it('should be defined', () => {
        expect(FrameCollapsible).toBeDefined();
    });
    it('should render correctly', () => {
        expect(frameCollapsible).toMatchSnapshot();
    });
});
