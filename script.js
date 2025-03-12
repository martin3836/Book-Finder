// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const loader = document.getElementById('loader');
const modal = document.getElementById('book-detail-modal');
const modalContentContainer = document.getElementById('modal-content-container');
const closeButton = document.querySelector('.close-button');

// Event Listeners
searchButton.addEventListener('click', searchBooks);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBooks();
    }
});

closeButton.addEventListener('click', closeModal);
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Handle book search
function searchBooks() {
    const query = searchInput.value.trim();
    if (query === '') return;
    
    // Show loader
    loader.style.display = 'block';
    resultsContainer.innerHTML = '';
    
    // Google Books API URL
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            
            if (data.totalItems === 0 || !data.items) {
                displayNoResults();
                return;
            }
            
            displayResults(data.items);
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            loader.style.display = 'none';
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>Error</h3>
                    <p>There was a problem with your search. Please try again.</p>
                </div>
            `;
        });
}

// Display search results
function displayResults(books) {
    resultsContainer.innerHTML = '';
    
    books.forEach(book => {
        const volumeInfo = book.volumeInfo;
        const title = volumeInfo.title || 'Unknown Title';
        const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';
        const publishedYear = volumeInfo.publishedDate ? volumeInfo.publishedDate.substring(0, 4) : 'N/A';
        
        // Get cover image or use placeholder
        let coverUrl = 'https://via.placeholder.com/128x192.png?text=No+Cover';
        if (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) {
            coverUrl = volumeInfo.imageLinks.thumbnail.replace('http:', 'https:');
        }
        
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-cover">
                <img src="${coverUrl}" alt="Cover of ${title}">
            </div>
            <div class="book-info">
                <div class="book-title">${title}</div>
                <div class="book-author">${authors}</div>
                <div class="book-meta">
                    <span>${publishedYear}</span>
                    <span>${volumeInfo.pageCount ? volumeInfo.pageCount + ' pages' : ''}</span>
                </div>
            </div>
        `;
        
        bookCard.addEventListener('click', () => {
            showBookDetails(book);
        });
        
        resultsContainer.appendChild(bookCard);
    });
}

// Display no results message
function displayNoResults() {
    resultsContainer.innerHTML = `
        <div class="no-results">
            <h3>No Books Found</h3>
            <p>Try different keywords or check the spelling.</p>
        </div>
    `;
}

// Show detailed book information in modal
function showBookDetails(book) {
    const info = book.volumeInfo;
    const title = info.title || 'Unknown Title';
    const authors = info.authors ? info.authors.join(', ') : 'Unknown Author';
    const publishedDate = info.publishedDate || 'Unknown Date';
    const publisher = info.publisher || 'Unknown Publisher';
    const description = info.description || 'No description available.';
    const pageCount = info.pageCount ? `${info.pageCount} pages` : 'Unknown';
    const categories = info.categories ? info.categories.join(', ') : 'Unknown';
    const language = info.language || 'Unknown';
    const previewLink = info.previewLink || '';
    
    // Get cover image or use placeholder
    let coverUrl = 'https://via.placeholder.com/200x300.png?text=No+Cover';
    if (info.imageLinks && info.imageLinks.thumbnail) {
        coverUrl = info.imageLinks.thumbnail.replace('http:', 'https:');
    }
    
    modalContentContainer.innerHTML = `
        <div class="modal-flex">
            <div class="book-cover-large">
                <img src="${coverUrl}" alt="Cover of ${title}">
            </div>
            <div class="book-details">
                <h2 class="book-title-large">${title}</h2>
                <p class="book-author-large">by ${authors}</p>
                
                <div class="book-tags">
                    <span class="tag tag-year">${publishedDate.substring(0, 4)}</span>
                    <span class="tag tag-genre">${categories}</span>
                    <span class="tag tag-pages">${pageCount}</span>
                </div>
                
                <div class="section-title">Description</div>
                <div class="book-description">${description}</div>
                
                <div class="section-title">Publishing Details</div>
                <div class="publisher-info">
                    <p>Publisher: ${publisher}</p>
                    <p>Publication Date: ${publishedDate}</p>
                    <p>Language: ${languageCode(language)}</p>
                </div>
                
                <div class="action-buttons">
                    ${previewLink ? `<a href="${previewLink}" target="_blank"><button class="action-button primary-button">Preview Book</button></a>` : ''}
                    <button class="action-button secondary-button" onclick="addToLibrary('${title.replace(/'/g, "\\'")}')">Add to My Library</button>
                    <button class="action-button secondary-button" onclick="shareBook('${title.replace(/'/g, "\\'")}')">Share</button>
                </div>
            </div>
        </div>
    `;
    
    // Open modal
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
}

// Convert ISO language code to language name
function languageCode(code) {
    const languages = {
        'en': 'English',
        'fr': 'French',
        'es': 'Spanish',
        'de': 'German',
        'ja': 'Japanese',
        'ru': 'Russian',
        'zh': 'Chinese',
        'it': 'Italian',
        'pt': 'Portuguese'
    };
    
    return languages[code] || code;
}

// Add to library function (placeholder)
function addToLibrary(title) {
    alert(`"${title}" has been added to your library.`);
}

// Share book function (placeholder)
function shareBook(title) {
    alert(`Share link for "${title}" has been copied to clipboard.`);
}

// Set focus to search input on page load
window.onload = function() {
    searchInput.focus();
};