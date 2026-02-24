var contacts = [];
var editIndex = -1;
var dragFrom = null;

function loadFromStorage() {
  try {
    var saved = localStorage.getItem("aarnaContacts");
    if (saved) {
      contacts = JSON.parse(saved);
    }
  } catch (e) {
    contacts = [];
  }
}

function saveToStorage() {
  try {
    localStorage.setItem("aarnaContacts", JSON.stringify(contacts));
  } catch (e) {
    console.log("Could not save to localStorage");
  }
}

function showContacts() {
  var search = document.getElementById("searchInput").value.toLowerCase();
  var list = document.getElementById("contactList");
  var count = document.getElementById("contactCount");

  count.textContent = "Total Contacts: " + contacts.length;
  list.innerHTML = "";

  var found = 0;

  for (var i = 0; i < contacts.length; i++) {
    var c = contacts[i];

    var matchName = c.name.toLowerCase().indexOf(search) >= 0;
    var matchEmail = c.email.toLowerCase().indexOf(search) >= 0;

    if (!matchName && !matchEmail) continue;

    found++;

    var box = document.createElement("div");
    box.className = "contact-box";
    box.setAttribute("draggable", "true");
    box.dataset.index = i;

    box.innerHTML =
      "<p><strong>Name:</strong> " + c.name + "</p>" +
      "<p><strong>Email:</strong> " + c.email + "</p>" +
      "<p><strong>Phone Number:</strong> " + c.phone + "</p>" +
      "<button onclick='handleEdit(" + i + ")'>Edit</button>" +
      "<button class='del-btn' onclick='handleDelete(" + i + ")'>Delete</button>";

    box.addEventListener("dragstart", function () {
      dragFrom = parseInt(this.dataset.index);
    });

    box.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.classList.add("drag-over");
    });

    box.addEventListener("dragleave", function () {
      this.classList.remove("drag-over");
    });

    box.addEventListener("drop", function (e) {
      e.preventDefault();
      this.classList.remove("drag-over");
      var dragTo = parseInt(this.dataset.index);

      if (dragFrom !== null && dragFrom !== dragTo) {
        var temp = contacts[dragFrom];
        contacts[dragFrom] = contacts[dragTo];
        contacts[dragTo] = temp;
        saveToStorage();
        showContacts();
      }
    });

    list.appendChild(box);
  }

  if (contacts.length === 0) {
    list.innerHTML = "<p style='color:#999;'>No contacts yet. Add one above!</p>";
  } else if (found === 0) {
    list.innerHTML = "<p style='color:#999;'>No contacts match your search.</p>";
  }
}

function handleAdd() {
  var name = document.getElementById("nameInput").value.trim();
  var email = document.getElementById("emailInput").value.trim();
  var phone = document.getElementById("phoneInput").value.trim();
  var err = document.getElementById("errorMsg");

  if (name === "" || email === "" || phone === "") {
    err.textContent = "All fields are required!";
    return;
  }

  err.textContent = "";

  if (editIndex === -1) {
    contacts.push({ name: name, email: email, phone: phone });
  } else {
    contacts[editIndex].name = name;
    contacts[editIndex].email = email;
    contacts[editIndex].phone = phone;
    editIndex = -1;
    document.getElementById("formTitle").textContent = "Add New Contact";
    document.getElementById("addBtn").textContent = "Add Contact";
    document.getElementById("cancelBtn").style.display = "none";
  }

  saveToStorage();
  clearForm();
  showContacts();
}

function handleEdit(i) {
  document.getElementById("nameInput").value = contacts[i].name;
  document.getElementById("emailInput").value = contacts[i].email;
  document.getElementById("phoneInput").value = contacts[i].phone;

  editIndex = i;

  document.getElementById("formTitle").textContent = "Edit Contact";
  document.getElementById("addBtn").textContent = "Save Changes";
  document.getElementById("cancelBtn").style.display = "inline-block";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleDelete(i) {
  contacts.splice(i, 1);
  saveToStorage();
  showContacts();
}

function handleCancel() {
  editIndex = -1;
  clearForm();
  document.getElementById("formTitle").textContent = "Add New Contact";
  document.getElementById("addBtn").textContent = "Add Contact";
  document.getElementById("cancelBtn").style.display = "none";
  document.getElementById("errorMsg").textContent = "";
}

function clearForm() {
  document.getElementById("nameInput").value = "";
  document.getElementById("emailInput").value = "";
  document.getElementById("phoneInput").value = "";
}

document.getElementById("searchInput").addEventListener("input", showContacts);

loadFromStorage();
showContacts();