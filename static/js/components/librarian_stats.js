import navbar from "./navbar.js";
import footerbar from "./footerbar.js";

const librarian_stats = Vue.component("librarian_stats", {
  template: `
    <div>
      <navbar></navbar>
      <div class="container">
        <h2 class="form-title">Books Issued</h2>
        <div class="chart-container">
          <canvas id="barChart"></canvas>
        </div>
      </div>
      <br>
      <div class="container">
        <h2 class="form-title">Most Demanded Sections</h2>
        <div class="chart-container">
          <canvas id="pieChart"></canvas>
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
      fetch("/librarian_stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unable to fetch statistics.");
          } else {
            return response.json();
          }
        })
        .then((data) => {
          this.c_dict = data;
          this.createBarChart();
          this.createPieChart(data);
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
                label: "Books Currently Borrowed",
                data: Object.values(this.c_dict),
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
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
    createPieChart(data) {
      const pieCtx = document.getElementById("pieChart").getContext("2d");

      if (this.pieChart) {
        this.pieChart.destroy();
      }

      const sectionLabels = Object.keys(data);
      const sectionValues = Object.values(data);

      this.pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: sectionLabels,
          datasets: [
            {
              label: "Most Demanded Sections",
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

export default librarian_stats;
