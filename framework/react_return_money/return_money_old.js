//产生一个区间数组
//前闭后闭区间
function rangeArr(min = 0, max = 100, step = 1) {
    let arr = []
    for (var i = min; i <= max; i += step) {
        arr.push(i);
    }
    return arr;
}
class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        // this.props.date = new Date();
        this.state = {
            date: this.props.date
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        var date = new Date(this.state.date.getTime());
        switch (e.target.name) {
            case 'year':
                date.setYear(e.target.value);
                break;
            case 'month':
                date.setMonth(e.target.value - 1);
                break;
            case 'date':
                date.setDate(e.target.value);
                break;
        }
        this.setState({
            date: date
        });
        this.props.onChange(date);
        // var v = e.target.value;
        // var d = this.state.date;
        // switch (e.target.name) {
        //     case 'year':
        //         this.setState({
        //             date: new Date(v, d.getMonth(), d.getDate())
        //         });
        //         break;
        //     case 'month':
        //         this.setState({
        //             date: new Date(d.getFullYear(), v - 1, d.getDate())
        //         });
        //         break;
        //     case 'date':
        //         this.setState({
        //             date: new Date(d.getFullYear(), d.getMonth(), v)
        //         });
        //         break;
        // }
        // console.log(this.state.date.toLocaleDateString());
        // var date = new Date()
        // this.setState(date)
    }
    render() {
        var curYear = this.props.date.getFullYear(),
            curMonth = this.props.date.getMonth() + 1,
            curDate = this.props.date.getDate();
        var yearArr = rangeArr(curYear - 10, curYear + 10);
        var monthArr = rangeArr(1, 12);
        var dateArr = rangeArr(1, 31);
        return (<div className = 'date-picker'>
            <select name="year" onChange = {this.handleChange}>
            {yearArr.map((year)=>(
                <option value={year} 
                key = {year} 
                selected = {year == curYear}>
                {year}
                </option>
                ))}
            }</select>
            <select name="month" onChange = {this.handleChange}>
            {monthArr.map((month)=>(
                <option value={month} 
                key = {month} 
                selected = {month == curMonth}>
                {month}
                </option>
                ))}
            }</select>
            <select name="date" onChange = {this.handleChange}>
            {dateArr.map((date)=>(
                <option value={date} 
                key = {date} 
                selected = {date == curDate}>
                {date}
                </option>
                ))}
            }</select>
        </div>);
    }
}
class MoneyInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.props.onChange(e.target.value);
    }
    render() {
        return (<input 
                    type ='number' 
                    value = {this.props.value} 
                    onChange = {this.handleChange}
                    ></input>);
    }
}
class BorrowRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            value: 1000,
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleMoneyChange = this.handleMoneyChange.bind(this);
    }
    render() {
        return (<tr onChange = {this.props}><td><DatePicker 
            date = {this.state.date}
            onChange = {this.handleDateChange}/></td>
            <td><MoneyInput onChange={this.handleMoneyChange} value = {this.state.value}/></td></tr>);
    }
    handleDateChange(value) {
        this.setState({
            date: value
        });
        var date = value;
        var money = this.state.value;
        this.props.onChange(date, value);
        console.log(value.toLocaleString());
    }
    handleMoneyChange(value) {
        // console.log(value);
        this.setState({
            value: value
        })
        var date = this.state.date;
        var money = value;
        this.props.onChange(date, value);
        console.log(value);
    }
}
class BorrowForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleRowChange = this.handleRowChange.bind(this);
        this.state = {
                rows: [{
                    date: new Date(2016, 0, 1),
                    money: 1000
                }, {
                    date: new Date(2016, 10, 1),
                    money: 2000
                }, ]
            }
            // this.d
    }
    handleRowChange(index) {
        // this.setState
        console.log('index = %d', index);
    }
    render() {
        // if (this.refs.row1) {
        //     console.log(this.refs.row1.state.date.toLocaleString());
        // }
        return (<table className="borrow-form">
            <thead>
                <tr><td>借款时间</td><td>借入金额</td></tr>
            </thead>
            <tbody>
            {
                this.state.rows.map((item,index)=>(<BorrowRow 
                    onChange = {()=>{this.handleRowChange(index)}}
                    key ={index}
                     />))
            }


            </tbody>
            </table>);
    }
}
ReactDOM.render(<BorrowForm />, document.getElementById('root'));
