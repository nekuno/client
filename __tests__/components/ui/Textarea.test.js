import React from 'react';
import Textarea from '../../../src/js/components/ui/Textarea/Textarea.js';
import styles from '../../../src/js/components/ui/Textarea/Textarea.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test Textarea component', () => {
    const mockFn = jest.fn();
    const textarea = shallow(<Textarea onClickHandler={mockFn}>Lorem ipsum</Textarea>);

    it('should be defined', () => {
        expect(textarea).toBeDefined();
    });
    it('should render correctly', () => {
        expect(textarea).toMatchSnapshot();
    });
});
