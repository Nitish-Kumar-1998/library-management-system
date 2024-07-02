const navbar = Vue.component("navbar", {
  template: `
    <div>
      <nav class="navbar navbar-light" style="background-color: #000000;">
        <div class="container justify-content-center"> <!-- Center all content -->
          <h2 style="margin-right: 100px;">
            <span class="navbar-text" style="color: white;"><strong>Library</strong></span>
          </h2>

          <div style="margin-left: 500px;"> <!-- Center buttons -->
            <div class="d-flex">
              <router-link class="nav-link active" to="/home" v-if="token && role==='user'">
                <span class="navbar-text" style="color: white;"><strong>Books</strong></span>
              </router-link>
              <router-link class="nav-link active" to="/allbooks" v-if="token && role==='librarian'">
                <span class="navbar-text" style="color: white;"><strong>All Books</strong></span>
              </router-link>
              <router-link class="nav-link active" to="/my_books" v-if="token && role==='user'">
                <span class="navbar-text" style="color: white;"><strong>mybooks</strong></span>
              </router-link>
              <router-link class="nav-link active" to="/librarian" v-if="token && role==='librarian'">
                <span class="navbar-text" style="color: white;"><strong>Sections</strong></span>
              </router-link>
              <router-link class="nav-link active" to="/requests" v-if="token && role==='librarian'">
                <span class="navbar-text" style="color: white;"><strong>Requests</strong></span>
              </router-link>
              <router-link class="nav-link active" to="/user_statistics" v-if="token && role==='user'">
                <span class="navbar-text" style="color: white;"><strong>Stats</strong></span>
              </router-link>
              <router-link class="nav-link active" to="/librarian_stats" v-if="token && role==='librarian'">
                <span class="navbar-text" style="color: white;"><strong>Stats</strong></span>
              </router-link>
              <router-link v-if="!token" class="nav-link active" to="/login">
                <span class="navbar-text" style="color: white;"><strong>Login</strong></span>
              </router-link>
              <button v-if="token" @click="logout" class="btn btn-link nav-link active">
                <span class="navbar-text" style="color: white;"><i class="fas fa-sign-out-alt"></i><strong>Logout</strong></span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  `,
  data() {
    return {
      token: localStorage.getItem("token") || "",
      role: localStorage.getItem("role") || "",
    };
  },
  methods: {
    logout() {
      // Perform logout actions and remove the token from localStorage
      fetch("/userlogout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Logout unsuccessful. Please try again later.");
          } else {
            return response.json();
          }
        })
        .then((data) => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          this.token = "";
          this.$router.push("/login");
          location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});

export default navbar;
