class MyDate extends React.Component {
	render() {
		const date = new Date();
		return <h1> hello world {date.toLocaleTimeString()}</h1>

	}
}
class MyForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 'tom'
		};
		this.handleChange = this.handleChange.bind(this);
	}
	render() {
		const value = this.state.value;
		return (<form>
			<p>input your name:</p>
			<input type = 'text' value={value} onChange = {this.handleChange} />
			<h3> Dear <span>{value}</span> welcome back.</h3>
		</form>);

	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}
}


ReactDOM.render(
	<MyForm />,
	document.getElementById('root')
);