/*
Holds all the components of the Todo list, and serves as a central point for
event handling.
*/
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
      React.createElement("div", {className: "todoContainer"}, 
        React.createElement("h1", null, "Newtopia To Do List:"), 
        React.createElement(TodoList, {data: this.state.data, onTodoEdit: this.handleTodoEdit, onTodoDelete: this.handleTodoDelete}), 
        React.createElement(TodoAdd, {onTodoSubmit: this.handleTodoSubmit})
      )
    );
  }
});

/*
Contains the list portion of the Todo list. Renders a list of Todo items and the
buttons to delete them.
*/
var TodoList = React.createClass({displayName: "TodoList",
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
        React.createElement("li", {className: "todoListItem", key: todo.Id}, 
          React.createElement("textarea", {className: "todo", value: todo.Item, onChange: this.handleEdit.bind(this, todo.Id), ref: "todoItem" + todo.Id}), 
          React.createElement("button", {onClick: this.handleDelete.bind(this, todo.Id)}, "Del")
        )
      );
    }.bind(this)); // TODO: Figure out why this complains that this.props.data.map is not a function when you DELETE
    return (
      React.createElement("ol", {className: "todoList"}, 
        todoNodes
      )
    );
  }
});

/*
 Contains the form that allows adding new items to the Todo list. Generates the
 onTodoSubmit event when the form is submitted.
*/
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

/*
Render the Todo container, which holds all the Todo list objects.
*/
React.render(
  React.createElement(TodoContainer, {url: "/todo"}),
  document.getElementById('content')
);
