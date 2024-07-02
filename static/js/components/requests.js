import navbar from "./navbar.js";
import footerbar from "./footerbar.js";

const requests = Vue.component("requests", {
  template: `
    <div>
    <navbar></navbar>
        <div class="container">
            <h2 class="form-title">Book Requests</h2>
            <h6 class="form-title" v-if="no_requests">No Pending Requests</h6>
          <table class="table table-striped" v-else>
            <thead>
              <tr>
                <th scope="col">Book Name</th>
                <th scope="col">Section</th>
                <th scope="col">Author</th>
                <th scope="col">Status</th>
                <th scope="col">Return Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in books">
                <td v-if="book.request_status=='pending'" @click="showreqdetails(book)">{{book.name}}</td>
                <td>{{book.section}}</td>
                <td>{{book.author}}</td>
                <td>{{book.request_status}}</td>
                <td>{{formatDate(book.request_returnDate)}}</td>
                <td>
                <button type="submit" class="submit-button" @click="submitApproval(book.rid)">Grant</button>
                <button type="button" class="cancel-button" @click="reject(book.rid)">Reject</button>
                </td>
              </tr>
            </tbody>
            </table>

            <h2 class="form-title">Approved Books</h2>
            <h6 class="form-title" v-if="no_approved">No Approved Books</h6>
          <table class="table table-striped" v-else>
            <thead>
              <tr>
                <th scope="col">Book Name</th>
                <th scope="col">Section</th>
                <th scope="col">Author</th>
                <th scope="col">User</th>
                <th scope="col">Return Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in approved_Books">
                <td v-if="book.request_status=='approved'" @click="showreqdetails(book)">{{book.name}}</td>
                <td>{{book.section}}</td>
                <td>{{book.author}}</td>
                <td>{{book.username}}</td>
                <td>{{formatDate(book.request_returnDate)}}</td>
                <td>
                <button type="button" class="warn-button" @click="revoke(book)">Revoke</button>
                </td>
              </tr>
            </tbody>
            </table>

          
            <div class="model" v-if="DisplaydetailsForm">
                <div  class="paper1-form-container">
                    <div style="display:flex; justify-content:space-between;">
                    <h2 class="form-title">Request Details</h2>
                    <button class="cancel-button" @click="DisplaydetailsForm = false">X</button>
                    </div>
                    <h6 class="form-title">{{selected_Books.username}}</h6>
                    <h6 class="form-title">{{selected_Books.name}}</h6>
                    <h6 class="form-title">{{selected_Books.author}}</h6>
                    <h6 class="form-title">{{selected_Books.section}}</h6>
                    <h6 class="form-title">{{formatDate(selected_Books.request_returnDate)}}</h6>

                    <form @submit.prevent="submitApproval(selected_Books.rid)" class="login-form">
                        <div class="text-center">
                        <button type="submit" class="submit-button">Grant</button>
                        <button type="button" class="cancel-button" @click="reject(selected_Books.rid)">Reject</button>
                        <button type="button" class="warn-button" @click="DisplayPdf(selected_Books)">ViewBook</button>
                        </div>
                    </form>
                </div>
            </div>

            
            <div class="modeling" v-if="DisplayPdf">
                <div class="pdf-container">
                <iframe :src="book_content" width="200%" height="600px" frameborder="0"></iframe>
                    <button @click="DisplayPdf = false" class="cancel-button">Close</button>
                </div>
            </div>

        </div>
        <footerr></footerr>
    </div>
    `,
  components: {                                 // Added navbar and footerbar components
    navbar,
    footerbar,
  },
  data() {
    return {
      books: [],
      approved_Books: [],
      DisplaydetailsForm: false,
      selected_Books: {},
      DisplayPdf: false,
      no_requests: false,
      no_approved: false,
    };
  },
  mounted() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    } else {
      this.getBooks();
    }
  },
  methods: {
    showreqdetails(book) {
      this.DisplaydetailsForm = true;
      this.selected_Books = book;
    },
    DisplayPdf(book) {
      this.DisplayPdf = true;
      this.book_content = book.content;
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };                     // Added to format the date
      const formattedDate = new Date(dateString).toLocaleDateString(
        undefined,
        options
      );
      return formattedDate;
    },
    getBooks() {
      fetch("/bookrequests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.books = data.filter((book) => book.request_status === "pending");
          this.approved_Books = data.filter(
            (book) => book.request_status === "approved"
          );
          if (this.books.length === 0) {
            this.no_requests = true;
          } else {
            this.no_requests = false;
          }
          if (this.approved_Books.length === 0) {
            this.no_approved = true;
          } else {
            this.no_approved = false;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    submitApproval(id) {
      if (!confirm("Confirm that you want to approve this request.")) return;
      fetch("/bookrequests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ request_status: "approved", bookrequest_id: id }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.DisplaydetailsForm = false;
          alert(data.message);
          this.getBooks();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    reject(id) {
      if (!confirm("Confirm that you want to reject this request.")) return;
      fetch("/bookrequests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ request_status: "rejected", bookrequest_id: id }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          this.getBooks();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    revoke(book) {
      if (!confirm("Confirm that you want to revoke this request.")) return;
      fetch("/bookrequests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ request_status: "revoked", bookrequest_id: book.rid }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          this.getBooks();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
});
export default requests;
