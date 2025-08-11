const noteTemplate = document.querySelector(".Note");
noteTemplate.style.display = "none";

const notesSection = document.querySelector(".Notes-Section");
const addNoteBtn = document.querySelector(".Add-Note");
const addPage = document.querySelector(".Add-Page");
const editPage = document.querySelector(".Edit-Page");

const inputText = document.querySelector(".Input-Text");
const inputTextarea = document.querySelector(".Input-Textarea");
const insertBtn = document.querySelector(".Insert");

const editText = document.querySelector(".Edit-Text");
const editTextarea = document.querySelector(".Edit-Textarea");
const changeBtn = document.querySelector(".Change");

const cancelBtns = document.querySelectorAll(".Cancel");

let currentEditIndex = null;

addNoteBtn.addEventListener("click", () => {
    inputText.value = "";
    inputTextarea.value = "";
    addPage.style.display = "flex";
    inputText.focus();
});

cancelBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        addPage.style.display = "none";
        editPage.style.display = "none";
    });
});

insertBtn.addEventListener("click", () => {
    const title = inputText.value.trim();
    const content = inputTextarea.value.trim();

    if (!title || !content) {
        alert("Both title and content are required.");
        return;
    }

    const notes = getNotes();
    notes.push({ title, content });
    saveNotes(notes);
    renderNotes();
    addPage.style.display = "none";
});

changeBtn.addEventListener("click", () => {
    const newTitle = editText.value.trim();
    const newContent = editTextarea.value.trim();

    if (!newTitle || !newContent) {
        alert("Both fields are required.");
        return;
    }

    const notes = getNotes();
    if (currentEditIndex !== null && notes[currentEditIndex]) {
        notes[currentEditIndex] = { title: newTitle, content: newContent };
        saveNotes(notes);
        renderNotes();
        editPage.style.display = "none";
    }
});

function getNotes() {
    return JSON.parse(localStorage.getItem("keep_notes")) || [];
}

function saveNotes(notes) {
    localStorage.setItem("keep_notes", JSON.stringify(notes));
}

function renderNotes() {
    notesSection.innerHTML = "";

    const notes = getNotes();

    notes.forEach((note, index) => {
        const clone = noteTemplate.cloneNode(true);
        clone.style.display = "flex";
        clone.querySelector(".Title").textContent = note.title;
        clone.querySelector(".Contents").textContent = note.content;

        const editBtn = clone.querySelector(".Edit");
        const deleteBtn = clone.querySelector(".Delete");

        editBtn.addEventListener("click", () => {
            currentEditIndex = index;
            editText.value = note.title;
            editTextarea.value = note.content;
            editPage.style.display = "flex";
        });

        deleteBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this note?")) {
                notes.splice(index, 1);
                saveNotes(notes);
                renderNotes();
            }
        });

        notesSection.appendChild(clone);
    });
}

renderNotes();
