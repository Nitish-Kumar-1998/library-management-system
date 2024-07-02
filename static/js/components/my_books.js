import navbar from "./navbar.js";
import footerbar from "./footerbar.js";

const my_books = Vue.component("my_books", {
  template: `
    <div>
    <navbar></navbar>
        <div class="container">
            <h2 class="form-title">My Books</h2>
            <h6 class="form-title" v-if="books.length==0">No Books</h6>
            <table class="table table-striped" v-else>
            <thead>
              <tr>
                <th scope="col">Book Name</th>
                <th scope="col">Return Date</th>
                <th scope="col">Section</th>
                <th scope="col">Author</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in books">
                <td v-if="book.request_status=='pending'">{{book.name}}</td>
                <td v-if="book.request_status=='approved'" 
                style="color:blue; text-decoration:underline; cursor:poiner;"
                @click="DisplayPdf(book)"
                >{{book.name}}
                </td>
                <td>{{formatDate(book.request_returnDate)}}</td>
                <td>{{book.section}}</td>
                <td>{{book.author}}</td>
                <td>
                <button class="cancel-button" @click="returnBook(book)" v-if="book.request_status=='approved'">Return</button>
                <button class="cancel-button" @click="returnBook(book)" v-if="book.request_status=='pending'" enabled>Return</button>
                </td>
              </tr>
            </tbody>
            </table>


            <h2 class="form-title">Completed Books</h2>
            <h6 class="form-title" v-if="retunred_Books.length==0">No Books</h6>
            <table class="table table-striped" v-else>
            <thead>
              <tr>
                <th scope="col">Book Name</th>
                <th scope="col">Section</th>
                <th scope="col">Author</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in retunred_Books">
                <td>{{book.name}}</td>
                <td>{{book.section}}</td>
                <td>{{book.author}}</td>
                <td>
                <button class="warn-button" style="background-color: green; color: white;" @click="showdetails(book)">view</button>

                <button class="warn-button" @click="rate(book)">Rate</button>
                </td>
              </tr>
            </tbody>
            </table>

    </div>

            <div class="model" v-if="DisplaydetailsForm" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
  <div class="paper1-form-container" style="background-color: #d7f6f6;; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); padding: 32px; width: 80%; max-width: 600px;">
    <div class="details-form-wrapper" style="background-color: #d7f6f6; border-radius: 8px; padding: 24px;">
      <div class="details-form-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 class="form-title" style="font-weight: bold;">Details</h2>
        <button class="cancel-button" @click="DisplaydetailsForm = false" style="background-color: red; border: none; font-size: 24px; cursor: pointer;">X</button>
      </div>
      <div class="details-form-content" style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 16px;">
        <div class="details-form-item" style="padding: 12px; background-color: #fff; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h6 class="form-title" style="font-weight: bold; margin-bottom: 8px;">Author:</h6>
          <p>{{ selected_Books.author }}</p>
        </div>
        <div class="details-form-item" style="padding: 12px; background-color: #fff; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h6 class="form-title" style="font-weight: bold; margin-bottom: 8px;">Section:</h6>
          <p>{{ selected_Books.section }}</p>
        </div>
        <div class="details-form-item" style="padding: 12px; background-color: #fff; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h6 class="form-title" style="font-weight: bold; margin-bottom: 8px;">Returned Date:</h6>
          <p>{{ formatDate(selected_Books.request_returnDate) }}</p>
        </div>
        <div class="details-form-item" style="padding: 12px; background-color: #fff; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h6 class="form-title" style="font-weight: bold; margin-bottom: 8px;">Status:</h6>
          <p>{{ selected_Books.request_status }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
          
            <div class="modeling" v-if="DisplayPdf">
                <div class="pdf-container">
                <iframe :src="book_content" width="200%" height="600px" frameborder="0"></iframe>
                    <button @click="DisplayPdf = false" class="cancel-button">Close</button>
                </div>
                

                <div class="rating">
                <h2 class="form-card-title">Ratings</h2>
                <h6 class="form-title
                " v-if="rating_data.length==0">No Ratings</h6>
                <div class="rating-container" v-else>
                    <div v-for="rate in rating_data">
                    <h6 class="form-title
                    ">{{rate.book_comment}}</h6>
                    <h6 class="form-title
                    ">{{rate.rating}}</h6>
                </div>
            </div>
        </div>
        </div>
        <div class="modeling" v-if="show_Rate">
        <div class="paper-form-container" style="background-color: #d7f6f6;">
          <div class="rating-form-wrapper" style="background-color: #d7f6f6;">
            <div class="rating-form-header" style="background-color: #d7f6f6;">
              <h2 class="form-title">Share Your Thoughts</h2>
            </div>
            <form @submit.prevent="rateBook" class="rating-form" style="background-color: #d7f6f6;">
              <div class="rating-section" style="background-color: #d7f6f6;">
                <div class="rating-label" style="background-color: #d7f6f6;">How would you rate this book?</div>
                <div class="rating-input" style="background-color: #d7f6f6;">
                  <input
                    type="number"
                    class="form-control"
                    v-model="rating"
                    value="1"
                    placeholder="Rate (1-5)"
                    min="1"
                    max="5"
                    required
                    style="background-color: #fff;"
                  />
                </div>
              </div>
              <div class="review-section" style="background-color: #d7f6f6;">
                <div class="review-label" style="background-color: #d7f6f6;">Share your review:</div>
                <div class="review-input" style="background-color: #d7f6f6;">
                  <textarea
                    class="review-textarea"
                    v-model="book_comment"
                    placeholder="Write your review here..."
                    required
                    style="background-color: #fff;"
                  ></textarea>
                </div>
              </div>
              <div class="form-actions" style="background-color: #d7f6f6;">
                <button type="submit" class="submit-button" style="background-color: #58D68D;">Submit</button>
                <button type="button" class="cancel-button" @click="show_Rate = false" style="background-color: red;">
                  Cancel
                </button>
              </div>
            </form>
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
      books: [],
      retunred_Books: [],
      DisplayPdf: false,
      book_content: "",
      DisplaydetailsForm: false,
      selected_Books: {},
      show_Rate: false,
      rating: 0,
      book_comment: "",
      rating_data: []
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
    showdetails(book) {
      this.DisplaydetailsForm = true;
      this.selected_Books = book;
    },
    DisplayPdf(book) {
      this.DisplayPdf = true;
      this.book_content = book.content;
      this.getrate(book);
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = new Date(dateString).toLocaleDateString(
        undefined,
        options
      );
      return formattedDate;
    },
    getrate(book) {
      fetch("/book_ratings/" + book.id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.rating_data = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    getBooks() {
      fetch("/my_books", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.books = data.filter(
            (book) => book.request_status === "approved" || book.request_status === "pending"
          );
          this.retunred_Books = data.filter(
            (book) => book.request_status === "approved"
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    returnBook(book) {
      if (!confirm("Confirm you want to return this book!")) {
        return;
      }
      fetch("/returnbook/" + book.rid, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert(data.message);
            this.getBooks();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    rate(book) {
      console.log(book);
      this.show_Rate = true;
      this.selected_Books = book;
    },
    rateBook() {
      if (this.rating < 1 || this.rating > 5) {
        alert("Rate must be between 1 and 5");
        return;
      }
      fetch("/ratebook/" + this.selected_Books.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          rating: this.rating,
          book_comment: this.book_comment,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert(data.message);
            this.getBooks();
            this.show_Rate = false;
            this.rating = 0;
            this.book_comment = "";
            this.selected_Books = {};
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.show_Rate = false;
          this.rating = 0;
          this.book_comment = "";
          this.selected_Books = {};
        });
    },
  },
});
export default my_books;





