var TodoContainer = React.createClass({displayName: "TodoContainer",
  render: function() {
    return (
      React.createElement("div", {className: "todoContainer"}, 
        React.createElement("h1", null, "TodoContainer."), 
        React.createElement(TodoList, null), 
        React.createElement(AddTodo, null)
      )
    );
  }
});

var TodoList = React.createClass({displayName: "TodoList",
  render: function() {
    return (
      React.createElement("div", {className: "todo"}, 
        "Hello, world! I am a TodoList."
      )
    );
  }
});

var AddTodo = React.createClass({displayName: "AddTodo",
  render: function() {
    return (
      React.createElement("div", {className: "todo"}, 
        "Hello, world! I am a place to add a Todo."
      )
    );
  }
});


React.render(
  React.createElement(TodoContainer, null),
  document.getElementById('content')
);
