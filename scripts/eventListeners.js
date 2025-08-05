import { darkModeBtn, searchButton, taskList, showHidebutton } from "./elements";
import { toggleDarkTheme, insertTodoElement, listCheckBoxes, deleteTodoItem, hideFinishedListItems } from "./utils";

export const initListeners = () => {
  darkModeBtn.addEventListener('click', toggleDarkTheme);

  searchButton.addEventListener('click', (event) => insertTodoElement(event));

  taskList.addEventListener('click', (event) => {
    if (event.target.matches('.TaskList__checkboxImg')) {
      listCheckBoxes(event);
    } else if (event.target.matches('.TaskList__deleteIcon')) {
      deleteTodoItem(event);
    }
  });

  showHidebutton.addEventListener('click', hideFinishedListItems);
}