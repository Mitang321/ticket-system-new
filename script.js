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
      ticketItem.innerHTML = `
            Title: ${title} - Description: ${description} - Priority: ${priority}
            <div class="status">
                <label for="status-select-${Date.now()}">Status:</label>
                <select id="status-select-${Date.now()}" onchange="updateStatus(this)">
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>
        `;

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
  ticketItem.innerHTML += ` - Status: ${status}`;
}
