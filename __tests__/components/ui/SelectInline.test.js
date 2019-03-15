import React from 'react';
import SelectInline from '../../../src/js/components/ui/SelectInline/SelectInline.js';
import styles from '../../../src/js/components/ui/SelectInline/SelectInline.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


const options = [
    {
        id: "lorem",
        text: "Lorem"
    },
    {
        id: "ipsum",
        text: "Ipsum"
    },
    {
        id: "lorem-ipsum",
        text: "Lorem ipsum"
    },
    {
        id: "sed-ut-perspiciatis",
        text: "Sed ut perspiciatis"
    }
];

describe('Test SelectInline component', () => {
    const mockFn = jest.fn();
    const selectInline = shallow(<SelectInline options={options} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(SelectInline).toBeDefined();
    });
    it('should render correctly', () => {
        expect(selectInline).toMatchSnapshot();
    });
    it('SelectInline click event', () => {
        selectInline.find(`.${styles.optionWrapper}`).first().simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
