// Importing all the necessary components
import home from "./components/home.js";
import Login from "./components/login.js";
import CreateUser from "./components/register.js";
import librarian_dasboard from "./components/librarian_dashboard.js";
import book from "./components/book.js";
import my_books from "./components/my_books.js";
import requests from "./components/requests.js";
import user_statistics from "./components/user_statistics.js";
import librarian_stats from "./components/librarian_stats.js";
import allbooks from "./components/allbooks.js";

// Defining the routes for the application
const routes = [
  {
    path: "/",                  // Route for the login page
    name: "login",                // Component to render when this route is accessed
    component: Login,
  },
  {
    path: "/allbooks",         // Route for the allbooks page
    name: "allbooks",          // Component to render when this route is accessed
    component: allbooks,        
  },

  {
    path: "/home",           // Route for the home page
    name: "home",
    component: home,         // Component to render when this route is accessed
  },
  {
    path: "/register",              // Route for the register page
    name: "register",
    component: CreateUser,            // Component to render when this route is accessed
  },
  {
    path: "/librarian",                // Route for the librarian dashboard
    name: "librarian_dasboard",
    component: librarian_dasboard,        // Component to render when this route is accessed
  },
  {
    path: "/book/:section_id",           // Route for the book page
    name: "book",
    component: book,                      // Component to render when this route is accessed
  },
  {
    path: "/my_books",                      // Route for the my_books page
    name: "my_books",
    component: my_books,                       // Component to render when this route is accessed
  },
  {
    path: "/requests",                          // Route for the requests page
    name: "requests",
    component: requests,                         // Component to render when this route is accessed
  },
  {
    path: "/user_statistics",                   // Route for the user_statistics page
    name: "user_statistics",
    component: user_statistics,                 // Component to render when this route is accessed
  },
  {
    path: "/librarian_stats",                  // Route for the librarian_stats page
    name: "librarian_stats",
    component: librarian_stats,                 // Component to render when this route is accessed
  },

  {
    path: "*",                                // Route for handling any 
    redirect: "/",                         // Redirect to the login page
  },
];

const router = new VueRouter({                           // Creating a new VueRouter instance       
  routes,
});

export default router;                               // Exporting the router instance
