document.addEventListener("DOMContentLoaded", () => {
    const Create_Button = document.querySelector(".Create-Button");
    const Input_Field = document.querySelector(".Placeholder");
    const Page = document.querySelector(".Page");
    const Export_Button = document.querySelector(".Export-Button");
    const Import_Button = document.querySelector(".Import-Button");
    const Import_File = document.querySelector(".Import-File");

    Input_Field.focus();
    Input_Field.addEventListener('focus', function () {
        Input_Field.placeholder = "";
    });

    Input_Field.addEventListener('blur', function () {
        Input_Field.placeholder = "Create New Task";
    });

    let Data = [];

    const saved = localStorage.getItem("Tasks_Data");
    if (saved) {
        try {
            Data = JSON.parse(saved);
            Data.forEach(renderContainer);
        } catch {
            Data = [];
        }
    }

    function sync() {
        localStorage.setItem("Tasks_Data", JSON.stringify(Data));
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
        delBtn.title = "Delete container";
        delBtn.addEventListener("click", () => {
            Data = Data.filter(c => c.id !== cont.id);
            container.remove();
            sync();
        });

        head.append(heading, delBtn);

        const addTasks = document.createElement("div");
        addTasks.className = "Add-Tasks";

        cont.tasks.forEach(t => createTaskElement(t, addTasks, cont));

        const insertBtn = document.createElement("button");
        insertBtn.className = "Insert";
        insertBtn.textContent = "Add Task";
        insertBtn.addEventListener("click", () => {
            const t = { id: Date.now(), text: "", done: false };
            cont.tasks.push(t);
            createTaskElement(t, addTasks, cont);
            sync();
        });

        container.append(head, addTasks, insertBtn);
        Page.appendChild(container);
    }

    function createTaskElement(t, addTasks, cont) {
        const taskDiv = document.createElement("div");
        taskDiv.className = "Task";

        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.value = t.text;
        if (t.done) {
            taskInput.classList.add("done");
            taskInput.style.textDecoration = "line-through";
            taskInput.style.color = "gray";
        }
        taskInput.placeholder = "Task description...";
        taskInput.addEventListener("input", () => {
            t.text = taskInput.value;
            sync();
        });

        const check = document.createElement("span");
        check.className = "material-symbols-outlined";
        check.textContent = "check_circle";
        check.style.color = t.done ? "gray" : "green";
        check.title = t.done ? "Mark as incomplete" : "Mark as complete";
        check.addEventListener("click", () => {
            t.done = !t.done;
            if (t.done) {
                taskInput.classList.add("done");
                check.style.color = "gray";
                check.title = "Mark as incomplete";
            } else {
                taskInput.classList.remove("done");
                check.style.color = "green";
                check.title = "Mark as complete";
            }
            sync();
        });

        const rm = document.createElement("span");
        rm.className = "material-symbols-outlined";
        rm.textContent = "remove";
        rm.style.color = "red";
        rm.title = "Remove task";
        rm.addEventListener("click", () => {
            cont.tasks = cont.tasks.filter(x => x.id !== t.id);
            taskDiv.remove();
            sync();
        });

        taskDiv.append(taskInput, check, rm);
        addTasks.appendChild(taskDiv);
    }

    Input_Field.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            Create_Button.click();
        }
    });

    Create_Button.addEventListener("click", () => {
        const title = Input_Field.value.trim();

        if (!title) return alert("Please Enter Task Title.");
        if (Data.some(c => c.title === title)) {
            alert("Container With This Title Already Exists.");
            return;
        }
        const newContainer = { id: Date.now(), title, tasks: [] };
        Data.push(newContainer);
        renderContainer(newContainer);
        Input_Field.value = "";
        sync();
    });

    Export_Button.addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(Data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Task-Manager-Backup.json";
        a.click();
        URL.revokeObjectURL(url);
    });

    Import_Button.addEventListener("click", () => {
        Import_File.click();
    });

    Import_File.addEventListener("change", (e) => {
        const File = e.target.Files[0];
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
