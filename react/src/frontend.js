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

var TodoList = React.createClass({
  handleEdit: function(idToEdit) {
    var itemToEdit = this.state.itemToEdit; // FIXME: This doesn't yet work, probably linked to the bind(this) below
    this.props.onTodoEdit(idToEdit, {Item: itemToEdit});
  },
  handleDelete: function(itemToDelete) {
    this.props.onTodoDelete(itemToDelete);
  },
  render: function() {
    var todoNodes = this.props.data.map(function(todo, index) {
      return (
        <Todo key={index} onEdit={this.handleEdit.bind(this, todo.Id)}>
          {todo.Item}
          <button onClick={this.handleDelete.bind(this, todo.Id)}>Del</button>
        </Todo>
      );
    }.bind(this)); // TODO: Figure out why this complains that this.props.data.map is not a function when you DELETE
    return (
      <ul className="todoList">
        {todoNodes}
      </ul>
    );
  }
});

var Todo = React.createClass({
  handleInput: function() {
    var update = React.findDOMNode(this.refs.todoItem).value;
    this.setState({itemToEdit: update});

    this.props.onEdit();
  },
  render: function() {
    return (
      <li className="todo" contentEditable={true} onInput={this.handleInput} ref="todoItem">
        {this.props.children}
      </li>
    );
  }
});

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

React.render(
  <TodoContainer url="/todo" />,
  document.getElementById('content')
);
