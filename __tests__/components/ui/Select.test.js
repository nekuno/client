import React from 'react';
import Select from '../../../src/js/components/ui/Select/Select.js';
import styles from '../../../src/js/components/ui/Select/Select.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const options = [
    {
        key: "lorem",
        text: "Lorem"
    },
    {
        key: "ipsum",
        text: "Ipsum"
    },
    {
        key: "lorem-ipsum",
        text: "Lorem ipsum"
    },
    {
        key: "sed-ut-perspiciatis",
        text: "Sed ut perspiciatis"
    }
];

describe('Test Select component', () => {
    const mockFn = jest.fn();
    const select = shallow(<Select title={'Lorem ipsum'} options={options} defaultOption={"lorem"} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(select).toBeDefined();
    });
    it('should render correctly', () => {
        expect(select).toMatchSnapshot();
    });
    // it('Select click event', () => {
    //     select.find(`.${styles.optionWrapper}`).get(0).simulate('click');
    //     expect(mockFn).toHaveBeenCalledTimes(1);
    // });
});
