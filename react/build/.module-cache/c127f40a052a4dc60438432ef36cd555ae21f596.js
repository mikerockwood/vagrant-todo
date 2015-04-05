var TodoContainer = React.createClass({displayName: "TodoContainer",
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
      data: JSON.stringify(itemToEdit), // TODO: There is a syntax error happening here, fix it
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
      React.createElement("div", {className: "todoContainer"}, 
        React.createElement("h1", null, "Newtopia To Do List:"), 
        React.createElement(TodoList, {data: this.state.data, onTodoEdit: this.handleTodoEdit, onTodoDelete: this.handleTodoDelete}), 
        React.createElement(TodoAdd, {onTodoSubmit: this.handleTodoSubmit})
      )
    );
  }
});

var TodoList = React.createClass({displayName: "TodoList",
  handleEdit: function(idToEdit, itemtoEdit) {
    this.props.onTodoEdit(idToEdit, itemToEdit);
  },
  handleDelete: function(itemToDelete) {
    this.props.onTodoDelete(itemToDelete);
  },
  render: function() {
    var todoNodes = this.props.data.map(function(todo, index) {
      return (
        React.createElement(Todo, {key: index, onEdit: this.handleEdit.bind(this, todo.Id, this.state.data.itemToEdit)}, 
          todo.Item, 
          React.createElement("button", {onClick: this.handleDelete.bind(this, todo.Id)}, "Del")
        )
      );
    }.bind(this)); // TODO: Figure out why this complains that this.props.data.map is not a function when you DELETE
    return (
      React.createElement("ul", {className: "todoList"}, 
        todoNodes
      )
    );
  }
});

var Todo = React.createClass({displayName: "Todo",
  handleInput: function() {
    var update = React.findDOMNode(this.refs.todoItem).value;
    this.setState({itemToEdit: update});

    this.props.onEdit();
  },
  render: function() {
    return (
      React.createElement("li", {className: "todo", contentEditable: true, onInput: this.handleInput, ref: "todoItem"}, 
        this.props.children
      )
    );
  }
});

var TodoAdd = React.createClass({displayName: "TodoAdd",
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
      React.createElement("form", {className: "todoAdd", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", placeholder: "What do you need to do?", ref: "itemRef"}), 
        React.createElement("input", {type: "submit", value: "Add"})
      )
    );
  }
});

React.render(
  React.createElement(TodoContainer, {url: "/todo"}),
  document.getElementById('content')
);
