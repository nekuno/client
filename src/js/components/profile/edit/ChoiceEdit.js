/** TODO : Not used yet but useful for editing profile **/
import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import TextRadios from '../../ui/TextRadios';

export default class ChoiceEdit extends Component {
    static propTypes = {
        editKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.string.isRequired,
        handleClickRemoveEdit: PropTypes.func.isRequired,
        handleChangeEdit: PropTypes.func.isRequired,
        handleClickEdit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickChoice = this.handleClickChoice.bind(this);
    }

    handleClickChoice(choice) {
        let {editKey, data} = this.props;
        if (choice !== data) {
            this.props.handleChangeEdit(editKey, choice);
        }
    }

    render() {
        const {editKey, selected, metadata, data, handleClickRemoveEdit, handleClickEdit} = this.props;
        return(
            selected ?
                <SelectedEdit key={'selected-filter'} type={'radio'} active={data ? true : false} handleClickRemoveEdit={handleClickRemoveEdit}>
                    <TextRadios labels={Object.keys(metadata.choices).map(key => { return({key: key, text: metadata.choices[key]}); }) }
                                onClickHandler={this.handleClickChoice} value={data} className={'choice-filter'}
                                title={metadata.label} />
                </SelectedEdit>
                :
                <UnselectedEdit key={editKey} editKey={editKey} metadata={metadata} data={data} handleClickEdit={handleClickEdit} />
        );
    }
}