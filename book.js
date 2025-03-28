
// this function will fetch books

export async function fetchBooks(page = 1) {
    console.log('fetching');
    console.log(page);
    try {
        const searchQuery = searchInput.value;
        console.log(searchQuery);
        const response = await fetch(`${API_URL}?page=${page}&limit=7&inc=kind%2Cid%2Cetag%2CvolumeInfo&query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: { accept: 'application/json' }
        });
        const data = await response.json();
console.log(`${API_URL}?page=${page}&limit=7&inc=kind%2Cid%2Cetag%2CvolumeInfo&query=${encodeURIComponent(searchQuery)}`);

        books = page === 1 ? data.data.data : [...books, ...data.data.data];
        console.log(books);
        renderBooks();
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}



// rendring books
function renderBooks(){
    console.log("rendering");


    const sortBy = sortSelect.value;
    books.sort((a, b) => {
        if (sortBy === "title") {
            // Compare book titles alphabetically, handling missing titles
            return (a.volumeInfo?.title || "").localeCompare(b.volumeInfo?.title || "");
        } else {
            // Handle missing dates by placing them at the end
            if (!a.volumeInfo?.publishedDate) return 1;
            if (!b.volumeInfo?.publishedDate) return -1;
            // Sort books by published date in descending order (newest first)
            return new Date(b.volumeInfo.publishedDate) - new Date(a.volumeInfo.publishedDate);
        }
    });

    bookContainer.className = view;
    bookContainer.innerHTML = "";
	books.forEach((book, index) => {

            if (index < (page - 1) * 7) return;//skipping already rendered books
	
        const bookElement = document.createElement("div");
		bookElement.className = "book";

		const imageUrl = book.volumeInfo?.imageLinks?.thumbnail;
        	const title = book.volumeInfo?.title;
        	const subtitle = book.volumeInfo?.subtitle;
        	const authors = book.volumeInfo?.authors?.join(", ");
        	const publisher = book.volumeInfo?.publisher;
        	const publishedDate = book.volumeInfo?.publishedDate;
        	const description = book.volumeInfo?.description;
        	const shortDescription = description.length > 150 ? description.substring(0, 150) + "..." : description;


		bookElement.innerHTML = `
            <div class="book-image">
                <img src="${imageUrl}" alt="${title}" onerror="this.src='/placeholder.svg?height=250&width=180'">
            </div>
            <div class="book-info">
                <h3 class="book-title">${title}</h3>
                ${subtitle ? `<h4 class="book-subtitle">${subtitle}</h4>` : ''}
                <p class="book-meta"><strong>Author:</strong> ${authors}</p>
                <p class="book-meta"><strong>Publisher:</strong> ${publisher}</p>
                <p class="book-meta"><strong>Published:</strong> ${formatDate(publishedDate)}</p>
                <p class="book-description">${shortDescription}</p>
            </div>
        `;

		// Add click event to open book details
        bookElement.addEventListener("click", () => {
            if (book.volumeInfo?.infoLink) {
                window.open(book.volumeInfo.infoLink, "_blank");
            }
        });
        
        bookContainer.appendChild(bookElement);

    renderPagination();

	})
}
function formatDate(dateString) {
    if (!dateString || dateString === "Unknown Date") return dateString;
    
    // Handle partial dates (YYYY or YYYY-MM)
    if (dateString.length === 4) return dateString; // Just year
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    } catch (e) {
        return dateString;
    }
}


function renderPagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // Clear previous buttons

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.add("page-button");
        if (i === page) button.classList.add("active");

        button.addEventListener("click", () => {
            page = i;
            fetchBooks(i);
        });

        paginationContainer.appendChild(button);
    }
}



// Debounce function to limit API calls during search
function debounce(func, delay) {
    let timeout; // Stores the timer ID
    return function() {
        
        const context = this; // Preserve 'this' context
        const args = arguments; // Capture arguments

        clearTimeout(timeout);// Clear the previous timer
        timeout = setTimeout(() => func.apply(context, args), delay);// Set a new timer
    
    };
}


searchInput.addEventListener("input", debounce(() => {
    fetchBooks(true);
}, 500));

toggleViewBtn.addEventListener("click", () => {
    view = view === "grid" ? "list" : "grid";
    bookContainer.className = view;
});

//re rendring the books if select value changes
sortSelect.addEventListener("change", () => {
    renderBooks();
});






