// elements
const addTaskElement = document.querySelector(".add__task");
const taskBarContainerElement = document.querySelector(".taskBar__container");
const TaskSearchBarInputElement = document.querySelector(
  ".TaskSearchBar__input"
);
const taskbarHeaderElements = document.querySelector(".task__bar__header");
const taskbarElements = document.querySelectorAll(".task__bar");
const sunIconElement = document.querySelector(".image-button");
const headerElement = document.querySelector(".header");
const contentElement = document.querySelector(".content");
const itemStatusElement = document.querySelector(".items__status");
const activeTaskElement = document.querySelector(".active__task");
const completedTaskElement = document.querySelector(".completed__task");
const allTaskElement = document.querySelector(".all__task");
const clearCompletedElement = document.querySelector(".clear__completed");
const statusButtonsElement = document.querySelector(".status__buttons");
const taskBarFooter = document.querySelector(".taskBar__footer");

// starter variables********************
let itemsStatus = 0;
const originalPlaceholder = TaskSearchBarInputElement.placeholder;

// fuctions*************************************
const toggleTheme = () => {
  const taskbarElements = document.querySelectorAll(".task__bar");
  const taskText = document.querySelectorAll(".task__text");
  const taskBarComleted = document.querySelectorAll(
    ".task__bar span.completed"
  );
  headerElement.classList.toggle("light");
  taskbarHeaderElements.classList.toggle("light");
  sunIconElement.classList.toggle("light");
  contentElement.classList.toggle("light");
  taskbarElements.forEach((task) => task.classList.toggle("light"));
  taskText.forEach((task) => task.classList.toggle("light"));
  taskBarComleted.forEach((task) => task.classList.toggle("light"));
  TaskSearchBarInputElement.classList.toggle("light");
  taskBarContainerElement.classList.toggle("light");
  taskBarFooter.classList.toggle("light");
};

const addTask = () => {
  let placeHolder = TaskSearchBarInputElement.value;

  if (sunIconElement.classList.contains("light")) {
    markUp = `<li class="task__bar light" draggable="true" ondragstart="drag(event)">
    <div>
    <button class="task"></button>
    <span class="task__text light">${placeHolder}</span>
    </div>
    <img src="./images/icon-cross.svg" class="cross-icon" alt="cross-icon">
    </li>`;
  } else {
    markUp = `<li class="task__bar" draggable="true" ondragstart="drag(event)">
  <div>
  <button class="task"></button>
  <span class="task__text">${placeHolder}</span>
  </div>
  <img
  src="./images/icon-cross.svg"
  class="cross-icon"
  alt="cross-icon"
  />
  </li>`;
  }

  taskBarContainerElement.insertAdjacentHTML("afterbegin", markUp);
  itemStatusElement.innerHTML = `${++itemsStatus} items left`;
  saveTasksToLocalStorage();
  TaskSearchBarInputElement.value = "";
};

const handleTaskBarContainerClick = (e) => {
  const target = e.target;
  //remove task
  if (target.classList.contains("cross-icon")) {
    const deleteTask = confirm("are you sure you ant to delete?");
    if (deleteTask) {
      target.parentElement.remove();
      saveTasksToLocalStorage();
      itemStatusElement.innerHTML = `${--itemsStatus} items left`;
    } else {
      return;
    }
  } else if (target.classList.contains("task")) {
    //toggle copleted task
    target.classList.toggle("completed");
    target.nextElementSibling.classList.toggle("completed");
    saveTasksToLocalStorage();
  }
};

const handleActiveButtonClick = () => {
  const completedTasks = document.querySelectorAll(".task.completed");
  const nonCompletedTasks = document.querySelectorAll(".task:not(.completed)");

  // show non-completed tasks
  nonCompletedTasks.forEach((task) => {
    const taskElement = task.closest(".task__bar");
    taskElement.style.display = "block";
    // task.parentElement.style.display = "block";
  });

  // hidecompleted tasks
  completedTasks.forEach((task) => {
    const taskElement = task.closest(".task__bar");
    taskElement.style.display = "none";
    // task.parentElement.style.display = "none";
  });
};

const handleCompletedButtonClick = () => {
  const completedTasks = document.querySelectorAll(".task.completed");
  const nonCompletedTasks = document.querySelectorAll(".task:not(.completed)");

  // Hide non-completed tasks
  nonCompletedTasks.forEach((task) => {
    const taskElement = task.closest(".task__bar");
    taskElement.style.display = "none";
  });

  // Show completed tasks
  completedTasks.forEach((task) => {
    const taskElement = task.closest(".task__bar");
    taskElement.style.display = "block";
    // task.parentElement.style.display = "block";
  });
};

const handleAllTaskButtonClick = () => {
  const allTasks = document.querySelectorAll(".task__bar");

  // Show all tasks
  allTasks.forEach((taskElement) => {
    taskElement.style.display = "flex";
  });
};

const handleClearCompletedTaskButtonClick = () => {
  const completedTasks = document.querySelectorAll(".task.completed");

  completedTasks.forEach((task) => {
    task.parentElement.parentElement.remove();
    itemStatusElement.innerHTML = `${--itemsStatus} items left`;
  });
  saveTasksToLocalStorage();
};

const handleStatusButtonStyle = (e) => {
  const statusButtons = document.querySelectorAll(".status__buttons button");
  statusButtons.forEach((button) => {
    button.classList.remove("active");
  });

  e.target.classList.add("active");
  saveTasksToLocalStorage();
};

const saveTasksToLocalStorage = () => {
  const tasks = [];
  const taskElements = document.querySelectorAll(".task__bar");

  taskElements.forEach((taskElement) => {
    const taskTextElement = taskElement.querySelector(".task__text");
    const taskText = taskTextElement ? taskTextElement.innerText : "";

    const taskButton = taskElement.querySelector(".task");
    const isCompleted = taskButton
      ? taskButton.classList.contains("completed")
      : false;
    const themeStatus = sunIconElement
      ? sunIconElement.classList.contains("light")
      : false;
    tasks.push({
      text: taskText,
      completed: isCompleted,
      itemsStatus: itemsStatus,
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    const markUp = `<li class="task__bar" draggable="true" ondragstart="drag(event)">
      <div>
        <button class="task${task.completed ? " completed" : ""}"></button>
        <span class="task__text${task.completed ? " completed" : ""} ">${
      task.text
    }</span>
      </div>
      <img src="./images/icon-cross.svg" class="cross-icon" alt="cross-icon" />
    </li>`;

    taskBarContainerElement.insertAdjacentHTML("afterbegin", markUp);
    itemStatusElement.innerHTML = `${task.itemsStatus} items left`;
  });
  new Sortable(taskBarContainerElement, {
    animation: 150,
    onEnd: saveTasksToLocalStorage,
  });
};

//event listener****************************************
taskBarContainerElement.addEventListener("click", handleTaskBarContainerClick);
addTaskElement.addEventListener("click", addTask);
TaskSearchBarInputElement.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  } else {
    return;
  }
});
sunIconElement.addEventListener("click", toggleTheme);
activeTaskElement.addEventListener("click", handleActiveButtonClick);
completedTaskElement.addEventListener("click", handleCompletedButtonClick);
allTaskElement.addEventListener("click", handleAllTaskButtonClick);
clearCompletedElement.addEventListener(
  "click",
  handleClearCompletedTaskButtonClick
);
statusButtonsElement.addEventListener("click", handleStatusButtonStyle);

TaskSearchBarInputElement.addEventListener("focus", () => {
  TaskSearchBarInputElement.placeholder = "Currently typing";
});

TaskSearchBarInputElement.addEventListener("blur", () => {
  TaskSearchBarInputElement.placeholder = originalPlaceholder;
});

window.addEventListener("load", () => {
  loadTasksFromLocalStorage();
});
