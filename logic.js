class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            isErased: false
        }
        this.erase = this.erase.bind(this);
    }
    handleChange() {
        var that = this;
        setTimeout(function () {
            that.props.check(that.props.text)
        }, 300);
    }
    erase() {
        this.setState({
            isErased: true
        })
    }
    render() {
        if (this.state.isErased) {
            return false;
        } else {
            return (
                <li className="item">
                    <input type="checkbox" onChange={this.handleChange} />
                    {this.props.text}
                    <img className="clickable" src="./img/trash.png" title="Erase" onClick={this.erase} />
                </li>
            );
        }

    }
}

class CheckedItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isErased: false
        }
        this.erase = this.erase.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange() {
        var that = this;
        setTimeout(function () {
            that.props.uncheck(that.props.text)
        }, 300);
    }
    erase() {
        this.setState({
            isErased: true
        })
    }
    render() {
        if (this.state.isErased) {
            return false;
        } else {
            return (
                <li className="item">
                    <input type="checkbox" onChange={this.handleChange} />

                    {this.props.text}
                    <img className="clickable" src="./img/trash.png" title="Erase" onClick={this.erase} />
                </li>
            );
        }
    }
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            todo_list: [],
            items_checked: []
        }
        this.addItem = this.addItem.bind(this);
        this.moveToChecked = this.moveToChecked.bind(this);
        this.moveBack = this.moveBack.bind(this);
    }

    addItem() {
        var temp_todo_list = this.state.todo_list;
        temp_todo_list.push(this.inputText.value);
        this.setState({
            todo_list: temp_todo_list
        })
        this.inputText.value = "";
    }
    moveToChecked(item) {
        var temp_todo_list = this.state.todo_list;
        var temp_items_checked = this.state.items_checked;
        var item_checked = temp_todo_list.splice(temp_todo_list.indexOf(item), 1);
        temp_items_checked.push(item_checked);
        this.setState({
            todo_list: temp_todo_list,
            item_checked: temp_items_checked
        });
    }
    moveBack(item) {
        console.log("I'm inside the moveBack function ant the item is: " + item);
        var temp_todo_list = this.state.todo_list;
        var temp_items_checked = this.state.items_checked;
        var item_to_move_back = temp_items_checked.splice(temp_items_checked.indexOf(item), 1);
        temp_todo_list.push(item_to_move_back);
        this.setState({
            todo_list: temp_todo_list,
            item_checked: temp_items_checked
        });
    }
    render() {
        var todo_items = this.state.todo_list.map((item) => <TodoItem key={item} text={item} check={this.moveToChecked} />)
        var checked_items = this.state.items_checked.map((item) => <CheckedItem key={item} text={item} uncheck={this.moveBack}/>)
        return (
            <div>
                <input ref={(input) => { this.inputText = input }} type="text" />
                <button onClick={this.addItem}>Add</button>
                <div> To Do: </div>
                <ul>
                    {todo_items}
                </ul>
                <div> Checked: </div>
                <ul>
                    {checked_items}
                </ul>
            </div>
        );
    }
}
ReactDOM.render(
    <App />,
    document.getElementById("root")
);
