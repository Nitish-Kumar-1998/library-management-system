import navbar from "./navbar.js";
import footerbar from "./footerbar.js";

const home = Vue.component("home", {
  template: `
    <div>
      <navbar></navbar>
      <div class="container">
      <div style="display: flex; justify-content: center;">
    <input
        type="text"
        v-model="search_term"
        @input="filteredBooks"
        placeholder="Search by book name, section, or author"
        style="width: 600px; padding: 8px; margin: 10px 0; border-radius: 30px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"
    />
</div>



<div class="section-container" style="display: flex; flex-wrap: wrap; justify-content: center;">
  <div class="section" v-for="(book, index) in filteredBooks" :key="book.id" style="background-color: #e9e9e9; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; margin: 10px; width: calc(20% - 20px); max-width: 300px;">
    <img :src="book.image || 'https://via.placeholder.com/300x400'" alt="section image" class="section-image" style="width: 100%; height: auto; border-radius: 10px 10px 0 0; margin-bottom: 10px;">
    <div class="book-details" style="padding: 0 10px;">
      <h3 style="font-size: 20px; margin-bottom: 5px; color: #333;">Name: {{book.name}}</h3>
      <p style="margin-bottom: 5px; color: #666;">Date Published: {{formatDate(book.book_publishedDate)}}</p>
      <p style="margin-bottom: 10px; color: #666;">Author: {{book.author}}</p>
    </div>
    <div class="request-return-buttons" style="text-align: center;">
      <button class="submit-button" @click="requestBook(book)" v-if="book.requestStatus=='none'" style="background-color: #4CAF50; color: #fff;">Request</button>
      <button class="warn-button" v-else-if="book.requestStatus=='approved'" @click="displayPdf(book)" style="background-color: #28a745; color: #fff;">View Book</button>
      <button class="cancel-button" @click="requestBook(book)" v-else-if="book.requestStatus=='rejected'" style="background-color: #dc3545; color: #fff;">Rejected</button>
      <button class="cancel-button" @click="requestBook(book)" v-else-if="book.requestStatus=='revoked'" style="background-color: #ffc107; color: #333;">Revoked</button>
      <button class="cancel-button" v-else style="background-color: #6c757d; color: #fff;">Requested</button>
    </div>
  </div>
</div>


<div class="section-container" style="display: flex; justify-content: center;">
 
    <div class="model" v-if="show_RequestForm">
      <div class="paper1-form-container" style="margin: 0 auto;">
        <h2 class="form-title" style="font-size: 24px; margin-bottom: 20px; color: #333;">Book Request</h2>
        <p class="form-description" style="font-size: 16px; color: #666; margin-bottom: 20px;">Please enter the return date for the book</p>
        <form @submit.prevent="submitrequestBook">
          <div class="form-group">
            <label for="return-date" style="font-size: 18px; color: #333;">Return Date</label>
            <input type="datetime-local" class="form-control" id="return-date" v-model="book_returnDate" required style="width: 100%; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px;">
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <button type="submit" class="submit-button" style="background-color: #007bff; color: #fff; padding: 12px 24px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">Request</button>
            <button class="cancel-button" @click="show_RequestForm=false" style="background-color: #dc3545; color: #fff; padding: 12px 24px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>


      <div class="modeling" v-if="isPdfVisible"> <!-- Updated to isPdfVisible -->
                <div class="pdf-container">
                <iframe :src="book_content" width="200%" height="600px" frameborder="0"></iframe>
                    <button @click="isPdfVisible = false" class="cancel-button">Close</button>
                </div>
                <div class="rating" style="margin-top: 20px; border-top: 2px solid #ccc; padding-top: 20px;">
                <h2 class="form-card-title" style="font-size: 24px; margin-bottom: 10px; color: #333;">User Ratings</h2>
                <div v-if="rating_data.length === 0" style="text-align: center; color: #666;">No Ratings Yet</div>
                <div v-else>
                    <div class="rating-item" v-for="rate in rating_data" :key="rate.id" style="margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between;">
                            <div style="font-size: 16px; color: #333; margin-bottom: 5px;">{{ rate.book_comment }}</div>
                            <div style="font-size: 14px; color: #666;">{{ rate.rating }}</div>
                        </div>
                        <div style="font-size: 12px; color: #999;">{{ formatDate(rate.rate_date) }}</div>
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
      books: [],
      search_term: "",
      show_RequestForm: false,
      book_returnDate: "",
      book_id: "",
      isPdfVisible: false, // Renamed DisplayPdf to isPdfVisible
      rating_data:[],
      book_content: "" // Added to store the content of the book to display in the PDF viewer
    };
  },
  computed: {
    filteredBooks() {
      const search_term = this.search_term.toLowerCase();
      return this.books.filter(
        (book) =>
          book.name.toLowerCase().includes(search_term) ||
          book.section.toLowerCase().includes(search_term) ||
          book.author.toLowerCase().includes(search_term)
      );
    },
  },
  mounted() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    } else {
      this.getBooks();
    }
  },
  methods: {
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
    displayPdf(book) { // Renamed DisplayPdf to displayPdf
      this.isPdfVisible = true; // Updated to isPdfVisible
      this.book_content = book.content;
      this.getrate(book);
    },
    requestBook(book) {
      this.show_RequestForm = true;
      this.book_id = book.id;
    },
    submitrequestBook() {
      fetch("/bookrequest/" + this.book_id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          request_returnDate: this.book_returnDate,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.show_RequestForm = false;
          alert(data.message);
          this.getBooks();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = new Date(dateString).toLocaleDateString(
        undefined,
        options
      );
      return formattedDate;
    },
    getBooks() {
      fetch("/userbooks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.books = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
});

export default home;
