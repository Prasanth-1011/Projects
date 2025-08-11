document.addEventListener("DOMContentLoaded", () => {
    const Create_Button = document.querySelector(".Create-Button");
    const Input_Field = document.querySelector(".Placeholder");
    const Page = document.querySelector(".Page");
    const Export_Button = document.querySelector(".Export-Button");
    const Import_Button = document.querySelector(".Import-Button");
    const Import_File = document.querySelector(".Import-File");

    let Data = [];

    const saved = localStorage.getItem("Bookmarks_Data");
    if (saved) {
        try {
            Data = JSON.parse(saved);
            Data.forEach(renderContainer);
        } catch {
            Data = [];
        }
    }

    function sync() {
        localStorage.setItem("Bookmarks_Data", JSON.stringify(Data));
    }

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
        delBtn.addEventListener("click", () => {
            Data = Data.filter(c => c.id !== cont.id);
            container.remove();
            sync();
        });

        head.append(heading, delBtn);

        const bookmarkList = document.createElement("ul");
        bookmarkList.className = "BookmarkList";

        cont.bookmarks.forEach(b => createBookmarkElement(b, bookmarkList, cont));

        const insertBtn = document.createElement("button");
        insertBtn.className = "Insert";
        insertBtn.textContent = "Add Bookmark";

        insertBtn.addEventListener("click", () => {
            if (container.querySelector(".AddForm")) return;

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

            if (bookmarkList.children.length > 0) {
                bookmarkList.appendChild(li);
            } else {
                bookmarkList.insertBefore(li, bookmarkList.firstChild);
            }

            nameInput.focus();

            cancelBtn.addEventListener("click", () => li.remove());

            saveBtn.addEventListener("click", () => {
                const name = nameInput.value.trim();
                const url = urlInput.value.trim();
                if (!name || !url) return alert("Enter valid name and URL.");
                const bookmark = { id: Date.now(), name, url };
                cont.bookmarks.push(bookmark);
                li.remove();
                createBookmarkElement(bookmark, bookmarkList, cont);
                sync();
            });
        });

        container.append(head, bookmarkList, insertBtn);
        Page.appendChild(container);
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
        editBtn.title = "Edit bookmark";

        const removeBtn = document.createElement("span");
        removeBtn.className = "material-symbols-outlined";
        removeBtn.textContent = "remove";
        removeBtn.style.color = "red";
        removeBtn.title = "Remove bookmark";

        row.append(anchor, editBtn, removeBtn);
        li.appendChild(row);
        bookmarkList.appendChild(li);

        removeBtn.addEventListener("click", () => {
            cont.bookmarks = cont.bookmarks.filter(x => x.id !== b.id);
            li.remove();
            sync();
        });

        editBtn.addEventListener("click", () => {
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

            cancelBtn.addEventListener("click", () => {
                nameInput.remove();
                urlInput.remove();
                controls.remove();
                row.style.display = "flex";
            });

            saveBtn.addEventListener("click", () => {
                const newName = nameInput.value.trim();
                const newUrl = urlInput.value.trim();
                if (!newName || !newUrl) return alert("Both fields are required.");
                b.name = newName;
                b.url = newUrl;
                anchor.textContent = b.name;
                anchor.href = b.url;
                sync();
                nameInput.remove();
                urlInput.remove();
                controls.remove();
                row.style.display = "flex";
            });
        });
    }

    Create_Button.addEventListener("click", () => {
        const title = Input_Field.value.trim();
        if (!title) return alert("Please Enter Group Title.");
        if (Data.some(c => c.title === title)) {
            alert("Group With This Title Already Exists.");
            return;
        }
        const newGroup = { id: Date.now(), title, bookmarks: [] };
        Data.push(newGroup);
        renderContainer(newGroup);
        Input_Field.value = "";
        sync();
    });

    Input_Field.addEventListener("keydown", function (event) {
        if (event.key === "Enter") Create_Button.click();
    });

    Export_Button.addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(Data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Bookmark-Manager-Backup.json";
        a.click();
        URL.revokeObjectURL(url);
    });

    Import_Button.addEventListener("click", () => Import_File.click());

    Import_File.addEventListener("change", (e) => {
        const File = e.target.files[0];
        if (!File) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const Imported_Data = JSON.parse(reader.result);
                if (Array.isArray(Imported_Data)) {
                    Data = Imported_Data;
                    Page.innerHTML = "";
                    Data.forEach(renderContainer);
                    sync();
                    alert("Import Successful!");
                } else {
                    alert("Invalid Data Format!");
                }
            } catch {
                alert("Failed To Parse JSON!");
            }
        };
        reader.readAsText(File);
        Import_File.value = null;
    });
});