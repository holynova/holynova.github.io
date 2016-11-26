class CategoryRow extends React.Component {
	render() {
		return (<tr><th className='category' colSpan = "2">{this.props.category}</th></tr>);
	}
}
class ProductRow extends React.Component {
	render() {
		const p = this.props.product;
		var res = '';
		if (p.stocked) {
			res = (<tr><td>{p.name}</td><td>{p.price}</td></tr>);

		} else {
			res = (<tr><td>{p.name}</td><td className = 'in-stock'>{p.price}</td></tr>);

		}
		return res;
	}
}
class ProductTable extends React.Component {
	render() {
		var rows = [];
		var lastCategory = null;
		var filterText = this.props.filterText.toLowerCase();
		var onlyInStock = this.props.onlyInStock;
		this.props.products.forEach((p) => {
			//condition that the product should not be shown
			if ((p.name.toLowerCase().indexOf(filterText) == -1) || ((onlyInStock) && (!p.stocked))) {
				return;
			}
			//show the category row
			if (p.category !== lastCategory) {
				rows.push(<CategoryRow category = {p.category} key = {p.category} />);
			}
			//show the product row
			rows.push(<ProductRow product = {p} key= {p.name}/>);
			//renew the lastCategory
			lastCategory = p.category;
		})
		return (<table className = 'products-table'>
			<thead>
				<tr>
					<td>Name</td>
					<td>Price</td>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>)
	}
}
class SearchTable extends React.Component {
	constructor(props) {
		super(props);
		this.handleInput = this.handleInput.bind(this);
		this.handleCheck = this.handleCheck.bind(this);
	}
	render() {
		// const value = this.state.
		return (<div className = 'search'>
			
			input filter<input 
			type = 'text' 
			value = {this.props.filterText} 
			onChange = {this.handleInput}/>
			<br />
			<input 
			type = 'checkbox' 
			checked = {this.props.onlyInStock} 
			onChange = {this.handleCheck}/>only in stock?
</div>);
	}
	handleInput(e) {
		this.props.onUserInput(e.target.value, this.props.onlyInStock);
	}
	handleCheck(e) {
		this.props.onUserInput(this.props.filterText, e.target.checked);
	}
}
class ShoppingList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filterText: "",
			onlyInStock: true
		}
		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(filterText, onlyInStock) {
		this.setState({
			filterText: filterText,
			onlyInStock: onlyInStock,
		})

	}
	render() {
		return (<div>
			<SearchTable 
			filterText = {this.state.filterText} 
			onlyInStock = {this.state.onlyInStock}
			onUserInput = {this.handleInput} />
			<ProductTable 
		products = {PRODUCTS2}
			filterText = {this.state.filterText}
			onlyInStock = {this.state.onlyInStock}/>
		</div>);
	}
}



var PRODUCTS = [{
	category: 'Sporting Goods',
	price: '$49.99',
	stocked: true,
	name: 'Football'
}, {
	category: 'Sporting Goods',
	price: '$9.99',
	stocked: true,
	name: 'Baseball'
}, {
	category: 'Sporting Goods',
	price: '$29.99',
	stocked: false,
	name: 'Basketball'
}, {
	category: 'Electronics',
	price: '$99.99',
	stocked: true,
	name: 'iPod Touch'
}, {
	category: 'Electronics',
	price: '$399.99',
	stocked: false,
	name: 'iPhone 5'
}, {
	category: 'Electronics',
	price: '$199.99',
	stocked: true,
	name: 'Nexus 7'
}, {
	"name": "Gould",
	"stocked": false,
	"price": "66.33",
	"category": "Sports"
}, {
	"name": "Charles",
	"stocked": false,
	"price": "332.43",
	"category": "Electronic-Device"
}];


var PRODUCTS2 = [{
	"name": "Gould",
	"stocked": false,
	"price": "66.33",
	"category": "Sports"
}, {
	"name": "Charles",
	"stocked": false,
	"price": "332.43",
	"category": "Electronic-Device"
}, {
	"name": "Lena",
	"stocked": false,
	"price": "74.74",
	"category": "Toy"
}, {
	"name": "Lowery",
	"stocked": true,
	"price": "595.03",
	"category": "Toy"
}, {
	"name": "Castaneda",
	"stocked": true,
	"price": "112.49",
	"category": "baby"
}, {
	"name": "Roy",
	"stocked": false,
	"price": "915.83",
	"category": "Electronic-Device"
}, {
	"name": "Ramona",
	"stocked": true,
	"price": "47.26",
	"category": "Office"
}, {
	"name": "Mcintyre",
	"stocked": false,
	"price": "774.17",
	"category": "Toy"
}, {
	"name": "Deloris",
	"stocked": true,
	"price": "858.96",
	"category": "Sports"
}, {
	"name": "Richmond",
	"stocked": true,
	"price": "846.33",
	"category": "Office"
}, {
	"name": "Maryanne",
	"stocked": true,
	"price": "9.13",
	"category": "Electronic-Device"
}, {
	"name": "Adriana",
	"stocked": true,
	"price": "588.06",
	"category": "baby"
}, {
	"name": "Hamilton",
	"stocked": false,
	"price": "771.49",
	"category": "Electronic-Device"
}, {
	"name": "Meyer",
	"stocked": true,
	"price": "95.1",
	"category": "Sports"
}, {
	"name": "Connie",
	"stocked": true,
	"price": "359.71",
	"category": "Office"
}, {
	"name": "Ella",
	"stocked": false,
	"price": "220.02",
	"category": "Sports"
}, {
	"name": "Pierce",
	"stocked": true,
	"price": "778.76",
	"category": "Office"
}, {
	"name": "Becky",
	"stocked": true,
	"price": "127.98",
	"category": "Sports"
}, {
	"name": "Jasmine",
	"stocked": false,
	"price": "904.32",
	"category": "Toy"
}, {
	"name": "Lee",
	"stocked": false,
	"price": "353.05",
	"category": "baby"
}, {
	"name": "Swanson",
	"stocked": false,
	"price": "649.05",
	"category": "Office"
}, {
	"name": "Jones",
	"stocked": false,
	"price": "99.72",
	"category": "Electronic-Device"
}, {
	"name": "Reed",
	"stocked": false,
	"price": "27.65",
	"category": "Toy"
}, {
	"name": "Hardin",
	"stocked": false,
	"price": "815.59",
	"category": "Toy"
}, {
	"name": "Eddie",
	"stocked": true,
	"price": "945.75",
	"category": "Sports"
}, {
	"name": "Noble",
	"stocked": false,
	"price": "789.83",
	"category": "Sports"
}, {
	"name": "Everett",
	"stocked": false,
	"price": "159.14",
	"category": "Office"
}, {
	"name": "Rita",
	"stocked": true,
	"price": "242.23",
	"category": "baby"
}, {
	"name": "Kelli",
	"stocked": false,
	"price": "409.31",
	"category": "Sports"
}, {
	"name": "Erma",
	"stocked": true,
	"price": "896.85",
	"category": "Office"
}, {
	"name": "Betsy",
	"stocked": true,
	"price": "96.74",
	"category": "Electronic-Device"
}, {
	"name": "Audrey",
	"stocked": false,
	"price": "285.4",
	"category": "Electronic-Device"
}, {
	"name": "Yang",
	"stocked": false,
	"price": "297.3",
	"category": "Toy"
}, {
	"name": "Maryann",
	"stocked": false,
	"price": "723.54",
	"category": "Toy"
}, {
	"name": "Florence",
	"stocked": false,
	"price": "458.6",
	"category": "Electronic-Device"
}, {
	"name": "Carroll",
	"stocked": false,
	"price": "128.65",
	"category": "Office"
}, {
	"name": "Kaitlin",
	"stocked": false,
	"price": "158.91",
	"category": "baby"
}, {
	"name": "Dina",
	"stocked": false,
	"price": "800.66",
	"category": "Sports"
}, {
	"name": "Paul",
	"stocked": true,
	"price": "688.23",
	"category": "Electronic-Device"
}, {
	"name": "Navarro",
	"stocked": false,
	"price": "98.33",
	"category": "baby"
}, {
	"name": "Mildred",
	"stocked": false,
	"price": "277.21",
	"category": "Sports"
}, {
	"name": "Melton",
	"stocked": false,
	"price": "657.61",
	"category": "Toy"
}, {
	"name": "Corinne",
	"stocked": false,
	"price": "672.09",
	"category": "Electronic-Device"
}, {
	"name": "Tia",
	"stocked": true,
	"price": "30.09",
	"category": "Sports"
}, {
	"name": "Stefanie",
	"stocked": true,
	"price": "258.67",
	"category": "Toy"
}, {
	"name": "Gomez",
	"stocked": true,
	"price": "79.78",
	"category": "baby"
}, {
	"name": "Christian",
	"stocked": true,
	"price": "943.95",
	"category": "Office"
}, {
	"name": "Jeanine",
	"stocked": true,
	"price": "372.64",
	"category": "baby"
}, {
	"name": "Bass",
	"stocked": true,
	"price": "268.71",
	"category": "Sports"
}, {
	"name": "Harding",
	"stocked": true,
	"price": "345.5",
	"category": "baby"
}, {
	"name": "Janelle",
	"stocked": false,
	"price": "957.61",
	"category": "baby"
}, {
	"name": "Leticia",
	"stocked": true,
	"price": "709.25",
	"category": "Electronic-Device"
}, {
	"name": "King",
	"stocked": true,
	"price": "766.81",
	"category": "Electronic-Device"
}, {
	"name": "Foster",
	"stocked": true,
	"price": "362.04",
	"category": "Toy"
}, {
	"name": "Kaye",
	"stocked": false,
	"price": "378.94",
	"category": "Office"
}, {
	"name": "Esther",
	"stocked": true,
	"price": "663.72",
	"category": "Office"
}, {
	"name": "Pace",
	"stocked": false,
	"price": "856.95",
	"category": "baby"
}, {
	"name": "Browning",
	"stocked": true,
	"price": "89.03",
	"category": "Toy"
}, {
	"name": "Conrad",
	"stocked": true,
	"price": "550.87",
	"category": "Electronic-Device"
}, {
	"name": "Abbott",
	"stocked": true,
	"price": "161.92",
	"category": "Toy"
}, {
	"name": "Rice",
	"stocked": true,
	"price": "798.56",
	"category": "Electronic-Device"
}, {
	"name": "Jensen",
	"stocked": true,
	"price": "736.57",
	"category": "Toy"
}, {
	"name": "Louella",
	"stocked": false,
	"price": "558.85",
	"category": "Office"
}, {
	"name": "Castillo",
	"stocked": false,
	"price": "539.96",
	"category": "Electronic-Device"
}, {
	"name": "Shanna",
	"stocked": true,
	"price": "55.66",
	"category": "Sports"
}, {
	"name": "Riddle",
	"stocked": false,
	"price": "388.92",
	"category": "Electronic-Device"
}, {
	"name": "Lott",
	"stocked": false,
	"price": "758.82",
	"category": "Electronic-Device"
}, {
	"name": "Heather",
	"stocked": false,
	"price": "58.74",
	"category": "Sports"
}, {
	"name": "Howe",
	"stocked": false,
	"price": "346.36",
	"category": "Sports"
}, {
	"name": "Isabelle",
	"stocked": true,
	"price": "22.48",
	"category": "Sports"
}, {
	"name": "Sanchez",
	"stocked": false,
	"price": "506.16",
	"category": "Electronic-Device"
}, {
	"name": "Kennedy",
	"stocked": false,
	"price": "91.46",
	"category": "baby"
}, {
	"name": "Glass",
	"stocked": true,
	"price": "245.23",
	"category": "Sports"
}, {
	"name": "Angela",
	"stocked": true,
	"price": "445.69",
	"category": "Electronic-Device"
}, {
	"name": "Travis",
	"stocked": true,
	"price": "451.24",
	"category": "Toy"
}, {
	"name": "Stephanie",
	"stocked": false,
	"price": "747.07",
	"category": "Office"
}, {
	"name": "Eugenia",
	"stocked": false,
	"price": "154.06",
	"category": "Electronic-Device"
}, {
	"name": "Mcneil",
	"stocked": true,
	"price": "964.26",
	"category": "Electronic-Device"
}, {
	"name": "Marietta",
	"stocked": false,
	"price": "977.68",
	"category": "Sports"
}, {
	"name": "Saunders",
	"stocked": true,
	"price": "804.18",
	"category": "Electronic-Device"
}, {
	"name": "Nita",
	"stocked": true,
	"price": "108.63",
	"category": "Electronic-Device"
}, {
	"name": "Moses",
	"stocked": true,
	"price": 103,
	"category": "Electronic-Device"
}, {
	"name": "Summer",
	"stocked": true,
	"price": "668.59",
	"category": "Toy"
}, {
	"name": "Luna",
	"stocked": true,
	"price": "306.61",
	"category": "Office"
}, {
	"name": "Buck",
	"stocked": true,
	"price": "96.3",
	"category": "Sports"
}, {
	"name": "Elisabeth",
	"stocked": true,
	"price": "283.42",
	"category": "Sports"
}, {
	"name": "Opal",
	"stocked": true,
	"price": "101.53",
	"category": "Sports"
}, {
	"name": "Jodi",
	"stocked": true,
	"price": "185.49",
	"category": "Electronic-Device"
}, {
	"name": "Trudy",
	"stocked": false,
	"price": "922.28",
	"category": "baby"
}, {
	"name": "Robertson",
	"stocked": false,
	"price": "334.13",
	"category": "Electronic-Device"
}, {
	"name": "Lesley",
	"stocked": true,
	"price": "404.93",
	"category": "baby"
}];

ReactDOM.render(
	<ShoppingList />,
	document.getElementById('root')
);