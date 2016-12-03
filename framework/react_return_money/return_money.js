function clone(obj) {
    var copy;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}
class InterestBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            interest: {
                base: 4.35,
                ratio: 1.0,
                interest: -1
            },
            borrowArr: [{
                date: new Date(2016, 2, 1),
                value: 1000
            }, {
                date: new Date(2016, 1, 1),
                value: 2000
            }],
            borrowSum: {
                value: -1
            },
            paybackArr: [{
                date: new Date(2016, 1, 5),
                value: 500,
                days: -1,
                interest: -1.0,
                percent: -1
            }, {
                date: new Date(2016, 1, 10),
                value: 1500,
                days: -1,
                interest: -1.0,
                percent: -1
            }],
            paybackSum: {
                value: -1,
                percent: -1,
                interest: -1
            }
        };
        this.handleBaseChange = this.handleBaseChange.bind(this);
        this.handleRatioChange = this.handleRatioChange.bind(this);
    }
    render() {
        var s = this.state;
        return (<div className='interest-box'>
            <InterestSetter 
            base = {s.interest.base} 
            ratio = {s.interest.ratio} 
            interest = {s.interest.interest}
            onBaseChange = {this.handleBaseChange}
            onRatioChange = {this.handleRatioChange}/>
            <div className="test">
            <p>base = {s.interest.base}</p>
            
            <p>ratio = {s.interest.ratio}</p>
            <p>interest = {s.interest.interest}</p>
            </div>
            </div>);
    }
    handleBaseChange(value) {
        var interest = clone(this.state.interest);
        interest.base = value;
        interest.interest = value * interest.ratio;
        console.log(interest);
        this.setState({
            interest: interest
        })
    }
    handleRatioChange(value) {
        var interest = clone(this.state.interest);
        interest.ratio = value;
        interest.interest = value * interest.base;
        this.setState({
            interest: interest
        });
    }
}
class InterestSetter extends React.Component {
    constructor(props) {
        super(props);
        this.handleBaseChange = this.handleBaseChange.bind(this);
        this.handleRatioChange = this.handleRatioChange.bind(this);
    }
    render() {
        const baseInterestArr = [{
            desc: "贷款-一年以内-4.35",
            value: 4.35
        }, {
            desc: "贷款-一至五年-4.75",
            value: 4.75
        }, {
            desc: "贷款-五年以- 4.9",
            value: 4.9
        }, {
            desc: "整存整取-三个月-1.35",
            value: 1.35
        }, {
            desc: "整存整取-六个月-1.55",
            value: 1.55
        }, {
            desc: "整存整取-一年-1.75",
            value: 1.75
        }, {
            desc: "整存整取-二年-2.25",
            value: 2.25
        }, {
            desc: "整存整取-三年-2.75",
            value: 2.75
        }, {
            desc: "整存整取-五年-2.75",
            value: 2.75
        }, {
            desc: "活期存款-0.3",
            value: 0.3
        }, {
            desc: "自定义-1.0",
            value: 1.0
        }];
        return (<div className = 'interest-setter'>
        选择参考利率<select 
        name="baseInterest"
        onChange = {this.handleBaseChange}
        >
        {
           baseInterestArr.map((item,index)=>(
            <option 
            value = {item.value} 
            key = {index} 
            selected = {this.props.base == item.value}>{item.desc}</option>
           ))

        }
        </select><br />
        输入倍数<input 
        type="number" 
        value = {this.props.ratio} 
        onChange = {this.handleRatioChange}/><br/>
        最终利率 <span>{this.props.interest}</span>
         </div>)
    }
    handleBaseChange(e) {
        //基本利率变化响应函数
        this.props.onBaseChange(e.target.value);
    }
    handleRatioChange(e) {
        //利率倍数变化响应函数
        this.props.onRatioChange(e.target.value);
    }
}
class BorrowForm extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return ();
    }
}
ReactDOM.render(<InterestBox />, document.getElementById('root'));
