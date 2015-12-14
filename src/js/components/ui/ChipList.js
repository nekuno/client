import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class ChipList extends Component {
	static propTypes = {
		chips: PropTypes.array.isRequired,
		small: PropTypes.bool.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		let small = this.props.small;
		return (
			<div className="chip-list">
				{this.props.chips.map(function(chip, index, chips) {
					let chipsLength = chips.length;
					let firstSeparator = '';
					let secondSeparator = '';

					if (index != 0) {
						firstSeparator = <span className="separator"></span>;
					}
					if (index != chipsLength - 1) {
						secondSeparator = <span className="separator"></span>;
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
