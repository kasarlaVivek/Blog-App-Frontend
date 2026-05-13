import axios from "axios";
import FormData from "form-data";

async function testUserRegister() {
  try {
    const formData = new FormData();
    formData.append("firstName", "Test");
    formData.append("lastName", "User");
    formData.append("email", "test500@example.com");
    formData.append("password", "password123");
    formData.append("role", "USER");

    console.log("Sending request to remote backend...");
    const res = await axios.post("https://blog-app-backend-1-ry1p.onrender.com/user-api/users", formData, {
      headers: formData.getHeaders(),
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
  }
}

testUserRegister();
