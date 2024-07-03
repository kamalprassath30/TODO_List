const inputTitle = document.getElementById('addTitle');
const inputContent = document.getElementById('addContent');
const section = document.querySelector('.section-1');
const noteContainer = document.getElementById('noteContainer');
const modal = document.getElementById('modal');
const addModal = document.getElementById('addModal');
const editTitle = document.getElementById('editTitle');
const editContent = document.getElementById('editContent');
const btnSaveEdit = document.getElementById('btnSaveEdit');
const btnShow = document.getElementById('btnShow');
const btnClose = document.querySelector('.close');
const searchInput = document.getElementById('searchInput');
const btnSearch = document.getElementById('btnSearch');
const btnAdd = document.getElementById('btnAdd');
const btnAddClose = document.querySelector('.addClose');
const btnIncomplete = document.getElementById('incomplete');
const deleteAll = document.getElementById('deleteAll');

let id;
let completed = false;
let notes = JSON.parse(localStorage.getItem('notes')) || [];
if (notes.length == 0) {
    id = 1;
}
else {
    id = notes[notes.length - 1].id + 1;
}

// SAVE ITEMS
function saveItems() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// SHOW BUTTON
btnShow.addEventListener('click', function () {
    if (notes.length === 0) {
        alert("There are no tasks to display!");
    }
    else {
        renderNotes();
    }
});

// btnAddTask.addEventListener('click', addNote);
btnSaveEdit.addEventListener('click', saveEdit);
// btnSearch.addEventListener('click', searchNotes);
btnAdd.addEventListener('click', addNote);

// ADD TASK BUTTON
const btnAddTask = document.getElementById('btnAddTask').addEventListener('click', openAddTaskModal);
function openAddTaskModal() {
    addModal.style.display = 'block';
    btnAddClose.addEventListener('click', function () {
        addModal.style.display = 'none';
    })
}

function addNote() {
    const title = inputTitle.value.trim();
    const content = inputContent.value.trim();

    if (!title) {
        alert('Please add a title for your note.');
        return;
    }

    const note = {
        id: id++,
        title,
        content,
        completed,
    };
    notes.push(note);
    saveItems();
    renderNotes();
    inputTitle.value = '';
    inputContent.value = '';
    addModal.style.display = 'none';
}

function renderNotes() {
    renderFilteredNotes(notes);
}

function renderFilteredNotes(filteredNotes) {
    noteContainer.innerHTML = '';
    filteredNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
            <div class="noteInfo ${note.completed ? 'completed' : ''}">
                <div class="noteId">Task: ${note.id}</div>
                <div class="noteTitle">Title: ${note.title}</div>
                <div class="noteContent">${note.content}</div>
            </div>
            <div class="noteButtons">
                <input type="checkbox" class="checkBtn" data-id="${note.id}" ${note.completed ? 'checked' : ''}>
                <button class="btnEdit" data-id="${note.id}">🖊️</button>
                <button class="btnDelete" data-id="${note.id}">❌</button>
            </div>
        `;
        noteContainer.appendChild(noteElement);
    });

    addNoteEventListeners();
}

function addNoteEventListeners() {
    const btnsCheck = document.querySelectorAll('.checkBtn');
    const btnsEdit = document.querySelectorAll('.btnEdit');
    const btnsDelete = document.querySelectorAll('.btnDelete');

    btnsCheck.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const checked = notes.find(note => note.id === id);
            checked.completed = !checked.completed;
            saveItems();
            renderNotes();
        });
    });

    btnsEdit.forEach(btn => {
        btn.addEventListener('click', openEditModal);
    });

    btnsDelete.forEach(btn => {
        btn.addEventListener('click', deleteNote);
    });
}

function openEditModal(event) {
    const id = parseInt(event.target.getAttribute('data-id'));
    const noteToEdit = notes.find(note => note.id === id);
    modal.style.display = 'block';
    editTitle.value = noteToEdit.title;
    editContent.value = noteToEdit.content;
    btnSaveEdit.setAttribute('data-id', id);

    btnClose.addEventListener('click', function () {
        modal.style.display = 'none';
    })
}

function saveEdit(event) {
    const id = parseInt(event.target.getAttribute('data-id'));
    const editedNoteIndex = notes.findIndex(note => note.id === id);
    notes[editedNoteIndex].title = editTitle.value.trim();
    notes[editedNoteIndex].content = editContent.value.trim();
    saveItems();
    renderNotes();
    modal.style.display = 'none';
}

function deleteNote(event) {
    const id = parseInt(event.target.getAttribute('data-id'));
    notes = notes.filter(note => note.id !== id);
    saveItems();
    renderNotes();
}

searchInput.addEventListener('input', searchNotes);
function searchNotes() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredNotes = notes.filter(note => note.title.toLowerCase().includes(searchTerm));
    renderFilteredNotes(filteredNotes);
}

btnIncomplete.addEventListener('click', completedTasks);
function completedTasks() {
    let done = [];
    done = notes.filter(note => note.completed !== true);
    renderFilteredNotes(done);
}

deleteAll.addEventListener('click', function () {
    notes = [];
    renderFilteredNotes(notes);
})

window.onclick = function (event) {
    event.preventDefault();
    if (event.target === modal || event.target === addModal) {
        modal.style.display = 'none';
        addModal.style.display = 'none';
    }
};

window.onload = function () {
    section.classList.add('onload');
}
