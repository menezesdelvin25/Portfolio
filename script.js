
const control_of_admin_btn = document.getElementById("admin-btn");
const control_of_admin_login_section = document.getElementById("admin-login");
const control_of_user_responses_section = document.getElementById("user-responses");

control_of_admin_btn.addEventListener('click', function(e) {
  e.preventDefault(); // Prevents jumping to the top of the page
  control_of_admin_login_section.style.display = "block"; 
});

const control_of_toggle_btn = document.getElementById("toggle-theme");
control_of_toggle_btn.addEventListener('click', function() {
  document.body.classList.toggle("dark-theme");
});

const db_url = "https://script.google.com/macros/s/AKfycbz4pvSqdRvi7JJi0DMppNrqRFnY7kC0VFkYnEFdgFynnWM24maCv2JHgcMsBrY3Oo7LBA/exec";

const control_of_contact_form = document.getElementById("contact-form");
control_of_contact_form.addEventListener("submit", async function(event) {
  event.preventDefault(); // CRITICAL: prevents page reload

  let name = document.getElementById("input-name").value;
  let email = document.getElementById("input-email").value;
  let msg = document.getElementById("input-msg").value;

  try {
    let response = await fetch(db_url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "save_message", name, email, msg })
    });
    
    let result = await response.json();
    if (result.success) {
      alert("Message submitted, will get back to you shortly!");
      control_of_contact_form.reset(); // Clear form after success
    } else {
      alert("Message could not be saved!");
    }
  } catch(error) {
    console.error(error);
    alert("There was a problem submitting the message!");
  }
});

let control_of_admin_form = document.getElementById("admin-form");
control_of_admin_form.addEventListener("submit", async function(event) {
  event.preventDefault(); // CRITICAL: prevents page reload

  let username = document.getElementById("input-username").value;
  let password = document.getElementById("input-password").value;
  
  try {
    let response = await fetch(db_url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "login", username, password })
    });

    let result = await response.json();
    if (result.success) {
      alert("Login Successful!");
      control_of_admin_login_section.style.display = "none"; 
      control_of_user_responses_section.style.display = "block"; 
      getUserMessages();
    } else {
      alert("Access denied, please try again!");
    }
  } catch(error) {
    console.error(error);
    alert("There was a problem logging in!");
  }
});

async function getUserMessages() {
  try {
    let response = await fetch(db_url);
    let result = await response.json();

    if(!result.success) {
      alert("Could not fetch the messages.");
      return; 
    }

    const control_of_user_messages_div = document.getElementById("user-messages");
    control_of_user_messages_div.innerHTML = ""; // Clear existing messages before appending

    result.messages.forEach(response => {
      let control_of_new_div = document.createElement("div");
      control_of_new_div.classList.add("section-item"); // Apply CSS styling to messages

      control_of_new_div.innerHTML = `
        <p><strong>Name:</strong> ${response.name}</p>
        <p><strong>Email:</strong> ${response.email}</p>
        <p><strong>Message:</strong> ${response.msg}</p>
        <p><strong>Date:</strong> ${response.date}</p>
      `;
      control_of_user_messages_div.appendChild(control_of_new_div);
    });
  } catch(error) {
    console.error(error);
    alert("There was a problem fetching messages from DB!");
  }
}
