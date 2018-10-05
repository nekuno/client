import React from 'react';
import SelectCollapsible from '../../../src/js/components/ui/SelectCollapsible/SelectCollapsible.js';
import styles from '../../../src/js/components/ui/SelectCollapsible/SelectCollapsible.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test SelectCollapsible component', () => {
    const options = [
        {
            id: 'compatibility',
            text: 'Compatibility'
        },
        {
            id: 'similarity',
            text: 'Similarity'
        },
        {
            id: 'coincidences',
            text: 'Coincidences'
        }
    ];
    const mockFn = jest.fn();
    const selectCollapsible = shallow(<SelectCollapsible selected={'compatibility'} options={options} title={'Order'} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(SelectCollapsible).toBeDefined();
    });
    it('should render correctly', () => {
        expect(selectCollapsible).toMatchSnapshot();
    });
});
