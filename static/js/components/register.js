import navbar from "./navbar.js";
import footerbar from "./footerbar.js";

const CreateUser = Vue.component("CreateUser", {
  template: ` <div>
    <navbar></navbar>
    <div class="login-container" style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #caf7f7;">
    <div class="paper-form-container" style="background-color: #fff; border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); padding: 30px; max-width: 400px; width: 100%;">
        <form @submit.prevent="createUser" class="login-form">
            <h2 class="form-title" style="text-align: center; margin-bottom: 30px; color: #333;">Register</h2>
            <div v-if="msg" class="alert alert-success" role="alert" style="background-color: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                {{ msg }}
            </div>
            <div v-if="error_msg" class="alert alert-danger" role="alert" style="background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                {{ error_msg }}
            </div>
            <div class="form-group" style="margin-bottom: 20px;">
                <label for="username" style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">Username</label>
                <input v-model="Form_Data.username" type="text" class="form-control" id="username" name="username" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                <p class="error" style="color: red; font-size: 14px; margin-top: 5px;" id="username_Error">{{ username_Error }}</p>
            </div>
            <div class="form-group" style="margin-bottom: 20px;">
                <label for="email" style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">Email</label>
                <input v-model="Form_Data.email" type="email" class="form-control" id="email" name="email" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                <p class="error" style="color: red; font-size: 14px; margin-top: 5px;" id="email_Error">{{ email_Error }}</p>
            </div>
            <div class="form-group" style="margin-bottom: 20px;">
                <label for="password" style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">Password</label>
                <input v-model="Form_Data.password" type="password" class="form-control" id="password" name="password" @input="validatePassword" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                <p class="error" style="color: red; font-size: 14px; margin-top: 5px;" id="password_Error">{{ password_Error }}</p>
            </div>
            <div class="reg-btn" style="display: flex; justify-content: space-between;">
                <input type="submit" class="submit-button" value="Register" style="padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; background-color: #007bff; color: #fff; margin-top: 10px;" :disabled="password_Error != ''">
                <input type="reset" class="cancel-button" value="Reset" style="padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; background-color: #EF5350; color: #333; margin-top: 10px;">
            </div>
        </form>
        <div class="text-center" style="margin-top: 20px;">
            <p style="font-size: 16px; color: #333;">Already have an account? <router-link to="/login" style="color: #007bff; text-decoration: none;">Login</router-link></p>
        </div>
    </div>
</div>
<footerbar></footerbar>

  </div>`,
  components: {
    navbar,
    footerbar,
  },
  data() {
    return {
      show_massage: false,
      error_msg: "",
      msg: "",
      Displayform: true,
      Form_Data: {
        username: "",
        email: "",
        image: "",
        password: "",
        password_confirm: "",
      },
      email_Error: "",
      username_Error: "",
       password_Error: "",
    };
  },
  methods: {
    createUser() {
      const data = {
        username: this.Form_Data.username,
        email: this.Form_Data.email,
        image: this.Form_Data.image,
        password: this.Form_Data.password,
      };
      fetch("/registeruser/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else throw new Error("Looks like there's a problem with the API server.");
        })
        .then((data) => {
          this.msg = "Congratulations! Registration completed successfully!";

          setTimeout(() => {
            this.msg = "";
            this.$router.push("/login");
          }, 3000);
        })
        .catch((error) => {
          this.error_msg = "registeration failed!";
          setTimeout(() => {
            this.error_msg = "";
          }, 3000);
        });
    },
    fetchData() {
      fetch(`/createuser/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.userdata = data;
        });
    },
    validatePassword() {
      const password = this.Form_Data.password;
      // Check if the password has a length of at least 8 characters and contains at least one digit
      if (password.length < 6 || !/\d/.test(password)) {
        this. password_Error =
          "Your password must contain at least one digit and be at least 6 characters long.";
      } else {
        this. password_Error = "";
      }
    },
  },
  watch: {
    "Form_Data.username": function (newVal) {
      this.username_Error = this.userdata.some(
        (user) => user.username === newVal
      )
        ? "Sorry, username already in use."
        : "";
    },
    "Form_Data.email": function (newVal) {
      this.email_Error = this.userdata.some((user) => user.email === newVal)
        ? "Sorry, Email already in use."
        : "";
    },
  },
  mounted() {
    this.fetchData();
  },
});

export default CreateUser;
