import { main, taskList, userInput, showHidebutton } from "./elements"

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
}

const fetchData = (key, flag) => {
  let data = (flag)? JSON.parse(localStorage.getItem(key)) || [] : localStorage.getItem(key);
  return data;
}

const todoItemCompletedCheck = (todoItems,checkedID, flag) => {
  todoItems.forEach((item) => {
    if(item.id === parseInt(checkedID)){
      item.isCompleted = flag;
    }
  })
}

const toggleDarkTheme = () => {
  main.classList.toggle('App--isDark');
  const isDark = main.classList.contains('App--isDark');
  saveToLocalStorage('DarkTheme', isDark);
}

const showEmptyListPic = () => {
  const emptyListHTML = 
  `<li class="EmptyList">
  <img class="EmptyList__img" src="./assets/icon-empty.svg" alt="list is empty">
  <p>قائمة المهام فارغة</p>
  </li>`;

  const emptyListFragment = document.createRange().createContextualFragment(emptyListHTML);
  const emptyListElement = document.querySelector('.EmptyList');

  if(!taskList.hasChildNodes())
    taskList.appendChild(emptyListFragment) 
  else{
    if(emptyListElement) 
    taskList.removeChild(emptyListElement);
  }
}

const addListItemstoDOM = (isCompleted, id, inputValue) => {
  const todoElementHTML = 
  `<li class="TaskList__taskContent ${isCompleted? 'TaskList__taskContent--isActive': ''}" data-id=${id}>
  <div class="TaskList__checkbox" tabindex="0" role="button">
    <img class="TaskList__checkboxImg" src="./assets/icon-checkmark.svg" alt="checkmark">
  </div>
  <div class="TaskList__valueContent">
    <p class="TaskList__value">
      ${inputValue}
    </p>
    <img src="./assets/icon-basket.svg" class="TaskList__deleteIcon" alt="basket-icon">
  </div>
</li>`;
const todoElement = document.createRange().createContextualFragment(todoElementHTML);
taskList.appendChild(todoElement);
}

const insertTodoElement = (e) => {
  e.preventDefault();
  showEmptyListPic();
  let id = Date.now();
  if(!userInput.value){
    return;
  }
  const todoObj = {id, content: userInput.value, isCompleted: false};
  let todoItems = fetchData('todoItems', true);
  todoItems.push(todoObj); 
  saveToLocalStorage('todoItems', todoItems);
  addListItemstoDOM(todoObj.isCompleted, id, userInput.value);
}

const listCheckBoxes = event => {
  let todoItems = fetchData('todoItems', true);
  const taskContent = event.target.closest('.TaskList__taskContent');
  if(event.target.matches('.TaskList__checkboxImg')) {
    const checkedID = taskContent.getAttribute('data-id');
    if(taskContent.classList.contains('TaskList__taskContent--isActive')){
    taskContent.classList.remove('TaskList__taskContent--isActive');
    todoItemCompletedCheck(todoItems, checkedID, false);
    }
    else{
      taskContent.classList.add('TaskList__taskContent--isActive');
      todoItemCompletedCheck(todoItems, checkedID, true);
    }
  }
  saveToLocalStorage('todoItems', todoItems);
}

const deleteTodoItem = event => {
  if(event.target.matches('.TaskList__deleteIcon')){
    const confirmation = confirm('Are you sure you want to delete this item from your TODO list?');
    if(confirmation) {
      const toDeleteItem = event.target.closest('.TaskList__taskContent')
      toDeleteItem.remove();
      const toDeleteID = toDeleteItem.getAttribute('data-id');
      let todoItems = fetchData('todoItems', true);
      todoItems = todoItems.filter(item => item.id !== parseInt(toDeleteID));
      saveToLocalStorage('todoItems', todoItems);
      showEmptyListPic();
    }
  }
}

const fetchTodoListItems = () => {
  const storedTodoItems = fetchData('todoItems', true);
  console.log(storedTodoItems);
  storedTodoItems.map((todoObj) => {
    addListItemstoDOM(todoObj.isCompleted, todoObj.id, todoObj.content);
  });
};

const hideFinishedListItems = () => {
  showHidebutton.classList.toggle('TaskList__link--isActive');
  taskList.classList.toggle('TaskList__list--hideCompleted');
  const isHidden = showHidebutton.classList.contains('TaskList__link--isActive');
  saveToLocalStorage('HideState', isHidden);
}

const themeInit = () => {
  const theme = fetchData('DarkTheme', false) === 'true';
  if(theme === true){
    main.classList.add('App--isDark');
  }
}

const hideInit = () => {
  const hideState = fetchData('HideState', false) === 'true';
  if(hideState === true){
    showHidebutton.classList.add('TaskList__link--isActive');
    taskList.classList.add('TaskList__list--hideCompleted');
  }
  else{
    showHidebutton.classList.remove('TaskList__link--isActive');
    taskList.classList.remove('TaskList__list--hideCompleted');
  }
}

const pageInit = () => {
  themeInit();
  hideInit();
  fetchTodoListItems();
  showEmptyListPic();
}


export {
hideInit, 
themeInit, 
hideFinishedListItems, 
fetchTodoListItems, 
deleteTodoItem, 
listCheckBoxes, 
insertTodoElement, 
toggleDarkTheme, 
showEmptyListPic, 
pageInit };