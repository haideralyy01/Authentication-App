async function signup() {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    await axios.post("http://localhost:3000/signup", {
        username: username,
        password: password
    });
    alert("You are signed up");
    document.getElementById("signup-username").value = "";
    document.getElementById("signup-password").value = "";
}

async function signin() {
    const username = document.getElementById("signin-username").value;
    const password = document.getElementById("signin-password").value;

    const response = await axios.post("http://localhost:3000/signin", {
        username: username,
        password: password
    });
    localStorage.setItem("token", response.data.token);

    alert("You are signed in");
    document.getElementById("signin-username").value = "";
    document.getElementById("signin-password").value = "";
    getUserInformation();
}

async function getUserInformation() {
  const token = localStorage.getItem("token");
  const infoDiv = document.getElementById("Information");

  if (!token) {
    infoDiv.innerText = "Not signed in.";
    return;
  }

  try {
    const response = await axios.get("http://localhost:3000/me", {
      headers: {
        token: token
      }
    });
    infoDiv.innerText = "Username: " + response.data.username + " | Password: " + response.data.password;
  } catch (err) {
    console.error(err);
    infoDiv.innerText = "Error fetching user info.";
  }
}

function signout() {
    localStorage.removeItem("token");
    document.getElementById("Information").innerText = "";
    alert("You have signed out");
}
