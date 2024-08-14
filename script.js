let loggedInUser = null;
const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user1", password: "user123", role: "user" },
];

document
  .getElementById("auth-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("auth-username").value;
    const password = document.getElementById("auth-password").value;

    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      loggedInUser = user;
      document.getElementById("auth").classList.add("hidden");
      document.getElementById("app").classList.remove("hidden");
      if (loggedInUser.role === "admin") {
        document.getElementById("ticket-form").classList.remove("hidden");
      } else {
        document.getElementById("ticket-form").classList.add("hidden");
      }
      displayTickets();
    } else {
      alert("Invalid username or password");
    }
  });

document
  .getElementById("switch-auth")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const heading = document.getElementById("auth-heading");
    if (heading.textContent === "Login") {
      heading.textContent = "Register";
      document.querySelector("#auth-form button").textContent = "Register";
      document.getElementById("switch-auth").textContent =
        "Already have an account? Login";
    } else {
      heading.textContent = "Login";
      document.querySelector("#auth-form button").textContent = "Login";
      document.getElementById("switch-auth").textContent =
        "Don't have an account? Register";
    }
  });

document
  .getElementById("submit-ticket-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("ticket-title").value;
    const description = document.getElementById("ticket-description").value;
    const priority = document.getElementById("ticket-priority").value;

    if (title && description && priority && loggedInUser) {
      const ticketList = document.getElementById("tickets");

      const ticketItem = document.createElement("li");
      ticketItem.className = `ticket-item ${
        loggedInUser.role === "admin" ? "admin-only" : "normal-only"
      }`;
      ticketItem.innerHTML = `
            <strong>Title:</strong> ${title} - <strong>Description:</strong> ${description} - <strong>Priority:</strong> ${priority}
            ${
              loggedInUser.role === "admin"
                ? `
                <div class="status">
                    <label for="status-select-${Date.now()}">Status:</label>
                    <select id="status-select-${Date.now()}" onchange="updateStatus(this)">
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>`
                : ""
            }
        `;
      ticketItem.setAttribute("data-priority", priority);
      ticketItem.setAttribute("data-status", "New");
      ticketItem.setAttribute("data-user", loggedInUser.username);

      ticketItem.addEventListener("click", function () {
        showTicketDetails(title, description, priority, "New");
      });

      ticketList.appendChild(ticketItem);

      // Clear the form
      document.getElementById("ticket-title").value = "";
      document.getElementById("ticket-description").value = "";
      document.getElementById("ticket-priority").value = "Low";
    }
  });

function updateStatus(selectElement) {
  const status = selectElement.value;
  const ticketItem = selectElement.parentElement.parentElement;
  ticketItem.setAttribute("data-status", status);
  ticketItem.innerHTML += ` - Status: ${status}`;
}

document.getElementById("apply-filters").addEventListener("click", function () {
  const priorityFilter = document.getElementById("filter-priority").value;
  const statusFilter = document.getElementById("filter-status").value;

  const tickets = document.querySelectorAll("#tickets .ticket-item");

  tickets.forEach((ticket) => {
    const ticketPriority = ticket.getAttribute("data-priority");
    const ticketStatus = ticket.getAttribute("data-status");

    if (
      (priorityFilter === "" || priorityFilter === ticketPriority) &&
      (statusFilter === "" || statusFilter === ticketStatus)
    ) {
      ticket.style.display = "";
    } else {
      ticket.style.display = "none";
    }
  });
});

function displayTickets() {
  const ticketList = document.getElementById("tickets");
  ticketList.innerHTML = "";

  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

  tickets.forEach((ticket) => {
    const ticketItem = document.createElement("li");
    ticketItem.className = `ticket-item ${
      ticket.role === "admin" ? "admin-only" : "normal-only"
    }`;
    ticketItem.innerHTML = `
            <strong>Title:</strong> ${
              ticket.title
            } - <strong>Description:</strong> ${
      ticket.description
    } - <strong>Priority:</strong> ${ticket.priority}
            ${
              ticket.role === "admin"
                ? `
                <div class="status">
                    <label for="status-select-${Date.now()}">Status:</label>
                    <select id="status-select-${Date.now()}" onchange="updateStatus(this)">
                        <option value="New" ${
                          ticket.status === "New" ? "selected" : ""
                        }>New</option>
                        <option value="In Progress" ${
                          ticket.status === "In Progress" ? "selected" : ""
                        }>In Progress</option>
                        <option value="Resolved" ${
                          ticket.status === "Resolved" ? "selected" : ""
                        }>Resolved</option>
                    </select>
                </div>`
                : ""
            }
        `;
    ticketItem.setAttribute("data-priority", ticket.priority);
    ticketItem.setAttribute("data-status", ticket.status);
    ticketItem.setAttribute("data-user", ticket.user);

    ticketItem.addEventListener("click", function () {
      showTicketDetails(
        ticket.title,
        ticket.description,
        ticket.priority,
        ticket.status
      );
    });

    ticketList.appendChild(ticketItem);
  });
}

function showTicketDetails(title, description, priority, status) {
  const detailsSection = document.getElementById("ticket-details");
  detailsSection.classList.remove("hidden");

  document.getElementById("details-title").textContent = `Title: ${title}`;
  document.getElementById(
    "details-description"
  ).textContent = `Description: ${description}`;
  document.getElementById(
    "details-priority"
  ).textContent = `Priority: ${priority}`;
  document.getElementById("details-status").textContent = `Status: ${status}`;
}

document.getElementById("close-details").addEventListener("click", function () {
  document.getElementById("ticket-details").classList.add("hidden");
});
