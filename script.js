document
  .getElementById("submit-ticket-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("ticket-title").value;
    const description = document.getElementById("ticket-description").value;
    const priority = document.getElementById("ticket-priority").value;

    if (title && description && priority) {
      const ticketList = document.getElementById("tickets");

      const ticketItem = document.createElement("li");
      ticketItem.className = "ticket-item";
      ticketItem.innerHTML = `
            <strong>Title:</strong> ${title} - <strong>Description:</strong> ${description} - <strong>Priority:</strong> ${priority}
            <div class="status">
                <label for="status-select-${Date.now()}">Status:</label>
                <select id="status-select-${Date.now()}" onchange="updateStatus(this)">
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>
        `;
      ticketItem.setAttribute("data-priority", priority);
      ticketItem.setAttribute("data-status", "New"); // Default status

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

function showTicketDetails(title, description, priority, status) {
  document.getElementById("details-title").textContent = `Title: ${title}`;
  document.getElementById(
    "details-description"
  ).textContent = `Description: ${description}`;
  document.getElementById(
    "details-priority"
  ).textContent = `Priority: ${priority}`;
  document.getElementById("details-status").textContent = `Status: ${status}`;
  document.getElementById("ticket-details").classList.remove("hidden");
}

document.getElementById("close-details").addEventListener("click", function () {
  document.getElementById("ticket-details").classList.add("hidden");
});
