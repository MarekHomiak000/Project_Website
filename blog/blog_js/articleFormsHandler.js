// ========== MODULE: articleFormsHandler.js - FINAL FIX (CORS RESOLUTION) ==========
const MY_BLOG_TAG = "enviroment"; // Your unique identifier (needs to be available)

class ArticleFormsHandler {
    constructor() {
        this.form = null;
        // Define the base URL for the local API here for cleaner code
        this.API_BASE_URL = 'http://192.168.56.101/api/article'; // <--- LOCAL SERVER URL
        // If you need the online URL for testing different behavior:
        // this.API_BASE_URL = 'https://wt.kpi.fei.tuke.sk/api/article';
    }

    /**
     * Returns an array of individual tag strings.
     */
    buildTagsArray(userTagsInput) {
        // 1. Split user input, map to trimmed tags, and filter out empties
        const userTags = (userTagsInput || "")
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0 && t !== MY_BLOG_TAG);

        // 2. Add the mandatory tag
        userTags.push(MY_BLOG_TAG);

        // 3. Return a clean array with duplicates removed
        return [...new Set(userTags)];
    }

    // Spracovanie pridania nového článku
    handleInsert(returnPage) {
        this.form = document.getElementById('article-form');

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            const userTags = document.getElementById('article-tags').value.trim();
            const allTagsArray = this.buildTagsArray(userTags);

            const articleData = {
                title: document.getElementById('article-title').value.trim(),
                author: document.getElementById('article-author').value.trim(),
                content: document.getElementById('article-content').value.trim(),
                tags: allTagsArray,
                imageLink: document.getElementById('article-image').value.trim()
            };

            const ajax = new XMLHttpRequest();
            // --- CORS FIX APPLIED HERE: Using LOCAL SERVER URL ---
            ajax.open('POST', this.API_BASE_URL, true);
            ajax.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

            ajax.addEventListener('load', function() {
                console.log('Response status:', this.status);
                console.log('Response text:', this.responseText);

                if (this.status === 201 || this.status === 200) {
                    alert('Article successfully created!');
                    window.location.hash = `#/articles?page=${returnPage}`;
                } else {
                    alert('Error creating article. Status: ' + this.status + ', Message: ' + this.responseText);
                }
            });

            ajax.addEventListener('error', function() {
                console.error('Network error occurred');
                alert('Network error - check console for details');
            });

            ajax.send(JSON.stringify(articleData));
        });
    }

    // Spracovanie editácie článku
    handleEdit(id, returnPage) {
        this.form = document.getElementById('article-form');

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            const userTags = document.getElementById('article-tags').value.trim();
            const allTagsArray = this.buildTagsArray(userTags);

            const articleData = {
                title: document.getElementById('article-title').value.trim(),
                author: document.getElementById('article-author').value.trim(),
                content: document.getElementById('article-content').value.trim(),
                tags: allTagsArray,
                imageLink: document.getElementById('article-image').value.trim()
            };

            const ajax = new XMLHttpRequest();
            // --- CORS FIX APPLIED HERE: Using LOCAL SERVER URL ---
            ajax.open('PUT', `${this.API_BASE_URL}/${id}`, true);
            ajax.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

            ajax.addEventListener('load', function() {
                console.log('Update response status:', this.status);
                console.log('Update response text:', this.responseText);

                if (this.status === 200) {
                    alert('Article successfully updated!');
                    window.location.hash = `#/article/${id}/${returnPage}`;
                } else {
                    alert('Error updating article. Status: ' + this.status + ', Message: ' + this.responseText);
                }
            });

            ajax.addEventListener('error', function() {
                console.error('Network error occurred');
                alert('Network error - check console for details');
            });

            ajax.send(JSON.stringify(articleData));
        });
    }
}