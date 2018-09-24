import React from 'react';
import DailyInputRange from '../../../src/js/components/ui/DailyInputRange/DailyInputRange.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test DailyInputRange component', () => {
    const mockFn = jest.fn();
    const dailyInputRange = shallow(<DailyInputRange data={['morning', 'night']} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(DailyInputRange).toBeDefined();
    });
    it('should render correctly', () => {
        expect(dailyInputRange).toMatchSnapshot();
    });
});
