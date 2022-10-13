"use strict";

const getRandom = function () {
  return Math.trunc(Math.random() * 9999999999) + 1;
};

// Add storage
let store = [];

//textarea

function adjustHeight(el) {
  el.style.height =
    el.scrollHeight > el.clientHeight ? el.scrollHeight + "px" : "48px";
}

//Vars

const form = document.querySelector("#task-form");
const taskList = document.querySelector(".collection");
const taskInput = document.querySelector("#task-input");

// Load Tasks

async function getPostsFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const rawPostsArr = await response.json();

  store = await rawPostsArr.map((item) => {
    return {
      innerId: `${getRandom()}`,
      id: item.title,
      body: item.body,
    };
  });
  store?.forEach((post) => {
    templateLiElemForAdd(post);
  });
}
getPostsFromServer();

// Creating templates

const templateLiElemForAdd = function (rawAddPost) {
  // Create li element
  const li = document.createElement("li");
  // Add class
  li.className = `flex items-center rounded-xl justify-between p-3 group bg-white shadow-slate-500 shadow-xl space-x-8 `;

  //Add id

  li.setAttribute("id", `${rawAddPost.innerId}`);

  li.innerHTML = `<div class="flex space-x-2">
 <label
   >${rawAddPost.body}</label
 >
</div>
<div id="3" class="flex gap-4">
           <button
             id="2.5"
             class="reduct-item flex items-center justify-center h-6 w-6 z-0"
           >
             <img
               src="../img/pencil.svg"
               id="1.5"
               class="group-hover:scale-100 bg-pink-300 rounded-md scale-0 z-0 transition-all duration-200  active:bg-pink-600 active:translate-y-0.5"
               alt=""
             />
           </button>
 <button class="delete-item flex items-center justify-center h-6 w-6 z-0">
   <img
     src="../img/delete.svg"
     class=" group-hover:scale-100 bg-pink-300 rounded-md scale-0 z-0 transition-all duration-200 d active:bg--600 active:translate-y-0.5 "
     alt=""
   />
 </button>
</div>`;
  //taskList.appendChild(li);

  const theFirstChild = taskList.firstChild;

  taskList.insertBefore(li, theFirstChild);
};

// Add task event

form.addEventListener("submit", addPostToStore);

// Add Task

async function addPostToStore(e) {
  if (taskInput.value === "") {
    alert("It seems that you forgot to add a post, bro");
  } else {
    e.preventDefault();

    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "foo",
        body: `${taskInput.value}`,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    console.log(response);
    let rawAddPost = await response.json();
    // Random Id

    console.log(rawAddPost);
    const d = new Date();
    let ms = d.valueOf();
    rawAddPost.innerId = `${ms}`;

    console.log(rawAddPost);

    console.log(store.length);

    store.splice(store.length, 0, rawAddPost);

    localStorage.setItem("store", JSON.stringify());

    templateLiElemForAdd(rawAddPost);

    e.preventDefault();
  }

  console.log(store[0]);
  e.preventDefault();
  taskInput.value = "";
  console.log(store);
}

//Remove task event
taskList.addEventListener(`click`, removeTask);

async function removeTask(e) {
  if (e.target.parentElement.classList.contains("delete-item")) {
    if (confirm(`Are you sure, bro?`)) {
      await fetch("https://jsonplaceholder.typicode.com/posts/1", {
        method: "DELETE",
      });

      const id = e.target.parentNode.parentNode.parentNode.id;

      const index = store.map((object) => object.innerId).indexOf(id);

      console.log(index);

      store.splice(index, 1);

      console.log(store);

      e.target.parentElement.parentElement.parentElement.remove();
    }
  }
}

//Reduct task event
taskList.addEventListener(`click`, reductTask);

function reductTask(e) {
  if (e.target.parentElement.classList.contains("reduct-item")) {
    const id = e.target.parentNode.parentNode.parentNode.id;

    let currentTask = store.find((item) => item.innerId == id);

    console.log(currentTask);
    // Create li element
    let li = document.getElementById(`${id}`);

    li.innerHTML = "";

    li.innerHTML = `<div class="flex space-x-2 grow-[1] h-full">
      <label class="flex space-x-2 items-center grow-[1] h-full"
        ><form class="flex space-x-2 grow-[1] h-full" type="submit" id="reductForm"><textarea onMouseOver="adjustHeight(this)" onMouseOut="adjustHeight(this)" class="bg-slate-200 h-full grow-[1] overflow-hidden" type="text" name="text" id="reductText">${currentTask.body}</textarea></form></label
      >
    </div>
    <div id="3" class="flex gap-4 ">
    
      <button
      id="2.7"
      class="done-item flex items-center justify-center h-6 w-6 z-0 type="submit"
    >
      <img
        src="../img/done.svg"
        id="1.7"
        class="group-hover:scale-100 bg-pink-300 rounded-md scale-0 z-0 transition-all duration-200 d active:bg-pink-600 active:translate-y-0.5 "
        alt=""
      />
    </button>
      <button class="delete-item flex items-center justify-center h-6 w-6 z-0">
        <img
          src="../img/delete.svg"
          class=" group-hover:scale-100 bg-pink-300 rounded-md scale-0 z-0 transition-all duration-200 d active:bg-pink-600 active:translate-y-0.5 "
          alt=""
        />
      </button>
    </div>`;

    e.preventDefault();
  }
}

//Done reduct text

taskList.addEventListener(`click`, doneTask);

async function doneTask(e) {
  if (e.target.parentElement.classList.contains("done-item")) {
    const id = e.target.parentNode.parentNode.parentNode.id;

    let currentTask = store.find((item) => item.innerId == id);

    // changed text send to object
    const taskInputCurrent = document.querySelector("#reductText");

    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1",
      {
        method: "PATCH",
        body: JSON.stringify({
          body: taskInputCurrent.value,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const post = await response.json();

    console.log(post);

    currentTask.body = post.body;

    let li = document.getElementById(`${id}`);

    li.innerHTML = "";

    li.innerHTML = `<div class="flex space-x-2">
    <label
      >${post.body}</label
    >
   </div>
   <div id="3" class="flex gap-4">
              <button
                id="2.5"
                class="reduct-item flex items-center justify-center h-6 w-6 z-0"
              >
                <img
                  src="../img/pencil.svg"
                  id="1.5"
                  class="group-hover:scale-100 bg-pink-300 rounded-md scale-0 z-0 transition-all duration-200  active:bg-pink-600 active:translate-y-0.5"
                  alt=""
                />
              </button>
    <button class="delete-item flex items-center justify-center h-6 w-6 z-0">
      <img
        src="../img/delete.svg"
        class=" group-hover:scale-100 bg-pink-300 rounded-md scale-0 z-0 transition-all duration-200 d active:bg--600 active:translate-y-0.5 "
        alt=""
      />
    </button>
   </div>`;
  }
}
