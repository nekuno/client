import React from 'react';
import QuestionNotMatch from '../../../src/js/components/ui/QuestionNotMatch/QuestionNotMatch.js';
import styles from '../../../src/js/components/ui/QuestionNotMatch/QuestionNotMatch.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test QuestionNotMatch component', () => {
    const mockFn = jest.fn();
    const questionNotMatch = shallow(<QuestionNotMatch onClickHandler={mockFn}>Lorem ipsum</QuestionNotMatch>);

    it('should be defined', () => {
        expect(questionNotMatch).toBeDefined();
    });
    it('should render correctly', () => {
        expect(questionNotMatch).toMatchSnapshot();
    });
    it('QuestionNotMatch click event', () => {
        questionNotMatch.find(`.${styles.questionNotMatch}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
