import React from 'react';
import DateInputRange from '../../../src/js/components/ui/DateInputRange/DateInputRange.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test DateInputRange component', () => {
    const mockFn = jest.fn();
    const dateInputRange = shallow(<DateInputRange placeholder={'placeholder'} onChange={mockFn} locale={'en'}/>);

    it('should be defined', () => {
        expect(DateInputRange).toBeDefined();
    });
    it('should render correctly', () => {
        expect(dateInputRange).toMatchSnapshot();
    });
});
