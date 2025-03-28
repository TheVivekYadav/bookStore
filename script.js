
// this function will fetch books

async function fetchBooks(page = 1) {
    console.log('fetching');
    console.log(page);
    try {
        const response = await fetch(`${API_URL}?page=${page}&limit=7&inc=kind%2Cid%2Cetag%2CvolumeInfo&query=tech`, {
            method: 'GET',
            headers: { accept: 'application/json' }
        });
console.log(`${API_URL}?page=${page}&limit=100&inc=kind%2Cid%2Cetag%2CvolumeInfo&query=tech`);
        const data = await response.json();


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
    bookContainer.className = view;
    bookContainer.innerHTML = "";
	books.forEach((book, index) => {
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

toggleViewBtn.addEventListener("click", () => {
    view = view === "grid" ? "list" : "grid";
    bookContainer.className = view;
});

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
    fetchBooks();
});
