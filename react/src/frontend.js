/*
Holds all the components of the Todo list, and serves as a central point for
event handling.
*/
var TodoContainer = React.createClass({
  loadTodoListFromServer: function() {
    $.ajax({
      dataType: "json",
      url: this.props.url,
      type: "GET",
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoSubmit: function(item) {
    $.ajax({
      dataType: "json",
      url: this.props.url,
      type: "POST",
      data: JSON.stringify(item), // TODO: There is a syntax error happening here, fix it
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    });

    this.loadTodoListFromServer();
  },
  handleTodoEdit: function(idToEdit, itemToEdit) {
    $.ajax({
      dataType: "json",
      url: this.props.url + "/" + idToEdit,
      type: "PUT",
      data: JSON.stringify(itemToEdit),
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    });

    this.loadTodoListFromServer();
  },
  handleTodoDelete: function(itemToDelete) {
    $.ajax({
      url: this.props.url + "/" + itemToDelete,
      type: "DELETE",
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    });

    this.loadTodoListFromServer();
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadTodoListFromServer();
  },
  render: function() {
    return (
      <div className="todoContainer">
        <h1>Newtopia To Do List:</h1>
        <TodoList data={this.state.data} onTodoEdit={this.handleTodoEdit} onTodoDelete={this.handleTodoDelete} />
        <TodoAdd onTodoSubmit={this.handleTodoSubmit} />
      </div>
    );
  }
});

/*
Contains the list portion of the Todo list. Renders a list of Todo items and the
buttons to delete them.
*/
var TodoList = React.createClass({
  handleEdit: function(idToEdit) {
    console.log(idToEdit)
    var itemToEdit = React.findDOMNode(this.refs["todoItem" + idToEdit]).value;
    this.props.onTodoEdit(idToEdit, {Item: itemToEdit});
  },
  handleDelete: function(itemToDelete) {
    this.props.onTodoDelete(itemToDelete);
  },
  render: function() {
    var todoNodes = this.props.data.map(function(todo, index) {
      return (
        <li className="todoListItem" key={todo.Id}>
          <textarea className="todo" value={todo.Item} onChange={this.handleEdit.bind(this, todo.Id)} ref={"todoItem" + todo.Id} />
          <button onClick={this.handleDelete.bind(this, todo.Id)}>Del</button>
        </li>
      );
    }.bind(this)); // TODO: Figure out why this complains that this.props.data.map is not a function when you DELETE
    return (
      <ol className="todoList">
        {todoNodes}
      </ol>
    );
  }
});

/*
 Contains the form that allows adding new items to the Todo list. Generates the
 onTodoSubmit event when the form is submitted.
*/
var TodoAdd = React.createClass({
  handleSubmit: function(submitEvent) {
    submitEvent.preventDefault();

    var itemToAdd = React.findDOMNode(this.refs.itemRef).value.trim();
    if(!itemToAdd) {
      return;
    }
    this.props.onTodoSubmit({Item: itemToAdd});
    React.findDOMNode(this.refs.itemRef).value = '';
    return;
  },
  render: function() {
    return (
      <form className="todoAdd" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="What do you need to do?" ref="itemRef" />
        <input type="submit" value="Add" />
      </form>
    );
  }
});

/*
Render the Todo container, which holds all the Todo list objects.
*/
React.render(
  <TodoContainer url="/todo" />,
  document.getElementById('content')
);
