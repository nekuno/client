import React from 'react';
import AnswerQuestionCard from '../../../src/js/components/ui/AnswerQuestionCard/AnswerQuestionCard.js';
import styles from '../../../src/js/components/ui/AnswerQuestionCard/AnswerQuestionCard.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test AnswerQuestionCard component', () => {
    const mockFn = jest.fn();
    const answerQuestionCard = shallow(<AnswerQuestionCard onClickHandler={mockFn}>Lorem ipsum</AnswerQuestionCard>);

    it('should be defined', () => {
        expect(answerQuestionCard).toBeDefined();
    });
    it('should render correctly', () => {
        expect(answerQuestionCard).toMatchSnapshot();
    });
    it('AnswerQuestionCard click event', () => {
        answerQuestionCard.find(`.${styles.answerQuestionCard}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
