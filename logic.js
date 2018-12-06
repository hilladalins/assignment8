

class Header extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="header">
                <img className="logo" src="./img/logo.png" />
                <span className="app-name">MyChecklist <img src="./img/check-mark.png" /></span>
            </div>
        )
    }
}

class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isErased: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.star = this.star.bind(this);
        this.handleErase = this.handleErase.bind(this);
    }
    handleChange() {
        var that = this;
        setTimeout(function () {
            that.props.check(that.props.text)
        }, 300);
    }
    star() {
        var that = this;
        setTimeout(function () {
            that.props.star(that.props.text)
        }, 200);
    }
    handleErase() {
        this.props.erase(this.props.text);
    }
    render() {
        var starImg = this.props.isStar ? "./img/fullstar.png" : "./img/star.png"
        if (this.state.isErased) {
            return false;
        } else {
            return (
                <li className="item">
                    <label>
                        <input type="checkbox" className="check" onChange={this.handleChange} />
                        {this.props.text}
                    </label>
                    <span>
                        <img className="clickable" ref={(img) => { this.starImg = img }} src={starImg} title="Mark as Important" onClick={this.star} />
                        <img className="clickable" src="./img/trash.png" title="Erase" onClick={this.handleErase} />
                    </span>
                </li>
            );
        }

    }
}

class CheckedItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isErased: false,
            isChecked: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleErase = this.handleErase.bind(this);
    }
    handleChange() {
        var that = this;
        setTimeout(function () {
            that.props.uncheck(that.props.text)
        }, 300);
    }
    handleErase() {
        this.props.erase(this.props.text);
    }
    render() {
        if (this.state.isErased) {
            return false;
        } else {
            return (
                <li className="item">
                    <label>
                        <input type="checkbox" onChange={this.handleChange} />
                        {this.props.text}
                    </label>
                    <img className="clickable" src="./img/trash.png" title="Erase" onClick={this.handleErase} />
                </li>
            );
        }
    }
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            todo_list: LocalStorageUtility.getList("todo_list"),
            items_checked: LocalStorageUtility.getList("items_checked")
        }
        this.counter = 0;
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.addItem = this.addItem.bind(this);
        this.moveToChecked = this.moveToChecked.bind(this);
        this.moveBack = this.moveBack.bind(this);
        this.moveToTheTop = this.moveToTheTop.bind(this);
        this.delete = this.delete.bind(this);
    }
    handleKeyPress(e) {
        if (e.which === 13) {
            this.addItem();
        }
    }
    addItem() {
        var temp_todo_list = this.state.todo_list;
        var item = {
            text : this.inputText.value,
            isStar : false
        }
        temp_todo_list.push(item);
        this.setState({
            todo_list: temp_todo_list
        })
        this.inputText.value = "";
    }
    moveToChecked(item) {
        var temp_todo_list = this.state.todo_list;
        var temp_items_checked = this.state.items_checked;
        var item_checked = null;
        for (var i=0 ;i<temp_todo_list.length; i++ ){
            if (item === temp_todo_list[i].text){
                item_checked = temp_todo_list.splice(i, 1);
            }
        }
        temp_items_checked.push(item_checked[0]);
        this.setState({
            todo_list: temp_todo_list,
            item_checked: temp_items_checked
        });
    }
    moveBack(item) {
        var temp_todo_list = this.state.todo_list;
        var temp_items_checked = this.state.items_checked;
        var item_to_move_back = null;
        for (var i=0 ;i<temp_items_checked.length; i++ ){
            if (item === temp_items_checked[i].text){
                item_to_move_back = temp_items_checked.splice(i, 1);
            }
        }
        temp_todo_list.push(item_to_move_back[0]);
        this.setState({
            todo_list: temp_todo_list,
            item_checked: temp_items_checked
        });
    }
    moveToTheTop(item) {
        var temp_todo_list = this.state.todo_list;
        var item_to_move_top = null;
        for (var i=0 ;i<temp_todo_list.length; i++ ){
            if (item === temp_todo_list[i].text){
                item_to_move_top = temp_todo_list.splice(i, 1);
            }
        }
        item_to_move_top[0].isStar = true;
        temp_todo_list.unshift(item_to_move_top[0]);
        this.setState({
            todo_list: temp_todo_list,
        });
    }
    delete(item) {
        var temp_todo_list = this.state.todo_list;
        var temp_items_checked = this.state.items_checked;
        for (var i=0 ;i<temp_todo_list.length; i++ ){
            if (item === temp_todo_list[i].text){
                temp_todo_list.splice(i, 1);
                this.setState({
                    todo_list: temp_todo_list,
                });
            }
        }
        for (var i=0 ;i<temp_items_checked.length; i++ ){
            if (item === temp_items_checked[i].text){
                temp_items_checked.splice(i, 1);
                this.setState({
                    item_checked: temp_items_checked
                });
            }
        }
    }
    componentDidUpdate() {
        LocalStorageUtility.storeItem("todo_list",this.state.todo_list);
        LocalStorageUtility.storeItem("items_checked",this.state.items_checked);
    }
    render() {
        var todo_items = this.state.todo_list.map((item, i) => <TodoItem key={i} text={item.text} check={this.moveToChecked} star={this.moveToTheTop} isStar={item.isStar} erase={this.delete}/>)
        var checked_items = this.state.items_checked.map((item, i) => <CheckedItem key={i} text={item.text} uncheck={this.moveBack} erase={this.delte}/>)
        return (
            <div>
                <Header />
                <div className="main-container">
                    <input ref={(input) => { this.inputText = input }} onKeyPress={this.handleKeyPress} type="text" placeholder="Enter your todo" />
                    <button className="add-button" onClick={this.addItem} >+</button>
                    <div> To Do: </div>
                    <ul className="list">
                        {todo_items}
                    </ul>
                    <div> Checked: </div>
                    <ul className="list">
                        {checked_items}
                    </ul>
                </div>
            </div>
        );
    }
}
ReactDOM.render(
    <App />,
    document.getElementById("root")
);
