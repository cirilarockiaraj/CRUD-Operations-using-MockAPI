const api_base_url = "https://6aee997da677fe0fc14ff607.mockapi.io/api/v1";
const form = document.querySelector("#userDetails");
const table_body = document.querySelector("#table-body");
const spinner = document.querySelector("#spinner");

//update in form
async function readData() {
  try {
    spinner.style.display = "block";
    const res = await fetch(`${api_base_url}/users`);
    const users = await res.json();
    return users;
  } catch (error) {
    alert(error);
    console.error(error);
  } finally {
    spinner.style.display = "none";
  }
}

async function readDataById(id) {
  try {
    const res = await fetch(`${api_base_url}/users/${id}`);
    const user = await res.json();
    return user;
  } catch (error) {
    alert(error);
    console.error(error);
  }
}

async function userDetails() {
  const users = await readData();
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone_num}</td>
                    <td><button onclick="editUser(${user.id})" class="btn btn-edit">Edit</button> <button onclick="deleteUser(${user.id})" class="btn btn-delete">Delete</button></td>`;
    table_body.appendChild(row);
  });
}
userDetails();

async function editUser(id) {
  const user = await readDataById(id);
  form.id.value = user.id;
  form.name.value = user.name;
  form.email.value = user.email;
  form.phone.value = user.phone_num;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = form.id.value;
  const name = form.name.value;
  const email = form.email.value;
  const phone = form.phone.value;

  const user_req = {
    name: name,
    email: email,
    phone_num: phone,
  };

  if (id) {
    try {
      const res = await fetch(`${api_base_url}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user_req),
      });

      const user = await res.json();
      if (user) {
        alert("User detail updated successfully...");
      }
    } catch (excp) {
      console.error(excp);
      alert(error);
    }
  } else {
    try {
      const res = await fetch(`${api_base_url}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user_req),
      });

      const user = await res.json();
      if (user) {
        alert("New user added successfully...");
      }
    } catch (excp) {
      alert(excp);
      console.error(excp);
    }
  }
  form.reset();
  table_body.innerHTML = "";
  userDetails();
});

async function deleteUser(id) {
  try {
    if (confirm(`Do you want to delete this user ${id}`)) {
      const res = await fetch(`${api_base_url}/users/${id}`, {
        method: "DELETE",
      });

      const user = await res.json();
      if (user) {
        alert("User deleted successfully...");
      }
    }
  } catch (excp) {
    console.error(excp);
    alert(excp);
  }

  form.reset();
  table_body.innerHTML = "";
  userDetails();
}
