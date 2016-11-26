class GameCell extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const value = this.props.value;
		return (<div className = 'cell'>{value}</div>);
	}
}

class GameBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cellData: [1, 2, 0, 0, 0, 0, 0, 0, 0],
		};

	}

	render() {
		var cellData = this.state.cellData;
		var cells = cellData.map((value, index) => (<GameCell  key = {index} value={value}/>));
		return (<div className = 'box'>
		{cells}
		</div>);

	}
}

ReactDOM.render(
	<GameBox />,
	document.getElementById('root')
);