import React from 'react';
import QuestionPartialMatch from '../../../src/js/components/ui/QuestionPartialMatch/QuestionPartialMatch.js';
import styles from '../../../src/js/components/ui/QuestionPartialMatch/QuestionPartialMatch.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test QuestionPartialMatch component', () => {
    const mockFn = jest.fn();
    const questionPartialMatch = shallow(<QuestionPartialMatch onClickHandler={mockFn}>Lorem ipsum</QuestionPartialMatch>);

    it('should be defined', () => {
        expect(questionPartialMatch).toBeDefined();
    });
    it('should render correctly', () => {
        expect(questionPartialMatch).toMatchSnapshot();
    });
    it('QuestionPartialMatch click event', () => {
        questionPartialMatch.find(`.${styles.questionPartialMatch}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
