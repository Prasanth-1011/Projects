// --- Firebase Config ---
const firebaseConfig = {
    apiKey: "AIzaSyCiQwsujO92qoPlrMzHsE_zXNsdbtntCu4",
    authDomain: "bookmarks-860.firebaseapp.com",
    projectId: "bookmarks-860",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// --- Elements ---
const loginBtn = document.getElementById("login");
const signupBtn = document.getElementById("signup");
const logoutBtn = document.getElementById("logout");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const authSection = document.getElementById("AuthSection");

const Create_Button = document.querySelector(".Create-Button");
const Input_Field = document.querySelector(".Placeholder");
const Page = document.querySelector(".Page");
const Export_Button = document.querySelector(".Export-Button");
const Import_Button = document.querySelector(".Import-Button");
const Import_File = document.querySelector(".Import-File");
const TasksSection = document.querySelector(".Create-Tasks");

const ids = ['login', 'signup', 'logout'];
let maxWidth = 0;

ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        const width = el.offsetWidth;
        if (width > maxWidth) maxWidth = width;
    }
});

ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.style.width = `${maxWidth}px`;
    }
});

let Data = [];
let userId = null;
const BACKEND = "http://localhost:3000";

// --- Auth Handlers ---
loginBtn.onclick = () => {
    const email = emailInput.value;
    const pass = passwordInput.value;
    auth.signInWithEmailAndPassword(email, pass)
        .catch(err => alert(err.message));
};

signupBtn.onclick = () => {
    const email = emailInput.value;
    const pass = passwordInput.value;
    auth.createUserWithEmailAndPassword(email, pass)
        .catch(err => alert(err.message));
};

logoutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(async (user) => {
    if (user) {
        userId = user.uid;
        emailInput.style.display = passwordInput.style.display = loginBtn.style.display = signupBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
        TasksSection.style.display = "flex";
        loadUserData();
    } else {
        userId = null;
        Page.innerHTML = "";
        TasksSection.style.display = "none";
        logoutBtn.style.display = "none";
        emailInput.style.display = passwordInput.style.display = loginBtn.style.display = signupBtn.style.display = "inline-block";
    }
});

// --- Data Load/Save ---
async function loadUserData() {
    const res = await fetch(`${BACKEND}/groups/${userId}`);
    Data = await res.json();
    Page.innerHTML = "";
    Data.forEach(renderContainer);
}

async function sync() {
    for (const group of Data) {
        if (group._id) {
            await fetch(`${BACKEND}/groups/${group._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(group),
            });
        }
    }
}

// --- Render & Interact ---
function renderContainer(cont) {
    const container = document.createElement("div");
    container.className = "Container";

    const head = document.createElement("div");
    head.className = "Head";

    const heading = document.createElement("div");
    heading.textContent = cont.title;

    const delBtn = document.createElement("span");
    delBtn.className = "material-symbols-outlined";
    delBtn.textContent = "delete";
    delBtn.title = "Delete group";
    delBtn.onclick = async () => {
        await fetch(`${BACKEND}/groups/${cont._id}`, { method: 'DELETE' });
        Data = Data.filter(c => c._id !== cont._id);
        container.remove();
    };

    head.append(heading, delBtn);

    const bookmarkList = document.createElement("ul");
    bookmarkList.className = "BookmarkList";

    cont.bookmarks.forEach(b => createBookmarkElement(b, bookmarkList, cont));

    const insertBtn = document.createElement("button");
    insertBtn.className = "Insert";
    insertBtn.textContent = "Add Bookmark";
    insertBtn.onclick = () => addBookmarkUI(cont, bookmarkList);

    container.append(head, bookmarkList, insertBtn);
    Page.appendChild(container);
}

function addBookmarkUI(cont, bookmarkList) {
    if (document.querySelector(".AddForm")) return;

    const li = document.createElement("li");
    li.className = "AddForm";

    const nameInput = document.createElement("input");
    const urlInput = document.createElement("input");
    nameInput.placeholder = "Bookmark Name";
    urlInput.placeholder = "Bookmark URL";
    nameInput.className = urlInput.className = "BookmarkInput";

    const saveBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    cancelBtn.textContent = "Cancel";

    const controls = document.createElement("div");
    controls.className = "EditControls";
    controls.append(saveBtn, cancelBtn);
    li.append(nameInput, urlInput, controls);
    bookmarkList.appendChild(li);

    cancelBtn.onclick = () => li.remove();

    saveBtn.onclick = async () => {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        if (!name || !url) return alert("Enter valid name and URL.");
        const bookmark = { id: Date.now(), name, url };
        cont.bookmarks.push(bookmark);
        await sync();
        li.remove();
        createBookmarkElement(bookmark, bookmarkList, cont);
    };
}

function createBookmarkElement(b, bookmarkList, cont) {
    const li = document.createElement("li");
    const row = document.createElement("div");
    row.className = "BookmarkRow";

    const anchor = document.createElement("a");
    anchor.href = b.url;
    anchor.textContent = b.name;
    anchor.target = "_blank";

    const editBtn = document.createElement("span");
    editBtn.className = "material-symbols-outlined";
    editBtn.textContent = "edit";

    const removeBtn = document.createElement("span");
    removeBtn.className = "material-symbols-outlined";
    removeBtn.textContent = "remove";
    removeBtn.style.color = "red";

    row.append(anchor, editBtn, removeBtn);
    li.appendChild(row);
    bookmarkList.appendChild(li);

    removeBtn.onclick = async () => {
        cont.bookmarks = cont.bookmarks.filter(x => x.id !== b.id);
        await sync();
        li.remove();
    };

    editBtn.onclick = () => {
        if (li.querySelector(".BookmarkInput")) return;

        row.style.display = "none";
        const nameInput = document.createElement("input");
        const urlInput = document.createElement("input");
        nameInput.value = b.name;
        urlInput.value = b.url;
        nameInput.className = urlInput.className = "BookmarkInput";

        const saveBtn = document.createElement("button");
        const cancelBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        cancelBtn.textContent = "Cancel";

        const controls = document.createElement("div");
        controls.className = "EditControls";
        controls.append(saveBtn, cancelBtn);
        li.append(nameInput, urlInput, controls);

        cancelBtn.onclick = () => {
            nameInput.remove();
            urlInput.remove();
            controls.remove();
            row.style.display = "flex";
        };

        saveBtn.onclick = async () => {
            const newName = nameInput.value.trim();
            const newUrl = urlInput.value.trim();
            if (!newName || !newUrl) return alert("Both fields required.");
            b.name = newName;
            b.url = newUrl;
            await sync();
            anchor.textContent = newName;
            anchor.href = newUrl;
            nameInput.remove();
            urlInput.remove();
            controls.remove();
            row.style.display = "flex";
        };
    };
}

Create_Button.onclick = async () => {
    const title = Input_Field.value.trim();
    console.log("Create button clicked with title:", title);
    console.log("User ID:", userId);

    if (!title) {
        alert("Enter group title.");
        return;
    }

    if (Data.some(c => c.title === title)) {
        alert("Group already exists.");
        return;
    }

    const newGroup = {
        userId,
        title,
        bookmarks: []
    };

    console.log("Sending to backend:", newGroup);

    const res = await fetch(`${BACKEND}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGroup)
    });

    if (res.ok) {
        console.log("Group created");
        loadUserData();
        Input_Field.value = "";
    } else {
        console.error("Failed to create group", await res.text());
        alert("Failed to create group");
    }
};
// Code Changed Here

Export_Button.onclick = () => {
    const blob = new Blob([JSON.stringify(Data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Bookmark-Manager-Backup.json";
    a.click();
    URL.revokeObjectURL(url);
};

Import_Button.onclick = () => Import_File.click();

Import_File.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
        try {
            const importedData = JSON.parse(reader.result);
            if (Array.isArray(importedData)) {
                for (let g of importedData) {
                    g.userId = userId;
                    await fetch(`${BACKEND}/groups`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(g)
                    });
                }
                loadUserData();
                alert("Import successful");
            } else {
                alert("Invalid format");
            }
        } catch {
            alert("Failed to parse");
        }
    };
    reader.readAsText(file);
};
