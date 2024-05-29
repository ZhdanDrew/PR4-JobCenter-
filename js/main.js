const defaultSearchQuery = 'Python developer in Texas, USA';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '2ecc6a18f1msh149a8c93469a116p1ff3e3jsn92ea038f0326',
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
};

function fetchJobs(page, searchQuery = defaultSearchQuery) {
    const searchUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=${page}&num_pages=1`;

    fetch(searchUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            clearJobCards();
            displayJobCards(data.data);
            displayPageInfo(page, data.meta.total_pages);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

fetchJobs(1);

function displayJobCards(jobs) {
    const jobCardsContainer = document.getElementById('job-cards');
    jobCardsContainer.innerHTML = ''; // Clear existing job cards before adding new ones

    jobs.forEach(job => {
        const card = document.createElement('div');
        card.classList.add('job-card');

        const logo = document.createElement('img');
        logo.src = job.employer_logo ? job.employer_logo : 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';
        logo.alt = job.employer_name + ' logo';
        card.appendChild(logo);

        const companyName = document.createElement('h2');
        companyName.textContent = job.employer_name;
        card.appendChild(companyName);

        const jobTitle = document.createElement('p');
        jobTitle.textContent = job.job_title;
        card.appendChild(jobTitle);

        const jobCity = document.createElement('p');
        jobCity.textContent = job.job_city;
        card.appendChild(jobCity);

        jobCardsContainer.appendChild(card);
    });
}

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', performSearch);

function performSearch() {
    currentPage = 1;
    const searchInput = document.getElementById('searchInput').value.trim();
    fetchJobs(currentPage, searchInput || defaultSearchQuery);
}

function clearJobCards() {
    const jobCardsContainer = document.getElementById('job-cards');
    jobCardsContainer.innerHTML = '';
}

let currentPage = 1;

const prevButton = document.createElement('button');
prevButton.textContent = 'Previous';
prevButton.addEventListener('click', () => changePage(-1));

const nextButton = document.createElement('button');
nextButton.textContent = 'Next';
nextButton.addEventListener('click', () => changePage(1));

const buttonContainer = document.createElement('div');
buttonContainer.classList.add('button-container');
buttonContainer.appendChild(prevButton);
buttonContainer.appendChild(nextButton);

const jobCardsContainer = document.getElementById('job-cards');
jobCardsContainer.parentNode.insertBefore(buttonContainer, jobCardsContainer.nextSibling);

function changePage(step) {
    const searchInput = document.getElementById('searchInput').value.trim();
    const newPage = currentPage + step;
    if (newPage < 1) {
        return;
    }
    currentPage = newPage;
    fetchJobs(currentPage, searchInput || defaultSearchQuery);
}

function displayPageInfo(currentPage, totalPages) {
    clearPageInfo();
    const pageInfoContainer = document.createElement('div');
    pageInfoContainer.classList.add('page-info');
    pageInfoContainer.textContent = `Page ${currentPage} of ${totalPages}`;

    buttonContainer.parentNode.insertBefore(pageInfoContainer, buttonContainer.nextSibling);

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

function clearPageInfo() {
    const existingPageInfo = document.querySelector('.page-info');
    if (existingPageInfo) {
        existingPageInfo.remove();
    }
}
