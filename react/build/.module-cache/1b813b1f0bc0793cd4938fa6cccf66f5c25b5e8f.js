var TodoContainer = React.createClass({displayName: "TodoContainer",
  render: function() {
    return (
      React.createElement("div", {className: "todoContainer"}, 
        React.createElement("h1", null, "TodoContainer."), 
        React.createElement(TodoList, {data: this.props.data}), 
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

var data = [
  {item: "This is a JSON item", dateCreated: "Yesterday", lastUpdated: "Never"},
  {item: "This is a different JSON item", dateCreated:"Yesterday", lastUpdated: "Never"}
];

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
  React.createElement(TodoContainer, {data: data}),
  document.getElementById('content')
);
