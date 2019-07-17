
let db;

(function() {
  'use strict';
  console.info('loaded');

  const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

  if (!indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB. The application with therefore not work");
  }

  //  open DB
  const request = indexedDB.open('AccessibilityBasics', 1);
  request.onupgradeneeded = event => {
    console.info('upgrade');
    db = event.target.result;
    db.createObjectStore('toDoList', { autoIncrement: true, keyPath: 'id' });
  };

  request.onsuccess = event => {
    console.info('success');
    db = event.target.result;
    getList();
  };

  request.onerror = event => {
    console.error(event);
    alert('Epic fail: Something terrible has happened');
  };

  // enable / disable submit button
  document.getElementById('submit').disabled = true;
  document.getElementById('inputField').onkeyup = checkValidity;

})();

function addToList(event) {
  'use strict';
  event.preventDefault();
  const inputField = document.getElementById('inputField');
  const item = inputField.value;
  const payload = {
    item: item,
    completed: false
  };
  const objectStore = db.transaction(['toDoList'], 'readwrite').objectStore('toDoList');
  const result = objectStore.add(payload);
  result.onsuccess = event => {
    payload.key = event.target.result;
    addToListView(payload);
    inputField.value = null;
  };
}

function getList() {
  'use strict';
  // Reset Lists
  document.getElementById('list').innerHTML = null;
  document.getElementById('completed').innerHTML = null;

  // Get list from DB
  const objectStore = db.transaction(['toDoList'], 'readwrite').objectStore('toDoList');
  objectStore.openCursor().onsuccess = event => {
    var cursor = event.target.result;
    if (!cursor) { return; }
    // Add incomplete items to checkbox list
    if (cursor.value.completed === false) {
      const item = cursor.value;
      item.key = cursor.key;
      addToListView(item);
    } else {
      // Add completed items to completed list
      const item = cursor.value;
      item.key = cursor.key;
      addToCompletedView(item);
    }
    cursor.continue();
  };
}

function addToListView(todo) {
  'use strict';
  // create wrapper
  const listItem = document.createElement('li');
  // create checkbox
  const _todo = document.createElement('label');
  _todo.setAttribute('class', 'label');
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('data-key', todo.key);
  // add onclick to checkbox
  checkbox.onclick = completeItem;
  // finish building checkbox field
  _todo.append(checkbox);
  _todo.append(todo.item);

  // add checkbox to listItem
  //  add wrapper div to wrapper
  listItem.append(_todo);
  document.getElementById('list').append(listItem);
}

function addToCompletedView(done) {
  'use strict';
  // create wrapper
  const listItem = document.createElement('li');
  listItem.setAttribute('class', 'completed-item');
  // create checkbox
  const _done = document.createElement('label');
  _done.setAttribute('class', 'label');
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('data-key', done.key);
  checkbox.onclick = resetItem;
  checkbox.checked = true;
  _done.append(checkbox);
  _done.append(done.item);
  listItem.append(_done);
  // add delete button
  const button = document.createElement('button');
  button.setAttribute('data-key', done.key);
  button.setAttribute('class', 'delete');
  button.setAttribute('aria-label', `delete todo item: ${done.item}`);
  button.onclick = deleteItem;
  listItem.append(button);
  document.getElementById('completed').append(listItem);
}

function completeItem(event) {
  'use strict';
  //  Get element key
  const key = Number(event.srcElement.dataset.key);
  // Set item to completed
  const objectStore = db.transaction(['toDoList'], 'readwrite').objectStore('toDoList');
  objectStore.get(key).onsuccess = event => { 
    const todo = event.target.result;
    todo.completed = true;
    // Rebuild list
    objectStore.put(todo).onsuccess = event => getList();
  };
}

function resetItem(event) {
  'use strict';
  //  Get element key
  const key = Number(event.srcElement.dataset.key);
  // Set item to completed
  const objectStore = db.transaction(['toDoList'], 'readwrite').objectStore('toDoList');
  objectStore.get(key).onsuccess = event => { 
    const todo = event.target.result;
    todo.completed = false;
    // Rebuild list
    objectStore.put(todo).onsuccess = event => getList();
  };
}

function deleteItem(event) {
  'use strict';
  // Get element key
  const key = Number(event.srcElement.dataset.key);
  const request = db.transaction(['toDoList'], 'readwrite').objectStore('toDoList').delete(key);
  // Delete and rebuild list
  request.onsuccess = event => {
    document.getElementById('deleteSuccess').style.display = 'flex';
    getList();

    
    // Timer to close delete notication
    setTimeout(() => {
      dismissAlert();
    }, 500);


  };
}

function checkValidity(event) {
  'use strict';
  const fieldValue = document.getElementById('inputField').value;
  document.getElementById('submit').disabled = !fieldValue;
}

function dismissAlert() {
  const deleteSuccessContainer = document.getElementById('deleteSuccess');
  deleteSuccessContainer.classList.add('hide-delete-success');
  setTimeout(() => {
    deleteSuccessContainer.style.display = 'none';
    deleteSuccessContainer.classList.remove('hide-delete-success');
  }, 250);
}