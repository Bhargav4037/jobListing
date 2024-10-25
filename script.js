const jobListingsSection = document.getElementById('job-Listings');
const jobTypeFilter = document.getElementById('jobType');
const searchInput = document.getElementById('jobSearch');
const sortType = document.getElementById('jobSort')


let jobListings = [];

// Function to display job listings
function displayJobs(toDisplayJobs) {
    jobListingsSection.innerHTML = '';  // Clear previous job listings
    // Loading the data into inner HTML.
    toDisplayJobs.forEach(job => {
        const jobDiv = document.createElement('div');
        jobDiv.classList.add('job-listing');
        // Icons for each attribute
        const icons = [
            {src: 'icons/location.jpeg', text: job.location, name: 'icon'},
            {src: 'icons/type.png', text: job.type, name: 'icon' },
            {src: 'icons/postDate.png', text: job.date, name: 'icon' },
            {src: 'icons/description.png', text: job.description, name: 'iconD'}
        ];

        // Create the inner HTML structure dynamically
        let jobDetails = `
            <h1>${job.company}</h1>
            <hr>
            <h2>${job.title}</h2>
            <br>
        `;

        // Loop through the icons array to generate the icon + text structure
        icons.forEach(icon => {
            jobDetails += `
                <div class='${icon.name}'>
                    <img src="${icon.src}" class="job-icon"> 
                    <span>${icon.text}</span>
                </div>
                <br>
            `;
        });

        // Add the apply button at the end
        jobDetails += `
            <button class="apply-btn" onclick="window.open('${job.applyLink}')">Apply</button>
        `;

        jobDiv.innerHTML = jobDetails;
        jobListingsSection.appendChild(jobDiv);
    });
}

// function filters jobs based on jobType and Search data (case-insensitive) given by user.
function filteredJobs() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = jobTypeFilter.value
    const selectedSort = sortType.value
    let jobListingData = deleteUnwanted(jobListings);
    let filteredJobs = jobListingData.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm);
        const matchesType = (selectedType === 'all' || job.type === selectedType);
        return matchesSearch && matchesType;
    });

    if(selectedSort != "all"){
        // Sort jobs by date
        filteredJobs = filteredJobs.sort((a, b) => {
            console.log(a.date);
            console.log(b.date);
            const dateA = new Date(a.date);  // Convert posting date to Date object
            const dateB = new Date(b.date);
            return selectedSort === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }
     displayJobs(filteredJobs);
}

function deleteUnwanted(toDisplayJobs){
    let jobs = [];
    // Remove any unwanted data
    toDisplayJobs.forEach(job => {
        if (job.company.length != 0) {
            jobs.push(job);
        }
    });
    return jobs;
}

jobTypeFilter.addEventListener('change', filteredJobs);
searchInput.addEventListener('input',filteredJobs);
sortType.addEventListener('change',filteredJobs);

Papa.parse("joblistings.csv", {
    download: true,
    header: true,  
    complete: function(results) {
        jobListings = results.data.map(job => ({
            company: job['Company'],
            title: job['Job Title'],
            location: job['Location'],
            type: job['Work Type'],
            date: job['Posting Date'],
            description: job['Job Description'],
            applyLink: job[' Apply Link']
        }));
        let jobListingData = deleteUnwanted(jobListings);
        displayJobs(jobListingData); 
    }
});
