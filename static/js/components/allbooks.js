import navbar from "./navbar.js";
import footerbar from "./footerbar.js";

const allbooks = Vue.component("allbooks", {                                                  // Modified to fetch all books

  template: `
  <div>
  <navbar></navbar>
  <div class="container">
    <h1>Books</h1>
    <div v-if="nobooks">
      <p>No Books Available!</p>
    </div>
    <div class="section-container" v-else>
      <div class="section" v-for="book in booksData" :key="book.id">
        <img :src="book.image" alt="Book image" class="section-image" @click="openPdf(book.content)">
        <h3>Name: {{book.name}}</h3>
        <p>Book Published Date: {{formatDate(book.book_publishedDate)}}</p>
        <p>Author: {{book.author}}</p>
      </div>
    </div>
  
  </div>

  <div class="modeling" v-if="DisplayPdf" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;">
  <div class="pdf-container" style="position: absolute; top: 50%; left: 20%; transform: translate(-50%, -50%);">
      <iframe :src="book_content" width="300%" height="600px" frameborder="0"></iframe>
      <button @click="DisplayPdf = false" class="cancel-button">Close</button>
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
      nobooks: false,
      booksData: [],
      author: "",
      content: "",
      book_publishedDate: "",
      book_returnDate: "",
      book_content: "",
      DisplayPdf: false,
    };
  },
  mounted() {
    fetch(`/api/book`, { // Modified to fetch all books
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),                         // fetching  token from localStorage
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Sorry, couldn't find any books");
        }
      })
      .then((data) => {
        this.booksData = data;
        if (this.booksData.length === 0) {
          this.nobooks = true;
        } else {
          this.nobooks = false;
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);                               // Error handling
      });
  },
  methods: {
    openPdf(content) {
      this.book_content = content;
      this.DisplayPdf = true;
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = new Date(dateString).toLocaleDateString(
        undefined,
        options
      );
      return formattedDate;
    },
  },
});

export default allbooks;                                               // Modified to export allbooks
