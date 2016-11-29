class GameCell extends React.Component {
	constructor(props) {
		super(props);

	}
	render() {
		const value = this.props.value;
		return (<div className = 'cell' onClick = {this.props.onClick}>{value}</div>);
	}
}
class InfoBox extends React.Component {
	render() {

		return (<p> next move:{ this.props.isNextX?"X":"O"}</p>);
	}
}
class GameBox extends React.Component {
	findWinner() {
		//find winner
		//
		var cells = this.state.cellData;
		var mod = 3;
		0 1 2
		3 4 5
		6 7 8
		var len = cells.length;

		for (var row = 0; row < len / mod; row++) {
			for (var j = 0; j < len / mod; j++) {

			}
		}
	}
	constructor(props) {
		super(props);
		this.state = {
			cellData: new Array(9).fill(null),
			isNextX: true
		};
		this.handleClick = this.handleClick.bind(this);
	}


	render() {
		var cellData = this.state.cellData;
		var cells = cellData.map((value, index) => (<GameCell 
			key = {index} 
			value={value}
			onClick = {()=>{this.handleClick(index)}} />));
		return (
			<div>
			<InfoBox isNextX = {this.state.isNextX}/>
			<div className = 'box'> 
			{cells} 
			</div>
			</div>);
	}
	handleClick(index) {
		//make a copy of cellData
		var data = this.state.cellData.slice();
		data[index] = this.state.isNextX ? "X" : "O";
		var isNextX = this.state.isNextX;
		this.setState({
			cellData: data,
			isNextX: !isNextX
		})
	}

}

ReactDOM.render(
	<GameBox />,
	document.getElementById('root')
);