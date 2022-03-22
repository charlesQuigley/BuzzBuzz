const displayTasks = document.querySelector("#showTask");

displayTasks.addEventListener('click', () =>
{

  fetch('Test/index.php')
  .then(response => response.text()).then(response => console.log(response));

});
