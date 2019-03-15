import React from 'react';
import ProposalFilterPreview from '../../../src/js/components/ui/ProposalFilterPreview/ProposalFilterPreview.js';
import styles from '../../../src/js/components/ui/ProposalFilterPreview/ProposalFilterPreview.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test ProposalFilterPreview component', () => {
    const mockFn = jest.fn();
    const availabilitypreview = shallow(<ProposalFilterPreview onClickHandler={mockFn}>Lorem ipsum</ProposalFilterPreview>);

    it('should be defined', () => {
        expect(availabilitypreview).toBeDefined();
    });
    it('should render correctly', () => {
        expect(availabilitypreview).toMatchSnapshot();
    });
});
