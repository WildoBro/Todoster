$(function() {
  function handleSubmit (event) {
    event.preventDefault();
    var textbox = $('.new-todo');
    var payload = {
      task: {
        title: textbox.val()
      }
    };
    $.post("/tasks", payload).success(function(data) {
      var htmlString = taskHtml(data);
      var ulTodos = $('.todo-list');
      ulTodos.append(htmlString);
      $('.new-todo').val('');
    });
  }


  // The taskHtml method takes in a JavaScript representation
  // of the task and produces an HTML representation using
  // <li> tags
  function taskHtml(task) {
    var checkedStatus = task.done ? "checked" : "";
    var liClass = task.done ? "completed" : ""; 
    var liElement = '<li data-id="' + task.id + '" id="listItem-' + task.id + '" class="' + liClass + '">' + 
    '<div class="view"><input class="toggle" type="checkbox"' +
      checkedStatus +
      '><label>' +
       task.title +
       '<button class="js-delete" type="button" style="float: right;">&times;</button></label></div></li>';

    return liElement;
  }

  // toggleTask takes in an HTML representation of the
  // an event that fires from an HTML representation of
  // the toggle checkbox and  performs an API request to toggle
  // the value of the `done` field
  function toggleTask(e) {
    var itemId = $(e.target).closest("li").data("id");

    var doneValue = Boolean($(e.target).is(':checked'));

    $.ajax({
      url: "/tasks/" + itemId,
      method: "PUT",
      data: {task: {
        done: doneValue
      }}
    }).success(function(data) {
      var liHtml = taskHtml(data);
      var $li = $("#listItem-" + data.id);
      $li.replaceWith(liHtml);
    });
  }


  function deleteTask(e) {
    var itemId = $(e.target).closest("li").data("id");

    $.ajax({
      url: "/tasks/" + itemId,
      method: "DELETE"
    }).success(function(data) {
      var $li = $("#listItem-" + data.id);
      $li.remove();
    });
  }


  $.get("/tasks").success( function( data ) {
    var htmlString = "";

    // data.forEach(function(task, index){
    //   htmlString += taskHtml(task)
    // });
    //
    function dealWithIndividualTask (index, task) {
      htmlString += taskHtml(task);
    };

    for(var index = 0; index < data.length; index++){
      dealWithIndividualTask(index, data[index]);
    };
    
    //
    // $.each(data, function(index, task) {
    //   htmlString += taskHtml(task);
    // });
    var ulTodos = $('.todo-list');
    ulTodos.html(htmlString);

  });

  $('#new-form').on("submit", handleSubmit);
  $(document).on("change", '.toggle', toggleTask);
  $(document).on("click", '.js-delete', deleteTask);
});
