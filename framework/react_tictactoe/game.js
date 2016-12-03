class GameCell extends React.Component {
    render() {
        const value = this.props.value;
        return (<div className = {this.props.isWinner? 'cell winner':'cell'} onClick = {this.props.onClick}>{value}</div>);
    }
}
class InfoBox extends React.Component {
    render() {
        // return (<p> next move:{ this.props.isNextX?"X":"O"}</p>);
        return (<div className = 'infobox'> {this.props.info}</div>);
    }
}
class GameBox extends React.Component {
    findWinner(cells) {
        //find winner
        //result :
        //1. X----x win
        //2. O ----o win
        //3. draw --- full and draw
        //4. running --- 
        // var cells = this.state.cellValues;
        // var mod = 3;
        // 0 1 2
        // 3 4 5
        // 6 7 8
        var winTypes = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (var i = 0; i < winTypes.length; i++) {
            let type = winTypes[i];
            if (cells[type[0]] !== null && cells[type[0]] === cells[type[1]] && cells[type[0]] === cells[type[2]]) {
                var arrIsWinner = this.state.arrIsWinner.slice();
                for (var j = 0; j < type.length; j++) {
                    arrIsWinner[type[j]] = true;
                }
                this.setState({
                    arrIsWinner: arrIsWinner
                });
                return cells[type[0]];
            }
        }
        // 所有都不为空 
        if (cells.every((cell) => (cell !== null))) {
            return 'draw';
        } else {
            return 'running';
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            cellValues: new Array(9).fill(null),
            arrIsWinner: new Array(9).fill(false),
            isNextX: true,
            info: '下一步:X',
            isGameover: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.restart = this.restart.bind(this);
    }
    render() {
        var cellValues = this.state.cellValues;
        var cells = cellValues.map((value, index) => (<GameCell 
			key = {index} 
			value={value}
			isWinner = {this.state.arrIsWinner[index]}
			onClick = {()=>{this.handleClick(index)}} />));
        return (
            <div>
                <h2 className='desc'>React.js井字棋</h2>
			<InfoBox info = {this.state.info} />
			<div className = 'box'> 
			{cells} 
			</div>
			<input type = 'button' value = '重新开始' onClick = {this.restart}/>
			</div>);
    }
    restart() {
        this.setState({
            cellValues: new Array(9).fill(null),
            arrIsWinner: new Array(9).fill(false),
            isNextX: true,
            info: '下一步:X',
            isGameover: false
        });
    }
    handleClick(index) {
        //make a copy of cellValues
        if (this.state.isGameover || this.state.cellValues[index]) {
            return;
        }
        var data = this.state.cellValues.slice();
        data[index] = this.state.isNextX ? "X" : "O";
        var isNextX = !this.state.isNextX;
        this.setState({
            cellValues: data,
            isNextX: isNextX,
        })
        var winner = this.findWinner(data);
        var info = this.state.info;
        switch (winner) {
            case 'X':
            case 'O':
                info = '胜利者:' + winner;
                // 结束游戏
                this.setState({
                    isGameover: true
                });
                break;
            case 'running':
                info = '下一步:' + (isNextX ? 'X' : 'O');
                break;
            case 'draw':
                info = '平局';
                this.setState({
                    isGameover: true
                });
                break;
        }
        this.setState({
            info: info
        });
    }
}
ReactDOM.render(
    <GameBox />,
    document.getElementById('root')
);
