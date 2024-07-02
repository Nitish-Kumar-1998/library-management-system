import navbar from "./navbar.js";
import footerbar from "./footerbar.js";
const Login = Vue.component("login", {
  template: `
    <div>
    <navbar></navbar>
    <div class="login-container" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div v-if="Displayloginform" class="login-form-container" style="background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 40px; width: 400px;">
            <div class="login-form-wrapper">
                <h2 class="form-title" style="font-size: 24px; font-weight: 600; margin-bottom: 30px; text-align: center;">Welcome back!</h2>
                <div v-if="show_massage" class="alert alert-danger" role="alert" style="margin-bottom: 20px;">
                    {{ massage }}
                </div>
                <form @submit.prevent="login" class="login-form">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label for="username" class="form-label" style="font-size: 14px; font-weight: 500; color: #333; margin-bottom: 8px;">Username</label>
                        <input type="text" class="form-control" id="username" name="username" v-model="username" required style="display: block; width: 100%; padding: 12px 16px; font-size: 16px; line-height: 1.5; color: #495057; background-color: #fff; border: 1px solid #ced4da; border-radius: 4px; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;" />
                    </div>
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label for="password" class="form-label" style="font-size: 14px; font-weight: 500; color: #333; margin-bottom: 8px;">Password</label>
                        <input type="password" class="form-control" id="password" name="password" v-model="password" required style="display: block; width: 100%; padding: 12px 16px; font-size: 16px; line-height: 1.5; color: #495057; background-color: #fff; border: 1px solid #ced4da; border-radius: 4px; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;" />
                    </div>
                    <div class="form-actions" style="text-align: center;">
                        <button type="submit" class="submit-button" style="display: block; width: 100%; padding: 12px 16px; font-size: 16px; font-weight: 500; color: #fff; background-color: #007bff; border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.15s ease-in-out;">Login</button>
                    </div>
                </form>
                <div class="form-actions" style="text-align: center; margin-top: 20px;">
                    <p>Don't have an account? <router-link to="/register" style="color: #007bff; text-decoration: none;">Register</router-link></p>
                </div>
                <div class="form-actions" style="text-align: center;">
                    <p>Forgot password? <button class="reset-password-link" @click="showreset" style="background: none; border: none; color: #007bff; cursor: pointer; text-decoration: underline;">Click here</button></p>
                </div>
            </div>
        </div>
        <div v-if="isRestModal_Visible" class="custom-modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;">
            <div class="custom-modal" style="background-color: #fff; border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%;">
                <div class="modal-header" style="padding: 20px; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; align-items: center;">
                    <h5 class="modal-title" style="margin: 0; color: #333;">Update Password</h5>
                    <span @click="closeRModal" class="close-btn" style="cursor: pointer; font-size: 24px; color: #aaa;">&times;</span>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <form @submit.prevent="resetpassword">
                        <title>Reset Password</title>
                        <label for="email" class="form-label form-lable-update" style="margin-bottom: 10px; display: block; font-weight: bold;">Email:</label>
                        <input type="email" class="form-control" placeholder="Email" v-model="Form_Data.email" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
                        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                            <button type="submit" class="submit-button" style="padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; background-color: #007bff; color: #fff;">Reset</button>
                            <button type="button" @click="closeRModal" class="cancel-button" style="padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; background-color: #ccc; color: #333;">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div v-if="isModal_Visible" class="custom-modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;">
            <div class="custom-modal" style="background-color: #fff; border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%;">
                <div class="modal-header" style="padding: 20px; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; align-items: center;">
                    <h5 class="modal-title" style="margin: 0; color: #333;">Update Password</h5>
                    <span @click="closeModal" class="close-btn" style="cursor: pointer; font-size: 24px; color: #aaa;">&times;</span>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <form @submit.prevent="updateprofilepassword">
                        <title>Update Password</title>
                        <label for="otp" class="form-label form-lable-update" style="margin-bottom: 10px; display: block; font-weight: bold;">Verification code:</label>
                        <input type="text" class="form-control" placeholder="Verification code" v-model="user_otp" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                        <label for="password" class="form-label form-lable-update" style="margin-top: 10px; display: block; font-weight: bold;">New Password:</label>
                        <input type="password" class="form-control" @input="validatePassword" placeholder="Password" v-model="Form_Data.password" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                        <p class="error" style="color: red; font-size: 14px; margin-top: 5px;" id="password_Error">{{ password_Error }}</p>
                        <label for="confirmPassword" class="form-label form-lable-update" style="margin-top: 10px; display: block; font-weight: bold;">Confirm Password:</label>
                        <input type="password" class="form-control" placeholder="Confirm Password" v-model="Form_Data.confirmPassword" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                            <button type="submit" class="submit-button" :disabled="password_Error != ''" style="padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; background-color: #007bff; color: #fff;">Update</button>
                            <button type="button" @click="closeModal" class="cancel-button" style="padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; background-color: #ccc; color: #333;">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <footerbar></footerbar>
    </div>
    

  
        `,
  components: {
    navbar,
    footerbar,
  },
  data() {
    return {
      showroutes: true,
      show_massage: false,
      massage: "",
      create: false,
      username: "",
      password: "",
      authenticated: false,
      Displayloginform: true,
      password_Error: "",
      user_otp: "",
      otp: "",
      Form_Data: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      isModal_Visible: false,
      isRestModal_Visible: false,
    };
  },

  methods: {
    resetpassword() {
      fetch(`/resetpassword`, {
        method: "POST",
        body: JSON.stringify(this.Form_Data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Sorry, couldn't find the user.");
          }
        })
        .then((data) => {
          if (data.message == "Sorry, couldn't find the user.!") {
            alert("Sorry, couldn't find the user.");
            return;
          } else {
            this.otp = data.otp;
            alert("The reset code has been sent to the email associated with your account");
            this.closeRModal();
            this.isModal_Visible = true;
          }
        })
        .catch((error) => {
          alert("Resetting password unsuccessful.");
          this.user = {};
        });
    },
    closeRModal() {
      // Hide the modal when the "Cancel" button is clicked
      this.isRestModal_Visible = false;
    },
    closeModal() {
      // Hide the modal when the "Cancel" button is clicked
      this.isModal_Visible = false;
    },
    updateprofilepassword() {
      if (this.user_otp != this.otp) {
        alert("The verification code provided is not valid.");
        return;
      }
      if (this.Form_Data.password != this.Form_Data.confirmPassword) {
        alert("Passwords don't match. Please re-enter.");
        return;
      }

      fetch(`/resetpassword`, {
        method: "PUT",
        body: JSON.stringify(this.Form_Data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Sorry, couldn't find the user.");
          }
        })
        .then((data) => {
          if (data.message == "Sorry, couldn't find the user.!") {
            alert("Sorry, couldn't find the user.");
            return;
          } else {
            this.Form_Data.email = "";
            this.Form_Data.password = "";
            this.Form_Data.confirmPassword = "";
            this.user_otp = "";
            alert("Your password has been successfully updated.");
            this.closeModal();
          }
        })
        .catch((error) => {
          alert("Unable to change password.");
        });
    },
    showreset() {
      // Show the modal when the "Update" button is clicked
      this.isRestModal_Visible = true;
    },
    showUploadForm() {
      // Show the modal when the "Update" button is clicked
      this.isModal_Visible = true;
    },
    login() {
      const payload = {
        username: this.username,
        password: this.password,
      };
      fetch("/user_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("The entered username or password is incorrect.");
          }
        })
        .then((data) => {
          if (data.message == "Sorry, couldn't find the user.!") {
            this.show_massage = true;
            setTimeout(() => {
              this.show_massage = false;
            }, 3000);
            this.massage = data.message;
          }
          if (data.message == "Wrong Password") {
            this.show_massage = true;
            setTimeout(() => {
              this.show_massage = false;
            }, 3000);
            this.massage = data.message;
          } else {
            if (data.token) {
              localStorage.setItem("token", data.token);
              localStorage.setItem("role", data.role);
              if (data.role == "admin") {
                this.$router.push("/admin");
              }
              if (data.role == "librarian") {
                this.$router.push("/librarian");
              }
              if (data.role == "user") {
                this.$router.push("/home");
              }
            }
          }
        })
        .catch((error) => {
          this.show_massage = true;
          setTimeout(() => {
            this.show_massage = false;
          }, 3000);
          this.massage = "The entered username or password is incorrect.";
          console.error(error);
        });
    },
    validatePassword() {
      const password = this.Form_Data.password;
      // Check if the password has a length of at least 8 characters and contains at least one digit
      if (password.length < 6 || !/\d/.test(password)) {
        this.  password_Error =
          "Your password must contain at least one digit and be at least 6 characters long.";
      } else {
        this.  password_Error = "";
      }
    },
  },
});

export default Login;
