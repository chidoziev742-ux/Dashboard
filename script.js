// Chart setup
const ctx = document.getElementById('userChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Active Users',
      data: [320, 450, 500, 650, 710, 860],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.3,
      fill: true
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// Sidebar toggle
document.getElementById("toggleSidebar").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("hidden");
});

// Tab switching
const tabLinks = document.querySelectorAll(".tab-link");
const tabContents = document.querySelectorAll(".tab-content");

tabLinks.forEach(link => {
  link.addEventListener("click", () => {
    const tab = link.dataset.tab;

    tabContents.forEach(content => {
      content.classList.add("hidden");
    });

    document.getElementById(tab).classList.remove("hidden");
  });
});


const searchInput = document.getElementById('reportSearch');
const statusFilter = document.getElementById('statusFilter');
const reportRows = document.querySelectorAll('#reports tbody tr');

function filterReports() {
  const searchValue = searchInput.value.toLowerCase();
  const selectedStatus = statusFilter.value;

  reportRows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const reportText = row.innerText.toLowerCase();
    const statusText = cells[2].innerText.trim();

    const matchesSearch = reportText.includes(searchValue);
    const matchesStatus = !selectedStatus || statusText === selectedStatus;

    row.style.display = matchesSearch && matchesStatus ? '' : 'none';
  });
}

searchInput.addEventListener('input', filterReports);
statusFilter.addEventListener('change', filterReports);


// Add Report Modal Logic
const openModalBtn = document.getElementById('openReportModal');
const closeModalBtn = document.getElementById('closeReportModal');
const reportModal = document.getElementById('reportModal');
const reportForm = document.getElementById('reportForm');

openModalBtn.addEventListener('click', () => reportModal.classList.remove('hidden'));
closeModalBtn.addEventListener('click', () => reportModal.classList.add('hidden'));

reportForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('reportName').value;
  const status = document.getElementById('reportStatus').value;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td class="px-4 py-2 border">${name}</td>
    <td class="px-4 py-2 border">${date}</td>
    <td class="px-4 py-2 border ${status === 'Completed' ? 'text-green-600' : 'text-yellow-500'} font-semibold">${status}</td>
    <td class="px-4 py-2 border">
      ${status === 'Completed'
        ? `<a href="#" class="download-btn text-blue-600 underline hover:text-blue-800">Download</a>`
        : `<span class="text-gray-400">Pending</span>`}
    </td>
  `;
  document.querySelector('#reports tbody').appendChild(newRow);
  reportModal.classList.add('hidden');
  reportForm.reset();
});

// Fake Download Functionality
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('download-btn')) {
    e.preventDefault();
    const reportName = e.target.closest('tr').children[0].textContent.trim();
    const blob = new Blob([`This is a fake PDF for: ${reportName}`], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, '_')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }
});
