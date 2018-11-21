import React from 'react';
import CandidateCard from '../../../src/js/components/ui/CandidateCard/CandidateCard.js';
import styles from '../../../src/js/components/ui/CandidateCard/CandidateCard.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test CandidateCard component', () => {
    const mockFn = jest.fn();
    const candidatecard = shallow(<CandidateCard onClickHandler={mockFn}>Lorem ipsum</CandidateCard>);

    it('should be defined', () => {
        expect(candidatecard).toBeDefined();
    });
    it('should render correctly', () => {
        expect(candidatecard).toMatchSnapshot();
    });
    it('CandidateCard click event', () => {
        candidatecard.find(`.${styles.candidatecard}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
