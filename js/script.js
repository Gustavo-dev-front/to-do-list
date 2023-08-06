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

// Inicio da lógica de filtro
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

// Função de filtro das tasks por status (tudo, pendentes ou completos)
function filter(index) {
  filterList[activeFilterIndex].classList.remove("active");
  activeFilterIndex = index;
  filterList[activeFilterIndex].classList.add("active");
  localStorage.setItem("active-filter-index", activeFilterIndex);
  showTasks(filterList[activeFilterIndex].id);
}

// Função básica para remoção de TODAS as tasks.
function clearAll() {
  const length = toDoList.length;
  toDoList.splice(0, length);
  localStorage.setItem("to-do-list", JSON.stringify(toDoList));
  filter(activeFilterIndex);
}

// Função básica para edição de uma task. Obs.: Restante da lógica na função principal que valida a entrada do usuário.
function editTask(index) {
  isEdit = true;
  editId = index;
  input.value = toDoList[index].text;
  input.focus();
}

// Função básica para remoção de uma task.
function deleteTask(index) {
  toDoList.splice(index, 1);
  localStorage.setItem("to-do-list", JSON.stringify(toDoList));
  filter(activeFilterIndex);
}

// Função responsável por esconder o menu de opções das tasks quando houver um click fora do menu.
function outsideClick(event, element, html, callback) {
  html.classList.add("event-active");
  if (!element.contains(event.target)) {
    element.classList.remove("active");
    html.classList.remove("event-active");
    html.removeEventListener("click", callback);
  }
}

// Função responsável por exibir o menu de opções das tasks.
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

// Função responsável por atualizar o status das tasks quando houver marcação(check) no input relacionado.
function updateStatus(index, input) {
  if (input.checked) toDoList[index].status = "completed";
  else toDoList[index].status = "pending";
  localStorage.setItem("to-do-list", JSON.stringify(toDoList));
}

// Função que irá exibir todas as tasks do Array principal, utilizando inclusive o filtro.
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

// Função básica para salvar a task criada no Array principal e posteriormente no localstorage.
function saveTask(task) {
  toDoList.push(task);
  localStorage.setItem("to-do-list", JSON.stringify(toDoList));
  filter(activeFilterIndex);
}

// Função básica que irá criar a task e retorna-la como um objeto
function createTask(value) {
  return { text: value, status: "pending" };
}

// Função que irá dar inicio
function init() {
  input.addEventListener("keyup", (event) => {
    let value = input.value;

    // Validação da entrada do usuário
    if (event.key === "Enter" && value.length > 0) {
      // Validação do tipo de entrada (edição ou nova tarefa)
      if (isEdit) {
        toDoList[editId].text = value;
        localStorage.setItem("to-do-list", JSON.stringify(toDoList));
        isEdit = false;
      } else {
        const task = createTask(value);
        saveTask(task);
      }
      input.value = "";
      // Validação do filtro atual, para que quando o usuário insira uma task filtrando por "completos" o filtro mude para mostrar que houve sucesso na inclusão.
      if (activeFilterIndex === 2) filter(1);
      else filter(activeFilterIndex);
    }
  });

  filter(activeFilterIndex);
  btnClear.addEventListener("click", clearAll);
}

init();
