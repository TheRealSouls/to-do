// variable declarations
let moonSun = document.querySelector(".fa-moon");

let darkModeBtn = document.getElementById("dark-mode") || null;
let darkModeOn = JSON.parse(localStorage.getItem("darkModeOn"));

moonSun.classList = darkModeOn ? 'fa-regular fa-sun fa-2x' : 'fa-regular fa-moon fa-2x';

let searchBox = document.getElementById("search-input");
let addBtn = document.getElementById("add-task");
let taskModal = document.getElementById("task-dialog");
let taskForm = document.getElementById("form");
let taskInput = document.getElementById("task-input");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let ding = new Audio('Check-mark-ding-sound-effect.mp3');



if (JSON.parse(localStorage.getItem("darkModeOn"))) {
    document.documentElement.style.setProperty('--white', '#242424');
    document.documentElement.style.setProperty("--black", "#f7f7f7");
} else {
    document.documentElement.style.setProperty('--white', '#f7f7f7');
    document.documentElement.style.setProperty("--black", "#242424");
}

// render tasks into HTML
const renderTasks = () => {
    document.getElementById("tasks-list").innerHTML = tasks.map((task, index) => {
        return `
        <label for="checkbox" id=${index}>
            <input type="checkbox" name="checkbox" id="checkbox" class="${index}" ${(task.checked) ? "checked" : ""}>
            <li data-index="${index}">${task.taskName}</li>
        </label>`
    }).join("");
    document.querySelectorAll("label input[type='checkbox']").forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            tasks[Number(checkbox.classList.value)].checked = checkbox.checked;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            if (checkbox.checked) {
                playDing();
            }
        });
    });
    document.querySelectorAll("label li").forEach((text) => {
        text.addEventListener("click", (e) => {
            const index = e.target.getAttribute('data-index');
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        });
    })
}
// play a ding sound on checkbox
const playDing = () => {
    const clone = ding.cloneNode();
    clone.volume = 0.4;
    clone.play();
};
// moon transition on hover
darkModeBtn.addEventListener("mouseover", () => {
    moonSun.classList.remove("fa-regular");
    moonSun.classList.add("fa-solid");
});
// moon transition on hover out
darkModeBtn.addEventListener("mouseout", () => {
    moonSun.classList.remove("fa-solid");
    moonSun.classList.add("fa-regular");
});
// changing root variables on dark mode button clicked, to transition into dark mode
darkModeBtn.addEventListener("click", () => {
    const currentBgColor = getComputedStyle(document.documentElement).getPropertyValue('--white').trim();
    if (currentBgColor === '#f7f7f7') {
        document.documentElement.style.setProperty('--white', '#242424');
        document.documentElement.style.setProperty("--black", "#f7f7f7");
        moonSun.classList = 'fa-regular fa-sun fa-2x';
        localStorage.setItem("darkModeOn", JSON.stringify(true));
    } else {
        document.documentElement.style.setProperty('--white', '#f7f7f7');
        document.documentElement.style.setProperty("--black", "#242424");
        moonSun.classList = 'fa-regular fa-moon fa-2x';
        localStorage.setItem("darkModeOn", JSON.stringify(false));
    }
});
// search engine code
searchBox.addEventListener("input", (e) => {
    const filter = e.target.value.toLowerCase();
    const items = document.querySelectorAll("#tasks-list label");
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(filter)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    })
});

// add task function: prompt user for name of task, add new object to array, set to localStorage API and re-render tasks

const addTask = () => {
    taskModal.showModal();
    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (taskInput.value) {
            tasks.push({
                taskName: taskInput.value,
                checked: false
            });
            localStorage.setItem("tasks", JSON.stringify(tasks));
            taskInput.value = "";
            renderTasks();
        }
        taskModal.close();
    })
}

renderTasks();
