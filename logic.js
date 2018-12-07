

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

class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMenuOpen: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.star = this.star.bind(this);
        this.handleErase = this.handleErase.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.chainSubmit = this.chainSubmit.bind(this);
    }
    handleChange(e) {
        e.preventDefault();
        if (this.props.type === "todo_list") {
            this.props.check(this.props.text)
        } else {
            this.props.uncheck(this.props.text)
        }
    }
    star() {
        if (this.props.isStar === false){
            this.props.star(this.props.text);
        } else {
            this.props.unstar(this.props.text)
        }
    }
    handleErase() {
        this.props.erase(this.props.text);
    }
    openMenu() {
        if (this.state.isMenuOpen) {
            this.setState({
                isMenuOpen : false
            })
        } else {
            this.setState({
                isMenuOpen : true
            })
        }
    }
    chainSubmit(desc,date){
        this.props.transferDetailes(desc,date,this.props.text);
    }
    render() {
        if (typeof this.props.isStar !== "undefined") {
            var starImg = this.props.isStar ? "./img/fullstar.png" : "./img/star.png"
            var star = <img className="clickable icon" src={starImg} title="Mark as Important" onClick={this.star} />
        }
        return (
            <div>
                <li className="item">
                    <label className="container">
                        <input type="checkbox" onChange={this.handleChange} checked={this.props.isChecked} />
                        <span className="checkmark"></span>
                        <p className="todo-title">{this.props.text}</p>
                        <p className="desc">{this.props.desc}</p>
                        <p className="date">{this.props.date}</p>
                    </label>
                    <span>
                        {star}
                        <img className="clickable icon" src="./img/trash.png" title="Erase" onClick={this.handleErase} />
                        <img className="clickable icon" src="./img/menu.png" title="More Options" onClick={this.openMenu}/>
                    </span>
                </li>
                < MenuDropdown isOpen={this.state.isMenuOpen} submit={this.chainSubmit}/>
            </div>
        );
    }

}

class MenuDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen : this.props.isOpen
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.submit(this.inputDesc.value,this.inputDate.value);
        this.setState({
            isOpen : false
        })
    }
    componentWillReceiveProps(newProps) {
        if (newProps.isOpen !== this.props.isOpen){
            this.setState({
                isOpen : newProps.isOpen
            })
        }
    }
    render() {
        var visibility = this.state.isOpen ? "visible" : "";
        return (
            <div className={`dropdown-menu ${visibility}`}>
                <form className="desc-date-form">
                    <span>Description:</span>
                    <textarea rows="3" cols="30" ref={(input) => { this.inputDesc = input }} placeholder="Enter your description here"></textarea>
                    <span>Due date:</span>
                    <input type="date"  ref={(input) => { this.inputDate = input }}></input><br/>
                    <input className="form-btn" type="submit" value="Add" onClick={this.handleSubmit}/>
                </form>
            </div>
        )
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
        this.moveToTheBottom = this.moveToTheBottom.bind(this);
        this.delete = this.delete.bind(this);
        this.addDetailes = this.addDetailes.bind(this);
    }
    handleKeyPress(e) {
        if (e.which === 13) {
            this.addItem();
        }
    }
    addItem() {
        var temp_todo_list = this.state.todo_list;
        var item = {
            text: this.inputText.value,
            isStar: false
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
        for (var i = 0; i < temp_todo_list.length; i++) {
            if (item === temp_todo_list[i].text) {
                item_checked = temp_todo_list.splice(i, 1);
                break;
            }
        }
        item_checked[0].isStar = false;
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
        for (var i = 0; i < temp_items_checked.length; i++) {
            if (item === temp_items_checked[i].text) {
                item_to_move_back = temp_items_checked.splice(i, 1);
                break;
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
        for (var i = 0; i < temp_todo_list.length; i++) {
            if (item === temp_todo_list[i].text) {
                item_to_move_top = temp_todo_list.splice(i, 1);
                break;
            }
        }
        item_to_move_top[0].isStar = true;
        temp_todo_list.unshift(item_to_move_top[0]);
        this.setState({
            todo_list: temp_todo_list,
        });
    }
    moveToTheBottom(item) {
        console.log ("in the moveToTheBottom function");
        var temp_todo_list = this.state.todo_list;
        var item_to_move_bottom = null;
        for (var i = 0; i < temp_todo_list.length; i++) {
            if (item === temp_todo_list[i].text) {
                item_to_move_bottom = temp_todo_list.splice(i, 1);
                break;
            }
        }
        item_to_move_bottom[0].isStar = false;
        temp_todo_list.push(item_to_move_bottom[0]);
        this.setState({
            todo_list: temp_todo_list,
        });
    }
    delete(item) {
        var temp_todo_list = this.state.todo_list;
        var temp_items_checked = this.state.items_checked;
        for (var i = 0; i < temp_todo_list.length; i++) {
            if (item === temp_todo_list[i].text) {
                temp_todo_list.splice(i, 1);
                this.setState({
                    todo_list: temp_todo_list,
                });
                break;
            }
        }
        for (var i = 0; i < temp_items_checked.length; i++) {
            if (item === temp_items_checked[i].text) {
                temp_items_checked.splice(i, 1);
                this.setState({
                    item_checked: temp_items_checked
                });
            }
        }
    }
    addDetailes(desc,date,item) {
        // console.log("inside the addDEtailes function in the App");
        var temp_todo_list = this.state.todo_list;
        for (var i = 0; i < temp_todo_list.length; i++) {
            if (item === temp_todo_list[i].text) {
                temp_todo_list[i].desc = desc;
                temp_todo_list[i].date = date;
                break;
            }
        }
        this.setState({
            todo_list: temp_todo_list,
        });
    }
    componentDidUpdate() {
        LocalStorageUtility.storeItem("todo_list", this.state.todo_list);
        LocalStorageUtility.storeItem("items_checked", this.state.items_checked);
    }
    render() {
        var todo_items = this.state.todo_list.map((item, i) => <Item key={i} type="todo_list" text={item.text} desc={item.desc} date={item.date} check={this.moveToChecked} star={this.moveToTheTop} unstar={this.moveToTheBottom} isStar={item.isStar} erase={this.delete} transferDetailes={this.addDetailes}/>)
        var checked_items = this.state.items_checked.map((item, i) => <Item key={i} type="items_checked" text={item.text} desc={item.desc} date={item.date} uncheck={this.moveBack} erase={this.delte} isChecked={true} />)
        return (
            <div>
                <Header />
                <div className="main-container">
                    <input className="insert-todo" ref={(input) => { this.inputText = input }} onKeyPress={this.handleKeyPress} type="text" placeholder="Enter your todo" />
                    <button className="add-button" onClick={this.addItem} >Add</button>
                    <h3 className="title"> To Do: </h3>
                    <ul className="list">
                        {todo_items}
                    </ul>
                    <h3 className="title"> Checked: </h3>
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
