let allTasks = [];
let valueInput = '';
let input = null;
const url = 'http://localhost:8000';

window.onload = async function init () {
  input = document.getElementById('add-task');
  input.addEventListener('change', updateValue);
  const resp = await fetch(`${url}/allTasks`, {
    method: 'GET'
  });
  const result = await resp.json();
  allTasks = result;
  render();
}
const updateValue = (event) => {
  valueInput = event.target.value;
}

const onClickButton = async () => {
  const resp = await fetch(`${url}/createTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false
    })
  });
  const result = await resp.json();
  allTasks.push(result);
  valueInput = '';
  input.value = '';
  render();
}

const render = () => {
  const content = document.getElementById('content-page');

  while(content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks
  .sort((a, b) => {
    if (a.isCheck === b.isCheck) return 0;
    return (a.isCheck > b.isCheck ? 1 : -1);
  })
  .map((item, index) => {
    const {_id, text, isCheck} = item;
    const id = _id;
    const container = document.createElement('div');
    container.id = `task-${index}`;
    container.className = 'task-container';
    content.appendChild(container);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCheck;
    checkbox.onchange = () => {
      if (checkbox.checked) {
        container.removeChild(imageEdit);
      } else {
        container.appendChild(imageEdit);
      }
      onChangeCheckbox(index);
    }
    container.appendChild(checkbox);
    const textP = document.createElement('p');
    textP.id = `text-${id}`;
    textP.innerText = text;
    textP.className = checkbox.checked ? 'text-task done-text' : 'text-task';
    container.appendChild(textP);
    const imageEdit = document.createElement('img');
    imageEdit.src = 'img/edit-icon-image-0.jpg';
    container.appendChild(imageEdit);
    imageEdit.onclick = () => { 
      container.removeChild(textP);
      onclickEdit(text, container, id);
    }
    const imageDelete = document.createElement('img');
    imageDelete.src = 'img/download.jpeg';
    container.appendChild(imageDelete);
    imageDelete.onclick = () => {
      onclickDelete(id);
    }
  });
}

const onChangeCheckbox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  render();
}

const onclickDelete = async (id) => {
  const resp = await fetch(`${url}/deleteTask?id=${id}`, {
    method: 'DELETE'
  });
  const result = await resp.json();
  allTasks = result;
  render();
}

const onclickEdit = (text, container, id) => {
  const newText = document.createElement('input');
  newText.value = text;
  newText.id = `textId-${id}`;
  container.appendChild(newText);
  const editButton = document.createElement('img');
  editButton.src = 'img/ok.png';
  container.appendChild(editButton);
  editButton.onclick = () => {
    editTask(id);
  }
};

const editTask = async (id) => {
  const newText = document.getElementById(`textId-${id}`);
  const resp = await fetch(`${url}/updateTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: newText.value,
      isCheck: false,
      _id: id
    })
  });
  const result = await resp.json();
  allTasks = result;
  render();
}

