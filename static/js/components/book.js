import navbar from "./navbar.js";
import footerbar from "./footerbar.js";

const book = Vue.component("book", {
  template:`
  <div>
  <navbar style="background-color: #333; color: #fff;"></navbar>
  <div class="container" style="margin-top: 20px;">
    <h1 style="color: #333;">Book Library</h1>
    <div v-if="nobooks">
      <p>No Books Available!!</p>
    </div>
    <div class="section-container" v-else>
      <div class="section" v-for="book in booksData" :key="book.id" style="border: 1px solid #ccc; padding: 20px; margin-bottom: 20px; border-radius: 10px;">
        <img :src="book.image" alt="Book image" class="section-image" style="max-width: 100%; border-radius: 5px; cursor: pointer;" @click="openPdf(book.content)">
        <h3>Name: {{book.name}}</h3>
        <p>Date Published: {{formatDate(book.book_publishedDate)}}</p>
        <p>Author: {{book.author}}</p>
        <div class="edit-delete-buttons" style="margin-top: 10px;">
          <button class="submit-button" style="background-color: #27AE60 ; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;" @click="editBook(book)">Edit</button>
          <button class="cancel-button" style="background-color: #dc3545; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 10px;" @click="deleteBook(book.id)">Delete</button>
        </div>
      </div>
    </div>
    <button @click="addbook" class="submit-button" style="background-color: #28a745; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Add book</button>
    <button @click="$router.go(-1)" class="cancel-button" style="background-color: #6c757d; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Back</button>
  </div>

  <div class="model" v-if="DisplaybookForm" style="background-color: rgba(0, 0, 0, 0.5); position: fixed; top: 0; left: 0; width: 100%; height: 100%; backdrop-filter: blur(10px);">
    <div class="paper1-form-container" style="background-color: #A3E4D7 ; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2 class="form-title" style="color: #333;">Add Book</h2>
      <form @submit.prevent="SubmitBook" class="login-form">
        <div class="mb-3">
          <label for="bookname" class="form-label" style="color: #333;">Book Name</label>
          <input type="text" class="form-control" id="bookname" name="bookname" v-model="bookname" required>
        </div>
        <div class="mb-3">
          <label for="author" class="form-label" style="color: #333;">Author</label>
          <input type="text" class="form-control" id="author" name="author" v-model="author" required>
        </div>
        <div class="mb-3">
          <label for="content" class="form-label" style="color: #333;">Content</label>
          <input type="file" class="form-control" id="content" name="content" @change="uploadpdf" required>
        </div>
        <div class="mb-3">
          <label for="book_publishedDate" class="form-label" style="color: #333;">Date Published</label>
          <input type="date" class="form-control" id="book_publishedDate" name="book_publishedDate" v-model="book_publishedDate" required>
        </div>
        <div class="mb-3">
          <label for="book_returnDate" class="form-label" style="color: #333;">Return Date</label>
          <input type="date" class="form-control" id="book_returnDate" name="book_returnDate" v-model="book_returnDate" required>
        </div>
        <div class="mb-3">
          <label for="BookImage" class="form-label" style="color: #333;">Book Image</label>
          <input type="file" class="form-control" id="BookImage" name="BookImage" @change="uploadImage">
        </div>
        <div class="text-center">
          <button type="submit" class="submit-button" style="background-color: #007bff; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Add</button>
          <button type="button" class="cancel-button" @click="addbook" style="background-color: #dc3545; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Cancel</button>
        </div>
      </form>
    </div>
  </div>

  <div class="model" v-if="DisplayeditForm" style="background-color: rgba(0, 0, 0, 0.5); position: fixed; top: 0; left: 0; width: 100%; height: 100%; backdrop-filter: blur(10px);">
    <div class="paper1-form-container" style="background-color: #A3E4D7 ; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2 class="form-title" style="color: #333;">Edit Book</h2>
      <form @submit.prevent="SubmiteditBook" class="login-form">
        <div class="mb-3">
          <label for="bookname" class="form-label" style="color: #333;">Book Name</label>
          <input type="text" class="form-control" id="bookname" name="bookname" v-model="bookname" required>
        </div>
        <div class="mb-3">
          <label for="author" class="form-label" style="color: #333;">Author</label>
          <input type="text" class="form-control" id="author" name="author" v-model="author" required>
        </div>
        <div class="mb-3">
          <label for="content" class="form-label" style="color: #333;">Content</label>
          <input type="file" class="form-control" id="content" name="content" @change="uploadpdf">
        </div>
        <div class="mb-3">
          <label for="book_publishedDate" class="form-label" style="color: #333;">Date Published</label>
          <input type="date" class="form-control" id="book_publishedDate" name="book_publishedDate" v-model="book_publishedDate" required>
        </div>
        <div class="mb-3">
          <label for="book_returnDate" class="form-label" style="color: #333;">Return Date</label>
          <input type="date" class="form-control" id="book_returnDate" name="book_returnDate" v-model="book_returnDate" required>
        </div>
        <div class="mb-3">
          <label for="BookImage" class="form-label" style="color: #333;">Book Image</label>
          <input type="file" class="form-control" id="BookImage" name="BookImage" @change="uploadImage">
        </div>
        <div class="text-center">
          <button type="submit" class="submit-button" style="background-color: #007bff; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Save</button>
          <button type="button" class="cancel-button" @click="DisplayeditForm = false" style="background-color: #dc3545; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Cancel</button>
        </div>
      </form>
    </div>
  </div>

  <div class="modeling" v-if="DisplayPdf" style="background-color: rgba(0, 0, 0, 0.8); position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
    <iframe :src="book_content" width="80%" height="80%" frameborder="0"></iframe>
    <button @click="DisplayPdf = false" class="cancel-button" style="background-color: #dc3545; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; position: absolute; top: 20px; right: 20px;">Close</button>
  </div>

  <footerbar style="background-color: #333; color: #fff;"></footerbar>
</div>
  `,
  components: {
    navbar,
    footerbar,
  },
  data() {
    return {
      nobooks: false,
      section_id: this.$route.params.section_id,
      booksData: [],
      author: "",
      DisplaybookForm: false,
      book_id: "",
      bookname: "",
      bookImage: "",
      content: "",
      book_publishedDate: "",
      book_returnDate: "",
      book_content: "",
      DisplayPdf: false,
      DisplayeditForm: false,
    };
  },
  mounted() {
    fetch(`/api/book/section/${this.section_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
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
        console.error("Error:", error.message);
      });
  },
  methods: {                                                           // Open pdf function
    openPdf(content) {
      this.book_content = content;
      this.DisplayPdf = true;
    },
    SubmiteditBook() {                                                 // Edit book function
      const booksData = {
        title: this.bookname,
        author: this.author,
        content: this.content,
        book_publishedDate: this.book_publishedDate,
        book_returnDate: this.book_returnDate,
        image: this.bookImage,
      };
      fetch(`/api/book/${this.book_id}`, {
        method: "PUT",
        body: JSON.stringify(booksData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Unable to add book");
          }
        })
        .then((data) => {
          alert(data.message);
          this.DisplayeditForm = false;
          this.bookname = "";
          this.author = "";
          this.content = "";
          this.book_publishedDate = "";
          this.book_returnDate = "";
          this.bookImage = "";
          this.$router.go();
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };                         // Date format
      const formattedDate = new Date(dateString).toLocaleDateString(
        undefined,
        options
      );
      return formattedDate;
    },
    editBook(book) {
      this.book_id = book.id;
      this.DisplayeditForm = true;
      this.bookname = book.name;
      this.author = book.author;
      this.content = book.content;
      this.book_publishedDate = book.book_publishedDate;
      this.book_returnDate = book.book_returnDate;
      this.bookImage = book.image;
    },
    uploadpdf(event) {                                                              // Upload pdf function
      const reader = new FileReader();
      reader.onload = (e) => {
        this.content = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    },
    uploadImage(event) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.bookImage = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    },
    addbook() {
      this.DisplaybookForm = !this.DisplaybookForm;
    },
    SubmitBook() {
      const booksData = {
        title: this.bookname,
        author: this.author,
        content: this.content,
        book_publishedDate: this.book_publishedDate,
        book_returnDate: this.book_returnDate,
        image: this.bookImage,
      };
      fetch(`/api/book/section/${this.section_id}`, {                                         // Add book function
        method: "POST",
        body: JSON.stringify(booksData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Unable to add book");                                     // Error handling
          }
        })
        .then((data) => {
          alert(data.message);
          this.DisplaybookForm = false;
          this.bookname = "";
          this.author = "";
          this.content = "";
          this.book_publishedDate = "";
          this.book_returnDate = "";
          this.bookImage = "";
          this.$router.go();
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    },
    deleteBook(book_id) {                                                // Delete book function
      if (!confirm("Confirm: Remove this book?")) {
        return;
      }
      fetch(`/api/book/${book_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Unable to remove the book.");
          }
        })
        .then((data) => {
          this.$router.go();
          alert(data.message);
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    },
  },
});

export default book;
