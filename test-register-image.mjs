import axios from "axios";
import FormData from "form-data";
import fs from "fs";

async function testUserRegisterWithImage() {
  try {
    const formData = new FormData();
    formData.append("firstName", "TestImage");
    formData.append("lastName", "User");
    formData.append("email", "testimage1@example.com");
    formData.append("password", "password123");
    formData.append("role", "USER");
    
    // Create a dummy image file
    fs.writeFileSync("dummy.png", "fake image content");
    formData.append("profileImgUrl", fs.createReadStream("dummy.png"));

    console.log("Sending request to remote backend with image...");
    const res = await axios.post("https://blog-app-backend-1-ry1p.onrender.com/user-api/users", formData, {
      headers: formData.getHeaders(),
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
  } finally {
    if (fs.existsSync("dummy.png")) fs.unlinkSync("dummy.png");
  }
}

testUserRegisterWithImage();
