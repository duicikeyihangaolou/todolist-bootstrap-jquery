const ulTasks = $("#ulTasks");
const btnAdd = $("#btnAdd");
const btnCleanup = $("#btnCleanup");
const inpNewTask = $("#inpNewTask");
const btnRefresh = $("#btnRefresh");
const deleteConfirmButton = $("#delConfirmButton");
const editForm = $("#editForm");

let currentId = "";

const baseApi = "/api/v1/todoelems";

function getRandomString(length) {
  const e = length || 32;
  const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  const a = t.length;
  let n = "";
  for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}

function getLocalStorage(key) {
  const item = localStorage.getItem(key);
  try {
    const { expires, value } = JSON.parse(item);
    if (Date.now() > expires) {
      localStorage.removeItem(key);
      return null;
    }

    return value;
  } catch (e) {
    return item;
  }
}

function setLocalStorage(key, value, maxAge = 864000000, expiry = 0) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        expires: expiry || Date.now() + maxAge,
        value,
      })
    );
  } catch (e) {}
}

function getToken() {
  let token = getLocalStorage("token");
  if (!token) {
    token = getRandomString();
    setLocalStorage("token", token);
  }
  return token;
}

const token = getToken();

function request(url, callback, method = "GET", data = null) {
  const configs = {
    url,
    headers: {
      "X-Auth-Token": token,
    },
    method: method.toUpperCase(),
    dataType: "json",
    contentType: "application/json",
  };
  if (data) {
    configs.data = JSON.stringify(data);
  }
  $.ajax(configs).done(function (data) {
    if (callback) {
      callback(data);
    }
  });
}

function hideAlert() {
  $(".alert").hide();
}

hideAlert();

function alertSuccess(message) {
  $("#alertContent").empty().append(`<strong>${message}</strong>`);
  $(".alert").show();
  window.setTimeout(function () {
    hideAlert();
  }, 4000);
}

function hideDeleteModel() {
  $("#deleteModal").modal("hide");
}

function hideEditModel() {
  $("#editModal").modal("hide");
}

function showEditModel(item) {
  currentId = item.id;
  $("#todoName").val(item.name);
  $("#todoDescription").val(item.description);
  $("#editModal").modal("show");
}

function showDeleteModel(item) {
  currentId = item.id;
  $("#delMessage").text(`确认删除任务 ${item.name} 吗？`);
  $("#deleteModal").modal("show");
}

function getTrForTable(item) {
  const { id, name, description } = item || {};
  const idItem = $("<th>", {
    text: id,
  });
  idItem.attr("scope", "col");

  const nameItem = $("<td>", {
    text: name,
  });
  const descriptionItem = $("<td>", {
    text: description,
  });

  const editButton = $("<button>", {
    class: "btn btn-primary btn-sm",
    type: "button",
  });
  editButton.append('<i class="bi bi-pencil-square"></i>');
  editButton
    .attr("data-toggle", "tooltip")
    .attr("data-placement", "top")
    .attr("title", "编辑")
    .click(() => {
      showEditModel(item);
    });

  const delButton = $("<button>", {
    class: "btn btn-danger btn-sm",
    type: "button",
    id: `del-${id}`,
  });
  delButton.append('<i class="bi bi-trash"></i>');
  delButton
    .attr("data-toggle", "tooltip")
    .attr("data-placement", "top")
    .attr("title", "删除")
    .click((e) => {
      showDeleteModel(item);
    });

  const actionButtons = $("<div>", { class: "action-buttons" });
  actionButtons.append(editButton).append(delButton);

  const actionItem = $("<td>");
  actionItem.append(actionButtons);

  const trItem = $("<tr>");
  trItem.append(idItem).append(nameItem).append(descriptionItem).append(actionItem);
  return trItem;
}

function setTableData(data) {
  const body = $("#tableBody");
  body.empty();
  data.forEach((d) => {
    const tr = getTrForTable(d);
    body.append(tr);
  });
}

function getTaskList() {
  request(baseApi, function (data) {
    console.log(data);
    const { todoelems } = data;
    setTableData(todoelems || []);
  });
}

getTaskList();

function saveTask() {
  if (!currentId) {
    return;
  }
  const url = `${baseApi}/${currentId}`;
  const name = $("#todoName").val();
  const description = $("#todoDescription").val();
  const data = { name, description };
  request(
    url,
    () => {
      hideEditModel();
      getTaskList();
      alertSuccess("更新成功！");
    },
    "put",
    {
      todoelem: data,
    }
  );
}

function deleteTask() {
  if (!currentId) {
    return;
  }
  const url = `${baseApi}/${currentId}`;
  request(
    url,
    () => {
      hideDeleteModel();
      getTaskList();
      alertSuccess("删除成功！");
    },
    "delete"
  );
}

function addTodo(name) {
  const body = {
    todoelem: {
      name,
      description: "new",
    },
  };
  request(
    baseApi,
    () => {
      getTaskList();
    },
    "post",
    body
  );
}

function addItem() {
  const name = inpNewTask.val();
  addTodo(name);
  inpNewTask.val("");
  toggleInputButtons();
}

function toggleInputButtons() {
  btnAdd.prop("disabled", inpNewTask.val() == "");
}

inpNewTask.keypress((e) => {
  if (e.which == 13) addItem();
});
inpNewTask.on("input", toggleInputButtons);

btnAdd.click(addItem);

btnRefresh.click(() => {
  getTaskList();
  btnRefresh.blur();
  alertSuccess('刷新成功！');
});

deleteConfirmButton.click(() => {
  deleteTask();
});

editForm.submit(function (e) {
  e.preventDefault();
  saveTask();
});
