/** TODO : Not used yet but useful for editing profile **/
import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import TextRadios from '../../ui/TextRadios';

export default class DoubleChoiceEdit extends Component {
    static propTypes = {
        editKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        handleClickRemoveEdit: PropTypes.func.isRequired,
        handleChangeEdit: PropTypes.func.isRequired,
        handleChangeEditDetail: PropTypes.func.isRequired,
        handleClickEdit: PropTypes.func.isRequired
    };
    
    constructor(props) {
        super(props);

        this.handleClickDoubleChoiceDetail = this.handleClickDoubleChoiceDetail.bind(this);
        this.handleClickDoubleChoiceChoice = this.handleClickDoubleChoiceChoice.bind(this);
    }

    handleClickDoubleChoiceChoice(choice) {
        let {editKey, data} = this.props;
        if (choice !== data.choice) {
            data.choice = choice;
            data.detail = null;
        }
        this.props.handleChangeEdit(editKey, data);
    }

    handleClickDoubleChoiceDetail(detail) {
        let {editKey, data} = this.props;
        if (detail !== data.detail) {
            data.detail = detail;
        }
        this.props.handleChangeEditDetail(editKey, data);
    }

    render() {
        const {editKey, selected, metadata, data, handleClickRemoveEdit, handleClickEdit} = this.props;
        return(
            selected ?
                <SelectedEdit key={'selected-filter'} type={'radio'} active={data.choice ? true : false} handleClickRemoveEdit={handleClickRemoveEdit}>
                    <div className="double-choice-filter">
                        <TextRadios labels={Object.keys(metadata.choices).map(choice => { return({key: choice, text: metadata.choices[choice]}); }) }
                                    onClickHandler={this.handleClickDoubleChoiceChoice} value={data.choice} className={'double-choice-choice'}
                                    title={metadata.label} />
                        {data.choice ? <div className="table-row"></div> : ''}
                        {data.choice ?
                            <TextRadios labels={Object.keys(metadata.doubleChoices[data.choice]).map(doubleChoice => { return({key: doubleChoice, text: metadata.doubleChoices[data.choice][doubleChoice]}); }) }
                                        onClickHandler={this.handleClickDoubleChoiceDetail} value={data.detail} className={'double-choice-detail'}/>
                            : ''}
                    </div>
                </SelectedEdit>
                    :
                <UnselectedEdit key={editKey} editKey={editKey} metadata={metadata} data={data} handleClickEdit={handleClickEdit} />
        );
    }
}