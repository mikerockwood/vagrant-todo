var TodoContainer = React.createClass({displayName: "TodoContainer",
  loadTodoListFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'application/json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []}
  },
  componentDidMount: function() {
    this.loadTodoListFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval); // HACK: Change this to websockets or similar
  },
  render: function() {
    return (
      React.createElement("div", {className: "todoContainer"}, 
        React.createElement("h1", null, "TodoContainer."), 
        React.createElement(TodoList, {data: this.state.data}), 
        React.createElement(TodoAdd, null)
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
    var todoNodes = this.props.data.map(function(todo) {
      return (
        React.createElement(Todo, null, 
          todo.item
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
  render: function() {
    return (
      React.createElement("div", {className: "todoAdd"}, 
        "Hello, world! I am a place to add a Todo."
      )
    );
  }
});


React.render(
  React.createElement(TodoContainer, {url: "localhost:8080/todo", pollInterval: 2000}), // HACK: replace polling with websockets
  document.getElementById('content')
);
