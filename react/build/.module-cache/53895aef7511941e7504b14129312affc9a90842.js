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
      dataType: 'json',
      url: this.props.url,
      type: "POST",
      data: todo,
      success: function(data) {
        this.setState({data: data})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadTodoListFromServer();
    setInterval(this.loadTodoListFromServer, this.props.pollInterval); // HACK: Change this to websockets or similar
  },
  render: function() {
    return (
      React.createElement("div", {className: "todoContainer"}, 
        React.createElement("h1", null, "TodoContainer."), 
        React.createElement(TodoList, {data: this.state.data}), 
        React.createElement(TodoAdd, {onTodoSubmit: this.handleTodoSubmit})
      )
    );
  }
});

var Todo = React.createClass({displayName: "Todo",
  render: function() {
    return (
      React.createElement("div", {className: "todo"}, 
        this.props.children
      )
    );
  }
});

var TodoList = React.createClass({displayName: "TodoList",
  render: function() {
    var todoNodes = this.props.data.map(function(todo, index) {
      return (
        React.createElement(Todo, {key: index}, 
          todo.Item
        )
      );
    });
    return (
      React.createElement("div", {className: "todoList"}, 
        todoNodes
      )
    );
  }
});

var TodoAdd = React.createClass({displayName: "TodoAdd",
  handleSubmit: function(submitEvent) {
    submitEvent.preventDefault();

    var Item = React.findDOMNode(this.refs.Item).value.trim();
    if(!Item) {
      return;
    }
    this.props.onTodoSubmit({Item: Item})
    React.findDOMNode(this.refs.Item).value = '';
    return;
  },
  render: function() {
    return (
      React.createElement("form", {className: "todoAdd", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", placeholder: "What do you need to do?", ref: "Item"}), 
        React.createElement("input", {type: "submit", value: "Add"})
      )
    );
  }
});


React.render(
  React.createElement(TodoContainer, {url: "/todo", pollInterval: 2000}), // HACK: replace polling with websockets
  document.getElementById('content')
);
