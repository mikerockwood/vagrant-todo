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
        this.setState({data: data})
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
      <div className="todoContainer">
        <h1>TodoContainer.</h1>
        <TodoList data={this.state.data} onTodoDelete={this.handleTodoDelete} />
        <TodoAdd onTodoSubmit={this.handleTodoSubmit} />
      </div>
    );
  }
});

var Todo = React.createClass({
  render: function() {
    return (
      <div className="todo" ref="todoItem">
        {this.props.children}
      </div>
    );
  }
});

var TodoList = React.createClass({
  handleEdit: function(itemToEdit) {
    console.log("bla");
  },
  handleDelete: function(itemToDelete) {
    this.props.onTodoDelete(itemToDelete);
  },
  render: function() {
    var todoNodes = this.props.data.map(function(todo, index) {
      return (
        <Todo key={index}>
          {todo.Item}
          <button onClick={this.handleEdit.bind(this, todo.Id)}>Edit</button>
          <button onClick={this.handleDelete.bind(this, todo.Id)}>Del</button>
        </Todo>
      );
    }.bind(this)); // TODO: Figure out why this complains that this.props.data.map is not a function when you DELETE
    return (
      <div className="todoList">
        {todoNodes}
      </div>
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
    this.props.onTodoSubmit({Item: itemToAdd})
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
  <TodoContainer url="/todo" pollInterval={5000} />, // HACK: replace polling with websockets
  document.getElementById('content')
);
