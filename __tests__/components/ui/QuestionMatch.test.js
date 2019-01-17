import React from 'react';
import QuestionMatch from '../../../src/js/components/ui/QuestionMatch/QuestionMatch.js';
import styles from '../../../src/js/components/ui/QuestionMatch/QuestionMatch.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test QuestionMatch component', () => {
    const mockFn = jest.fn();
    const questionmatch = shallow(<QuestionMatch onClickHandler={mockFn}>Lorem ipsum</QuestionMatch>);

    it('should be defined', () => {
        expect(questionmatch).toBeDefined();
    });
    it('should render correctly', () => {
        expect(questionmatch).toMatchSnapshot();
    });
    it('QuestionMatch click event', () => {
        questionmatch.find(`.${styles.questionmatch}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
