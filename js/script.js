const input = document.querySelector(".input-box input");
let toDoList = JSON.parse(localStorage.getItem("to-do-list"));
const taskList = document.querySelector(".task-list");
const btnClear = document.querySelector(".btn-clear");
const filterList = [...document.querySelectorAll(".filters span")];
let activeFilterIndex = localStorage.getItem("active-filter-index");
let isEdit = false;
let editId;

if (!toDoList) {
  toDoList = [];
}

if (!activeFilterIndex) {
  activeFilterIndex = 0;
  localStorage.setItem("active-filter-index", activeFilterIndex);
  filter(activeFilterIndex);
}

filterList.forEach((item, index) => {
  item.addEventListener("click", () => {
    filter(index);
  });
});

function filter(index) {
  filterList[activeFilterIndex].classList.remove("active");
  activeFilterIndex = index;
  filterList[activeFilterIndex].classList.add("active");
  localStorage.setItem("active-filter-index", activeFilterIndex);
  showTasks(filterList[activeFilterIndex].id);
}

function clearAll() {
  const length = toDoList.length;
  toDoList.splice(0, length);
  localStorage.setItem("to-do-list", JSON.stringify(toDoList));
  filter(activeFilterIndex);
}

function editTask(index) {
  isEdit = true;
  editId = index;
  input.value = toDoList[index].text;
  input.focus();
}

function deleteTask(index) {
  toDoList.splice(index, 1);
  localStorage.setItem("to-do-list", JSON.stringify(toDoList));
  filter(activeFilterIndex);
}

function outsideClick(event, element, html, callback) {
  html.classList.add("event-active");
  if (!element.contains(event.target)) {
    element.classList.remove("active");
    html.classList.remove("event-active");
    html.removeEventListener("click", callback);
  }
}

function showMenu(menu) {
  const menuToHidde = document.querySelector(".task-menu.active");
  const html = document.documentElement;
  if (menuToHidde) menuToHidde.classList.remove("active");
  menu.classList.add("active");

  const callback = (event) => {
    outsideClick(event, menu, html, callback);
  };

  if (!html.classList.contains("event-active"))
    html.addEventListener("click", callback);
}

function updateStatus(index, input) {
  if (input.checked) toDoList[index].status = "completed";
  else toDoList[index].status = "pending";
  localStorage.setItem("to-do-list", JSON.stringify(toDoList));
}

function showTasks(filter) {
  const emptyMsg = "Não há tarefas cadastradas aqui";
  let tasks = "";
  let isCompleted;
  toDoList.forEach((item, index) => {
    if (filter === item.status || filter === "all" || !filter) {
      isCompleted = item.status === "completed" ? "checked" : "";
      tasks += `<li class="task">
                  <label for="${index}">
                    <input type="checkbox" id="${index}" onclick="updateStatus(${index}, this)" ${isCompleted}>
                    <p>${item.text}</p>
                  </label>
                  <div class="task-menu" onclick="showMenu(this)">
                    <i class="uil uil-ellipsis-h"></i>
                    <ul class="settings">
                      <li onclick="editTask(${index})">
                        <i class="uil uil-pen"></i>
                        <span>Editar</span>
                      </li>
                      <li onclick="deleteTask(${index})">
                        <i class="uil uil-trash-alt"></i>
                        <span>Deletar</span>
                      </li>
                    </ul>
                  </div>
                </li>`;
    }
  });

  taskList.innerHTML = tasks || emptyMsg;
}

function saveTask(task) {
  toDoList.push(task);
  localStorage.setItem("to-do-list", JSON.stringify(toDoList));
  filter(activeFilterIndex);
}

function createTask(value) {
  return { text: value, status: "pending" };
}

function init() {
  input.addEventListener("keyup", (event) => {
    let value = input.value;

    if (event.key === "Enter" && value.length > 0) {
      if (isEdit) {
        toDoList[editId].text = value;
        localStorage.setItem("to-do-list", JSON.stringify(toDoList));
        isEdit = false;
      } else {
        const task = createTask(value);
        saveTask(task);
      }
      input.value = "";
      filter(activeFilterIndex);
    }
  });

  filter(activeFilterIndex);
  btnClear.addEventListener("click", clearAll);
}

init();
