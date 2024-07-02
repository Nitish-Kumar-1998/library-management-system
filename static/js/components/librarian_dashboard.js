import navbar from "./navbar.js";
import footerbar from "./footerbar.js";

const librarian_dasboard = Vue.component("librarian_dasboard", {
  template: `
        <div>
        <navbar></navbar>
            <div class="container">
            <h2 style="color: #000000; margin: 20px; margin-left: 10px;">Sections</h2>

            <div class="section-container" style="display: flex; flex-wrap: wrap; justify-content: center;">
            
  <div class="section" v-if="no_Sections" style="background-color: #e9e9e9; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; margin: 10px; width: calc(100% - 20px); max-width: 300px;">
    <h3>No Section Available</h3>
  </div>
  <div class="section" v-else v-for="section in section_data" :key="section.id" style="background-color: #e9e9e9; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; margin: 10px; width: calc(20% - 20px); max-width: 300px;">
    <img :src="section.image" alt="section image" class="section-image" style="width: 100%; height: auto; border-radius: 10px 10px 0 0; margin-bottom: 10px;" @click="$router.push('/book/'+section.id)">
    <div class="book-details" style="padding: 0 10px;">
      <h3 style="font-size: 20px; margin-bottom: 5px; color: #333;">{{ section.name }}</h3>
      <p style="margin-bottom: 5px; color: #666;">{{ section.description }}</p>
      <p style="margin-bottom: 10px; color: #666;">{{ formatDate(section.section_createdDate) }}</p>
    </div>
    <div class="edit-delete-buttons" style="text-align: center;">
      <button class="submit-button" @click="editSection(section)" style="background-color:  #4CAF50; color: #fff;">Edit</button>
      <button class="cancel-button" @click="deleteSection(section.id)" style="background-color: #dc3545; color: #fff;">Delete</button>
    </div>
  </div>
</div>
<div style="text-align: right; margin-right: 600px;">
  <button class="submit-button" @click="addSection">Add Section</button>
</div>
            
<div class="modal" v-if="DisplaySectionForm" style="background-color: rgba(0, 0, 0, 0.5); position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
    <div class="paper1-form-container" style="background-color: #A3E4D7; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%;">
        <h2 class="form-title" style="text-align: center; margin-bottom: 20px;">Add Section</h2>
        <form @submit.prevent="SubmitSection" class="login-form">
            <div class="mb-3" style="margin-bottom: 15px;">
                <label for="section_name" class="form-label">Section Name</label>
                <input type="text" class="form-control" id="section_name" name="section_name" v-model="section_name" required style="width: 100%;">
            </div>
            <div class="mb-3" style="margin-bottom: 50px;">
                <label for="section_createdDate" class="form-label">Date Created</label>
                <input type="date" class="form-control" id="section_createdDate" name="section_createdDate" v-model="section_createdDate" required style="width: 100%;">
            </div>
            <div class="mb-3" style="margin-bottom: 50px;">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" name="description" v-model="description" required style="width: 100%; height: 100px;"></textarea>
            </div>
            <div class="mb-3" style="margin-bottom: 50px;">
                <label for="section_image" class="form-label">Section Image</label>
                <input type="file" class="form-control" id="section_image" name="section_image" @change="uploadImage" required style="width: 100%;">
            </div>
            <div class="text-center">
                <button type="submit" class="submit-button" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Add</button>
                <button type="button" class="cancel-button" @click="addSection" style="background-color: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
            </div>
        </form>
    </div>
</div>



            <div class="model" v-if="DisplayeditSectionForm" style="background-color: rgba(255, 255, 255, 0.8); backdrop-filter: blur(5px); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <div class="paper1-form-container" style="max-width: 400px; margin: 0 auto; background-color: #B8E3D6;">
        <h2 class="form-title" style="font-size: 24px; margin-bottom: 20px; color: #333; text-align: center;">Edit Section</h2>
        <form @submit.prevent="submiteditSection" class="login-form">
            <div class="mb-3">
                <label for="section_name" class="form-label">Section Name</label>
                <input type="text" class="form-control" id="section_name" name="section_name" v-model="section_name">
            </div>
            <div class="mb-3">
                <label for="section_createdDate" class="form-label">Date Created</label>
                <input type="date" class="form-control" id="section_createdDate" name="section_createdDate" v-model="section_createdDate" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" name="description" v-model="description"></textarea>
            </div>
            <div class="mb-3">
                <label for="section_image" class="form-label">Section Image</label>
                <img :src="section_image" alt="section image" class="section-image" width="50" height="50">
                <input type="file" class="form-control" id="section_image" name="section_image" @change="uploadImage">
            </div>
            <div class="text-center">
                <button type="submit" class="submit-button" style="background-color:  #4CAF50; color: #fff;">Save</button>
                <button type="button" class="cancel-button" @click="closeeditSectionForm">Cancel</button>
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
      section_name: "",
      section_createdDate: "",
      description: "",
      section_image: "",
      section_id: "",
      DisplaySectionForm: false,
      DisplayeditSectionForm: false,
      section_data: [],
      no_Sections: false,
    };
  },
  mounted() {
    this.getSection();
  },
  methods: {
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = new Date(dateString).toLocaleDateString(
        undefined,
        options
      );
      return formattedDate;
    },
    uploadImage(event) {
      const reader = new FileReader();
      reader.onload = () => {
        this.section_image = reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    },
    addSection() {
      this.DisplaySectionForm = !this.DisplaySectionForm;
    },
    SubmitSection() {
      const Form_Data = {
        name: this.section_name,
        section_createdDate: this.section_createdDate,
        description: this.description,
        image: this.section_image,
      };
      console.log(Form_Data);
      fetch("/api/section", {
        method: "POST",
        body: JSON.stringify(Form_Data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => {
          if (res.request_status == 401) {
            alert("Unauthorized Access Attempt");
          }
          if (res.request_status == 400) {
            alert("Request Not Valid");
          }
          if (res.request_status == 500) {
            alert("Server Encountered an Issue");
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert(data.message);
            this.getSection();
            this.DisplaySectionForm = false;
          }
        });
    },
    getSection() {
      fetch("/api/section", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => {
          if (res.request_status == 401) {
            alert("Unauthorized Access Attempt");
          }
          if (res.request_status == 400) {
            alert("Request Not Valid");
          }
          if (res.request_status == 500) {
            alert("Server Encountered an Issue");
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            this.section_data = data;
            console.log(this.section_data);
            if (this.section_data.length == 0) {
              no_Sections = true;
            }
          }
        });
    },
    editSection(section) {
      this.DisplayeditSectionForm = true;
      this.section_name = section.name;
      this.section_createdDate = section.section_createdDate;
      this.description = section.description;
      this.section_image = section.image;
      this.section_id = section.id;
    },
    closeeditSectionForm() {
      this.DisplayeditSectionForm = false;
    },
    submiteditSection() {
      const Form_Data = {
        name: this.section_name,
        section_createdDate: this.section_createdDate,
        description: this.description,
        image: this.section_image,
      };
      console.log(Form_Data);
      fetch(`/api/section/${this.section_id}`, {
        method: "PUT",
        body: JSON.stringify(Form_Data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert(data.message);
            this.getSection();
            this.DisplayeditSectionForm = false;
            this.section_name = "";
            this.section_createdDate = "";
            this.description = "";
            this.section_image = "";
            this.section_id = "";
          }
        });
    },
    deleteSection(id) {
      if (!confirm("Confirm: Remove this section?")) {
        return;
      }
      fetch(`/api/section/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert(data.message);
            this.getSection();
          }
        });
    },
  },
});

export default librarian_dasboard;
