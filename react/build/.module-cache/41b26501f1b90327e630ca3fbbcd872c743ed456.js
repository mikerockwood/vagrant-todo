var TodoContainer = React.createClass({displayName: "TodoContainer",
  render: function() {
    return (
      React.createElement("div", {className: "todoContainer"}, 
        React.createElement("h1", null, "TodoContainer."), 
        React.createElement(TodoList, null), 
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
    return (
      React.createElement("div", {className: "todoList"}, 
        React.createElement(Todo, null, "This is one item"), 
        React.createElement(Todo, null, "This is another item")
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
  React.createElement(TodoContainer, null),
  document.getElementById('content')
);
