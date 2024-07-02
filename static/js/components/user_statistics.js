import navbar from "./navbar.js";
import footerbar from "./footerbar.js";

const user_statistics = Vue.component("user_statistics", {
  template: `
  <div>
    <navbar></navbar>
    <div class="container">
      <h2 class="form-title">Books Stats</h2>
      <div class="chart-container">
        <canvas id="barChart"></canvas>
      </div>
    </div>
    <br>
    <div class="container">
      <h2 class="form-title">Section Stats</h2>
      <div class="chart-container">
        <canvas id="pieChart"></canvas>
      </div>
    </div>
    <footerr></footerr>
  </div>
`,


  components: {
    navbar,
    footerbar,
  },
  data() {
    return {
      c_dict: {},
      chart: null,
    };
  },
  mounted() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    } else {
      this.getStats();
    }
  },
  methods: {
    getStats() {
      fetch("/user_statistics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Stats failed");
          } else {
            return response.json();
          }
        })
        .then((data) => {
          this.c_dict = data;
          this.createBarChart();
          this.createPieChart();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createBarChart() {
      const ctx = document.getElementById("barChart").getContext("2d");

      if (this.chart) {
        this.chart.destroy(); // Destroy existing chart if any
      }

      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(this.c_dict),
          datasets: [
            {
              label: "Books Returned",
              data: Object.values(this.c_dict),
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },






createPieChart() {                                                                              
  const pieCtx = document.getElementById("pieChart").getContext("2d");                // Get the pie chart canvas element

  if (this.pieChart) {
    this.pieChart.destroy(); // Destroy existing pie chart instance
  }

  const sectionLabels = Object.keys(this.c_dict);
  const sectionValues = Object.values(this.c_dict);

  this.pieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: sectionLabels,
      datasets: [
        {
          label: "No. of Requested Books by this Sections",
          data: sectionValues,
          backgroundColor: [
          "#FF5733",
          "#33FF57",
          "#3357FF",
          "#FF33EA",
          "#FFD133",
          "#339AFF",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
},
},
});

export default user_statistics;
