var TodoList = React.createClass({displayName: "TodoList",
  render: function() {
    return (
      React.createElement("div", {className: "todoList"}, 
        "Hello, world! I am a TodoList. Now I am testing the build mechanism."
      )
    );
  }
});
React.render(
  React.createElement(TodoList, null),
  document.getElementById('content')
);
