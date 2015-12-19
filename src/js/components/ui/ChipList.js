import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Chip from './Chip';
import SmallChip from './SmallChip';

export default class ChipList extends Component {
	static propTypes = {
		chips: PropTypes.array.isRequired,
		small: PropTypes.bool.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		let small = this.props.small;
		return (
			<div className={small ? 'chip-list small-chip-list' : 'chip-list'}>
				{this.props.chips.map(function(chip, index, chips) {
					let chipsLength = chips.length;
					let firstSeparator = '';
					let secondSeparator = '';

					if (index != 0) {
						firstSeparator = <span className="separator icon-circle"></span>;
					}
					if (index != chipsLength - 1) {
						secondSeparator = <span className="separator icon-circle"></span>;
					}
					if (small) {
						chip = <SmallChip label={chip.label} key={chip.id} />;
					} else {
						chip = <Chip label={chip.label} key={chip.id} />;
					}
					return <div className="chip-wrapper">
						{firstSeparator}{chip}{secondSeparator}
					</div>;
				})}
			</div>
		);
	}
}
