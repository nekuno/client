import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class MultipleChoicesEdit extends Component {
    static propTypes = {
        editKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.array,
        handleClickRemoveEdit: PropTypes.func.isRequired,
        handleChangeEdit: PropTypes.func.isRequired,
        handleClickEdit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickMultipleChoice = this.handleClickMultipleChoice.bind(this);
    }
    
    handleClickMultipleChoice(choice) {
        let {editKey, data} = this.props;
        data = data || [];
        const valueIndex = data.findIndex(value => value == choice);
        if (valueIndex > -1) {
            data.splice(valueIndex, 1);
        } else {
            data.push(choice);
        }
        this.props.handleChangeEdit(editKey, data);
    }

    render() {
        const {editKey, selected, metadata, data, handleClickRemoveEdit, handleClickEdit} = this.props;
        return(
            selected ?
                <SelectedEdit key={'selected-filter'} type={'checkbox'} active={data && data.length > 0} handleClickRemoveEdit={handleClickRemoveEdit}>
                    <TextCheckboxes labels={Object.keys(metadata.choices).map(key => { return({key: key, text: metadata.choices[key]}) })}
                                    onClickHandler={this.handleClickMultipleChoice} values={data || []} className={'multiple-choice-filter'}
                                    title={metadata.label} />
                </SelectedEdit>
                    :
                <UnselectedEdit key={editKey} editKey={editKey} metadata={metadata} data={data} handleClickEdit={handleClickEdit} />
        );
    }
}