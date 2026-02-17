    // ========== CONFIGURATION ==========
    // IMPORTANT: Change this to your unique tag/keyword
    window.MY_BLOG_TAG = "enviroment";
    
    
    
    
    // ========== ROUTES CONFIG ==========
    const routes = {
        '#/': homePage,
        '#/articles': () => articlesPage(1),
        '#/addOpinion': addOpinionPage,
        '#/opinions': opinionsPage
    };
    
    
    
    
    // ========== HOME PAGE ==========
    function homePage() {
        const template = `
            <div class="blog-welcome-container">
                <div class="blog-welcome-content">
                    <h1>{{title}}</h1>
                    <h4>{{header}}</h4>
                    <p>{{description}}</p>
                    <a class="start-reading-button" href="#/articles">{{button}}</a>
                </div>
            </div>
        `;
    
        const data = {
            title: 'The Green Corner',
            header: 'Exploring Nature, Sustainability, and Everyday Eco-Tips',
            description: 'Welcome to The Green Corner! Here you’ll find stories about forests, oceans, wildlife, and the little things we can do every day to care for our planet. Join us as we explore, learn, and share ideas to live more sustainably while celebrating the beauty of the natural world.',
            button: 'Start Reading'
        };
    
        const rendered = Mustache.render(template, data); //vloží dáta do šablóny
        document.getElementById('app').innerHTML = rendered; //nájde element s id="app" a nahradí obsah elementu
    }
    
    
    
    
    
    
    // ========== ADD OPINION PAGE ==========
    function addOpinionPage() {
        document.getElementById('app').innerHTML = `
                <section id="feedback-section">
                    <h2>Share Your Opinion About Colorful World</h2>
                    <p>We would love to hear your thoughts about our page. Please fill out the form below.</p>
        
                    <form id="feedback-form" action="#" method="POST">
                        <div class="form-group">
                            <label for="visitor-name">Your Name:</label>
                            <input type="text" id="visitor-name" name="visitorName" placeholder="e.g., John Doe" required>
                        </div>
        
                        <div class="form-group">
                            <label for="visitor-email">Your Email:</label>
                            <input type="email" id="visitor-email" name="visitorEmail" placeholder="e.g., john.doe@example.com" required>
                        </div>
        
                        <div class="form-group">
                            <label for="image-url">Image URL from your travels (optional):</label>
                            <input type="url" id="image-url" name="imageUrl" placeholder="https://example.com/my-photo.jpg">
                        </div>
        
                        <div class="form-group">
                            <label for="keywords-input">Keywords suitable for our site:</label>
                            <input type="text" id="keywords-input" name="keywords" list="suggestions" placeholder="e.g., travel, food, ...">
                            <datalist id="suggestions">
                                <option value="Travel">
                                <option value="Nature">
                                <option value="Culture">
                                <option value="Architecture">
                                <option value="Cities">
                                <option value="Adventure">
                                <option value="History">
                                <option value="Food">
                            </datalist>
                        </div>
        
                        <div class="form-group">
                            <fieldset id="content-preference">
                                <legend>What kind of content would you like to see more of?</legend>
                                <div class="radio-option">
                                    <input type="radio" id="pref-nature" name="contentPreference" value="nature" checked>
                                    <label for="pref-nature">Natural Wonders & Landscapes</label>
                                </div>
                                <div class="radio-option">
                                    <input type="radio" id="pref-cities" name="contentPreference" value="cities">
                                    <label for="pref-cities">Bustling Cities & Architecture</label>
                                </div>
                                <div class="radio-option">
                                    <input type="radio" id="pref-culture" name="contentPreference" value="culture">
                                    <label for="pref-culture">Cultural Experiences & Food</label>
                                </div>
                            </fieldset>
                        </div>
        
                        <div class="form-group checkbox-group">
                            <input type="checkbox" id="newsletter-signup" name="newsletter" value="yes">
                            <label for="newsletter-signup">Yes, sign me up for the "Colorful World" weekly newsletter!</label>
                        </div>
        
                        <div class="form-group">
                            <label for="visitor-opinion">Your Feedback:</label>
                            <textarea id="visitor-opinion" name="visitorOpinion" rows="6" placeholder="Write your thoughts here..." required></textarea>
                        </div>
        
                        <div id="form-buttons">
                            <button type="submit" id="submit-btn">Send Feedback</button>
                            <button type="reset" id="reset-btn">Reset Form</button>
                        </div>
                    </form>
                </section>
            `;
    
        const form = document.getElementById("feedback-form");
    
        if (window.authSystem?.isLoggedIn()) {
            setTimeout(() => window.authSystem.autoFillAuthorName(), 200);
        }
    
        form.addEventListener("submit", (e) => {  //zachytí odoslanie formulára
            e.preventDefault();  // zabráni defaultnému správaniu (reload stránky)
    
            const feedback = {
                name: document.getElementById("visitor-name").value.trim(),
                email: document.getElementById("visitor-email").value.trim(),
                imageUrl: document.getElementById("image-url").value.trim(),
                keywords: document.getElementById("keywords-input").value.trim(),
                preference: form.querySelector("input[name='contentPreference']:checked").value,
                newsletter: form.querySelector("#newsletter-signup").checked,
                opinion: document.getElementById("visitor-opinion").value.trim(),
                date: new Date().toLocaleDateString(),
            };
    
            const stored = JSON.parse(localStorage.getItem("feedbacks")) || [];
            stored.push(feedback);
            localStorage.setItem("feedbacks", JSON.stringify(stored));
    
            alert("Thank you for your feedback!");
            form.reset();
        });
    }
    
    
    
    
    
    
    
    // ========== ARTICLES PAGE (WITH CONTENT AND FILTERING) ==========
    let currentPage = 1;    //globálna premenná pre aktuálnu stránku
    
    function articlesPage(page = 1) {
        //Okamžite zobrazí "Loading..." kým sa načítajú dáta
        const app = document.getElementById('app');
        app.innerHTML = `<h1>Articles</h1><p>Loading...</p>`;
    
        const articlesPerPage = page === 1 ? 10 : 20;
        const offset = page === 1 ? 0 : 10 + (page - 2) * 20;
    
        //ONLINE SERVER
        //const url = `https://wt.kpi.fei.tuke.sk/api/article/?max=${articlesPerPage}&offset=${offset}&tag=${MY_BLOG_TAG}&tagsonly=false`;
    
        //OFFLINE SERVER
        const url = `http://192.168.56.101/api/article?max=${articlesPerPage}&offset=${offset}&tag=${MY_BLOG_TAG}&tagsonly=false`;
    
    
        console.log("Loading articles from:", url);
    
        const ajax = new XMLHttpRequest();  //AJAX request
        ajax.open("GET", url, true);
        ajax.onload = function () {     //zavolá sa keď príde odpoveď
            if (this.status === 200) {      //HTTP kód 200 = úspech
                const data = JSON.parse(this.responseText);     //konvertuje JSON string na objekt, string s odpoveďou
                fetchAndDisplayArticles(data.articles || [], page, articlesPerPage);
            } else {
                app.innerHTML = `<p>Error ${this.status}: ${this.statusText}</p>`;
            }
        };
        ajax.onerror = () => app.innerHTML = "<p>Network error</p>";        //zavolá sa pri network chybe (nie pri HTTP erroroch)
        ajax.send();        //odošle request
    }
    
    
    
    
    
    
    
    // Funkcia na načítanie obsahu článkov a ich zobrazenie
    function fetchAndDisplayArticles(articles, page, articlesPerPage) {
        const app = document.getElementById('app');
    
        // Vždy zobrazí header s tlačidlom "Add New Article"
        let html = `
            <div class="articles-container">
                <section class="continent-template-header articles-container articles-blog">
                    <div class="continent-template-header-content articles-blog-content">
                        <h1><i>Articles</i></h1>
                        <div class="add-article-btn-container">
                            <a href="#/artInsert/${page}" class="btn-add-article red_hover_a red_hover_white_a" >Add New Article</a>
                        </div>
                    </div>
                </section>
            </div>
        `;
    
        //Early return - ak nie sú články, skonči funkciu
        if (articles.length === 0) {
            html += `
                <div class="no-articles-message">
                    <p>No articles yet. Be the first to write one!</p>
                </div>
            </div>
            `;
            app.innerHTML = html;
            return;
        }
    
    
        let loadedCount = 0;                //počíta koľko článkov sa už načítalo
        const articlesWithContent = [];       //prázdne pole na uloženie kompletných článkov
    
        //prejde cez každý článok v poli
        articles.forEach((article, index) => {
            const ajax = new XMLHttpRequest();      //Ďalší AJAX request pre každý článok
    
            //ONLINE SERVER
            //ajax.open('GET', `https://wt.kpi.fei.tuke.sk/api/article/${article.id}`, true);     //Získa kompletný obsah článku podľa ID
    
            //OFFLINE SERVER
            ajax.open('GET', `http://192.168.56.101/api/article/${article.id}`, true);
    
            ajax.addEventListener('load', function() {
                loadedCount++;
    
                if (this.status === 200) {
                    const fullArticle = JSON.parse(this.responseText);
                    //uloží článok na správnu pozíciu
                    articlesWithContent[index] = {
                        id: fullArticle.id,
                        title: fullArticle.title,
                        author: fullArticle.author,
                        content: fullArticle.content || 'No content available', //fallback ak content chýba
                        tags: fullArticle.tags,
                        imageLink: fullArticle.imageLink,
                        page: page
                    };
                } else {
                    articlesWithContent[index] = {
                        id: article.id,
                        title: article.title || 'Untitled',
                        author: article.author || 'Unknown',
                        content: 'Error loading content',
                        page: page
                    };
                }
    
                //Počká kým sa načítajú VŠETKY články až potom zavolá displayArticlesList()
                if (loadedCount === articles.length) {
                    displayArticlesList(articlesWithContent, page, articlesPerPage);
                }
            });
    
            ajax.send();        //Každý ajax.send() beží paralelne
        });
    }
    
    
    
    
    
    
    
    // Helper function to remove hidden tag from tags string for display
    function getVisibleTags(tags) {
        //!tags - ak je null, undefined alebo prázdny string
        if (!tags) {
            return '';
        }
    
        // skontroluje či je to pole
        if (Array.isArray(tags)) {
            return tags
                .filter(tag => tag.trim() !== MY_BLOG_TAG)      //odstráni "enviroment" tag
                .map(tag => '#' + tag)      //pridá # pred každý tag
                .join(' ');     //spojí do stringu s medzerami
        }
    
        // If tags is a string (fallback for old format)
        if (typeof tags === 'string') {
            return tags
                .split(',')     //rozdelí string na pole
                .map(tag => tag.trim())     //odstráni medzery
                .filter(tag => tag !== MY_BLOG_TAG)
                .join(', ');
        }
    
        return '';
    }
    
    
    
    
    
    
    
    // Zobrazenie zoznamu článkov
    function displayArticlesList(articles, page, articlesPerPage) {
        const app = document.getElementById('app');
    
        // Remove hidden tag from articles for display
        const displayArticles = articles.map(article => ({
            ...article,         //Spread operator ...article - skopíruje všetky properties
            tags: getVisibleTags(article.tags)      //Prepíše iba tags s odstráneným skrytým tagom
        }));
    
        // Mustache šablóna rozšírená o content
        const template = `
            <div class="articles-container">
                <section class="continent-template-header articles-container articles-blog">
                    <div class="continent-template-header-content articles-blog-content">
                        <h1><i>Articles</i></h1>
                        <div class="add-article-btn-container">
                            <a href="#/artInsert/${page}" class="btn-add-article red_hover_a red_hover_white_a" >Add New Article</a>
                        </div>
                    </div>
                </section>
            
                {{#articles}}
                    <article class="article-preview">
                        <a href="#/article/{{id}}/{{page}}">
                            <h2>{{title}}</h2>
                            <p class="article-meta">by {{author}}</p>
                        </a>
                    </article>
                {{/articles}}
            </div>
        `;
    
        //pre každý článok v articles vygeneruje HTML, Mustache loop
    
        const rendered = Mustache.render(template, { articles: displayArticles, page });
    
        // Pagination
        const paginationHTML = `
            <div class="pagination">
                ${page > 1 ? `<button id="prevPage">Previous</button>` : ""}
                <span>Page ${page}</span>  
                ${articles.length === articlesPerPage ? `<button id="nextPage">Next</button>` : ""}   
            </div>
        `;
    
        app.innerHTML = rendered + paginationHTML;      //Spojí články a pagination
    
        // Pagination events
        if (page > 1) {
            document.getElementById("prevPage").addEventListener("click", () => {
                currentPage--;      //zníži o 1
                articlesPage(currentPage);
                window.scrollTo({ top: 0, behavior: "smooth" });    //scrollne na vrch stránky
            });
        }
    
        if (articles.length === articlesPerPage) {
            document.getElementById("nextPage").addEventListener("click", () => {
                currentPage++;      //zvysi o 1
                articlesPage(currentPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
    }
    
    // ========== ARTICLE DETAIL PAGE WITH COMMENTS ==========
    function articleDetailPage(id, page, commentPage = 1) {
        const app = document.getElementById('app');
        app.innerHTML = `<h1>Article Detail</h1><p>Loading...</p>`;
    
        //ONLINE SERVER
        //const url = `https://wt.kpi.fei.tuke.sk/api/article/${id}`;     //ID článku z URL
    
        //OFFLINE SERVER
        const url = `http://192.168.56.101/api/article/${id}`;
    
        function reqListener() {
            if (this.status === 200) {
                const article = JSON.parse(this.responseText);
    
                // Remove hidden tag for display
                const visibleTags = getVisibleTags(article.tags);  // Ulož do premennej!
    
                const displayArticle = {
                    ...article,
                    tags: visibleTags,
                    hasTags: visibleTags.length > 0,  // boolean, použije sa v Mustache podmienke kontroluje či string má dĺžku > 0
                };
    
                const template = `
                  <div class="article-detail-container">
                        <article class="article-detail">
                            <h1>{{title}}</h1>
                            <p class="article-meta">by {{author}}</p>
                            {{#imageLink}}      
                            <figure>
                                <img src="{{imageLink}}" alt="{{title}}">
                            </figure>
                            {{/imageLink}}
                            <div class="article-content">{{{content}}}</div>
                            {{#hasTags}}
                            <div class="article-tags" style="background: none">
                                <p>{{tags}}</p>
                            </div>
                            {{/hasTags}}
                            <footer class="article-actions">
                                <button id="backBtn" class="btn-secondary">Back to List</button>
                                <button id="editBtn" class="btn-primary">Edit Article</button>
                                <button id="deleteBtn" class="btn-danger">Delete Article</button>
                            </footer>
                        </article>
                  </div>
                
                  `;
    
                //{{#imageLink}}...{{/imageLink}} - zobrazí sa len ak imageLink existuje a nie je prázdny
                //Triple braces {{{content}}} - nevytvorí HTML escape umožní vloženie HTML tagov do contentu
                //Dvojité {{content}} by zobrazilo <p> ako text namiesto HTML
    
                const rendered = Mustache.render(template, displayArticle);
                app.innerHTML = rendered;
    
                // Back button
                document.getElementById('backBtn').addEventListener('click', () => {
                    window.location.hash = `#/articles?page=${page}`;   //window.location.hash - zmení URL hash. Router to zachytí a zavolá articlesPage(page)
                });
    
                // Edit button - redirect to artEdit route
                document.getElementById('editBtn').addEventListener('click', () => {
                    window.location.hash = `#/artEdit/${id}/${page}`;      //zmení URL hash. Presmeruje na edit/delete stránky
                });
    
                // Delete button - redirect to artDelete route
                document.getElementById('deleteBtn').addEventListener('click', () => {
                    window.location.hash = `#/artDelete/${id}/${page}`;     //zmení URL hash. Router to zachytí a zavolá deletePage
                });
    
                // Po zobrazení článku načíta komentáre
                loadComments(id, page, commentPage);
    
            } else {
                app.innerHTML = `<p>Error loading article: ${this.statusText}</p>`;
            }
        }
    
        const ajax = new XMLHttpRequest();
        ajax.addEventListener('load', reqListener);
        ajax.open('GET', url, true);
        ajax.send();
    }
    
    // ========== LOAD COMMENTS WITH PAGINATION ==========
    function loadComments(articleId, articlePage, commentPage = 1) {
        const app = document.getElementById('app');
    
        // Check if comments section already exists, if so, remove it
        const existingSection = document.getElementById('comments-section');
        if (existingSection) {
            existingSection.remove();       //Predíde duplicitným komentárom pri opätovnom volaní
        }
    
        // Create NEW comments section container
        const commentsSection = document.createElement('section');      //vytvorí nový HTML element
        commentsSection.id = 'comments-section';
        commentsSection.className = 'comments-section';
        commentsSection.innerHTML = '<h2>Comments</h2><p>Loading comments...</p>';
        app.appendChild(commentsSection);       //pridá element ako child
    
        // Stránka 1: offset = 0
        // Stránka 2: offset = 10
        // Stránka 3: offset = 20
        const commentsPerPage = 10;
        const offset = (commentPage - 1) * commentsPerPage;
    
    
        //ONLINE SERVER
        //const url = `https://wt.kpi.fei.tuke.sk/api/article/${articleId}/comment?max=${commentsPerPage}&offset=${offset}`;
    
        //OFFLINE SERVER
        const url = `http://192.168.56.101/api/article/${articleId}/comment?max=${commentsPerPage}&offset=${offset}`;
    
    
    
        function reqListener() {
            if (this.status === 200) {
                const data = JSON.parse(this.responseText);
                const comments = data.comments || [];
    
                //Zavolá funkciu na zobrazenie komentárov
                displayComments(comments, articleId, articlePage, commentPage, commentsPerPage);
    
                // Check if we need to scroll to comments after page reload, dočasné úložisko (zmizne po zatvorení browsera)
                if (sessionStorage.getItem('scrollToComments') === 'true') {
                    sessionStorage.removeItem('scrollToComments');
                    const scrollPos = sessionStorage.getItem('commentScrollPosition');
                    sessionStorage.removeItem('commentScrollPosition');
    
                    // Wait a bit for rendering to complete, then scroll
                    setTimeout(() => {
                        if (scrollPos) {
                            window.scrollTo({ top: parseInt(scrollPos), behavior: 'smooth' });  //konvertuje string na číslo
                        } else {
                            commentsSection.scrollIntoView({ behavior: 'smooth' });     //scrollne element do view
                        }
                    }, 100);    // počká 100ms (DOM musí byť ready)
                }
    
            //Pri chybe stále zobrazí možnosť pridať komentár
            } else {
                commentsSection.innerHTML = `
                    <h2>Comments</h2>
                    <p>Error loading comments.</p>
                    <button id="showCommentFormBtn" class="btn-primary">Add Comment</button>
                    <div id="comment-form-container"></div>
                `;
    
                document.getElementById('showCommentFormBtn').addEventListener('click', () => {
                    showCommentForm(articleId, articlePage, commentPage);
                });
            }
        }
    
        const ajax = new XMLHttpRequest();
        ajax.addEventListener('load', reqListener);
        ajax.open('GET', url, true);
        ajax.send();
    }
    
    
    
    
    
    
    // ========== DISPLAY COMMENTS WITH PAGINATION ==========
    function displayComments(comments, articleId, articlePage, commentPage, commentsPerPage) {
        const commentsSection = document.getElementById('comments-section');
    
        const template = `
            <div class="comments-section-container">
                <div class="comment-section">
                    <h2>Comments</h2>
                    
                    <div class="comments-list">
                        {{#comments}}
                        <div class="comment-card">
                            <div class="comment-header">
                                <strong class="comment-author">{{author}}</strong>
                                <span class="comment-date">{{date}}</span>
                            </div>
                            <div class="comment-text">{{text}}</div>
                        </div>
                        {{/comments}}
                        
                        {{^comments}}
                        <p class="no-comments">No comments yet. Be the first to comment!</p>
                        {{/comments}}
                    </div>
                    
                    <div class="comments-pagination pagination">
                        {{#showPrevious}}
                        <button id="prevCommentsBtn" class="btn-secondary">Previous</button>
                        {{/showPrevious}}
                        <span class="comment-page-info">Page {{commentPage}}</span>
                        {{#showNext}}
                        <button id="nextCommentsBtn" class="btn-secondary">Next</button>
                        {{/showNext}}
                    </div>
                    
                    <button id="showCommentFormBtn" class="btn-primary add-comment-button">Add Comment</button>
                    <div id="comment-form-container"></div>
                </div>
            </div>
        `;
    
        const rendered = Mustache.render(template, {
            comments,
            commentPage: commentPage,
            showPrevious: commentPage > 1,
            showNext: comments.length === commentsPerPage
        });
    
        commentsSection.innerHTML = rendered;
    
        // Previous comments button
        if (commentPage > 1) {
            document.getElementById('prevCommentsBtn').addEventListener('click', () => {
                window.location.hash = `#/article/${articleId}/${articlePage}/${commentPage - 1}`;
                // Scroll to comments section
                setTimeout(() => {
                    document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' });
                }, 100);
            });
        }
    
        // Next comments button
        if (comments.length === commentsPerPage) {
            document.getElementById('nextCommentsBtn').addEventListener('click', () => {
                window.location.hash = `#/article/${articleId}/${articlePage}/${commentPage + 1}`;
                // Scroll to comments section
                setTimeout(() => {
                    document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' });
                }, 100);
            });
        }
    
        // Add Comment button handler
        document.getElementById('showCommentFormBtn').addEventListener('click', () => {
            showCommentForm(articleId, articlePage, commentPage);
        });
    }
    
    // ========== SHOW COMMENT FORM ==========
    function showCommentForm(articleId, articlePage, commentPage) {
        const formContainer = document.getElementById('comment-form-container');
    
        // Check if form is already visible
        if (formContainer.innerHTML.trim() !== '') {
            formContainer.innerHTML = ''; // Hide form
            document.getElementById('showCommentFormBtn').textContent = 'Add Comment';
            return;
        }
    
        const formHTML = `
            <div class="comment-form">
                <h3>Add Your Comment</h3>
                <form id="new-comment-form">
                    <div class="form-group">
                        <label for="comment-author">Your Name:</label>
                        <input type="text" id="comment-author" required placeholder="Enter your name">
                    </div>
                    
                    <div class="form-group">
                        <label for="comment-text">Comment:</label>
                        <textarea id="comment-text" rows="4" required placeholder="Write your comment here..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Submit Comment</button>
                        <button type="button" id="cancelCommentBtn" class="btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        `;
    
        formContainer.innerHTML = formHTML;
        document.getElementById('showCommentFormBtn').textContent = 'Hide Form';
    
        // Scroll to form
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
        // Cancel button
        document.getElementById('cancelCommentBtn').addEventListener('click', () => {
            formContainer.innerHTML = '';
            document.getElementById('showCommentFormBtn').textContent = 'Add Comment';
        });
    
        if (window.authSystem?.isLoggedIn()) {
            setTimeout(() => window.authSystem.autoFillAuthorName(), 200);
        }
    
        // Form submit handler
        document.getElementById('new-comment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            submitComment(articleId, articlePage, commentPage);
        });
    }
    
    // ========== SUBMIT COMMENT ==========
    function submitComment(articleId, articlePage, commentPage) {
        const author = document.getElementById('comment-author').value.trim();
        const text = document.getElementById('comment-text').value.trim();
    
        if (!author || !text) {
            alert('Please fill in all fields');
            return;
        }
    
        const commentData = {
            author: author,
            text: text
        };
    
        console.log('Submitting comment:', commentData);
    
        // Save current scroll position
        const commentsSection = document.getElementById('comments-section');
        const scrollPosition = commentsSection ? commentsSection.offsetTop : 0;
    
        const ajax = new XMLHttpRequest();
    
        //ONLINE SERVER
        //ajax.open('POST', `https://wt.kpi.fei.tuke.sk/api/article/${articleId}/comment`, true);
    
        //OFFLINE SERVER
        ajax.open('POST', `http://192.168.56.101/api/article/${articleId}/comment`, true);
    
    
        ajax.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    
        ajax.addEventListener('load', function() {
            console.log('Comment response status:', this.status);
            console.log('Comment response text:', this.responseText);
    
            if (this.status === 201 || this.status === 200) {
                // NO ALERT - just silently refresh
    
                // Clear and hide form
                const formContainer = document.getElementById('comment-form-container');
                if (formContainer) {
                    formContainer.innerHTML = '';
                }
    
                const showBtn = document.getElementById('showCommentFormBtn');
                if (showBtn) {
                    showBtn.textContent = 'Add Comment';
                }
    
                // Store scroll position in sessionStorage
                sessionStorage.setItem('scrollToComments', 'true');
                sessionStorage.setItem('commentScrollPosition', scrollPosition);
    
                // Reload comments on current page (not redirecting to page 1)
                window.location.hash = `#/article/${articleId}/${articlePage}/${commentPage}`;
                window.location.reload();
    
            } else {
                alert('Error adding comment. Status: ' + this.status + ', Message: ' + this.responseText);
            }
        });
    
        ajax.addEventListener('error', function() {
            console.error('Network error occurred');
            alert('Network error - check console for details');
        });
    
        ajax.send(JSON.stringify(commentData));
    }
    
    // ========== ARTICLE INSERT PAGE ==========
    function articleInsertPage(returnPage) {
        const app = document.getElementById('app');
    
        const formHTML = `
            <div class="article-form-container">
                <h1>Add New Article</h1>
                <form id="article-form">
                    <div class="form-group">
                        <label for="article-title">Title:</label>
                        <input type="text" id="article-title" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="article-author">Author:</label>
                        <input type="text" id="article-author" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="article-content">Content (HTML allowed):</label>
                        <textarea id="article-content" rows="15" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="article-tags">Tags (comma separated):</label>
                        <input type="text" id="article-tags" placeholder="climate, environment, sustainability">
                    </div>
                    
                    <div class="form-group">
                        <label for="article-image">Image URL:</label>
                        <input type="url" id="article-image" placeholder="https://example.com/image.jpg">
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary create-article">Create Article</button>
                        <button type="button" id="cancelBtn" class="btn-secondary cancel-article">Cancel</button>
                    </div>
                </form>
            </div>
        `;
    
        app.innerHTML = formHTML;
    
        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            window.location.hash = `#/articles?page=${returnPage}`;
        });
    
        // AUTOMATICKY doplň meno ak je prihlásený
        if (window.authSystem?.isLoggedIn()) {
            setTimeout(() => window.authSystem.autoFillAuthorName(), 200);
        }
    
        // Form handler
        const handler = new ArticleFormsHandler();
        handler.handleInsert(returnPage);
    }
    
    // ========== ARTICLE EDIT PAGE ==========
    function articleEditPage(id, returnPage) {
        const app = document.getElementById('app');
        app.innerHTML = `<h1>Edit Article</h1><p>Loading...</p>`;
    
        //ONLINE SERVER
        //const url = `https://wt.kpi.fei.tuke.sk/api/article/${id}`;
    
        //OFFLINE SERVER
        const url = `http://192.168.56.101/api/article/${id}`;
    
    
        function reqListener() {
            if (this.status === 200) {
                const article = JSON.parse(this.responseText);
    
                // Remove hidden tag for editing - user should only see their custom tags
                const visibleTags = getVisibleTags(article.tags);
    
                const formHTML = `
                    <div class="article-form-container">
                        <h1>Edit Article</h1>
                        <form id="article-form">
                            <div class="form-group">
                                <label for="article-title">Title:</label>
                                <input type="text" id="article-title" value="${article.title || ''}" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="article-author">Author:</label>
                                <input type="text" id="article-author" value="${article.author || ''}" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="article-content">Content (HTML allowed):</label>
                                <textarea id="article-content" rows="15" required>${article.content || ''}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label for="article-tags">Tags (comma separated):</label>
                                <input type="text" id="article-tags" value="${visibleTags}" placeholder="climate, environment, sustainability">
                            </div>
                            
                            <div class="form-group">
                                <label for="article-image">Image URL:</label>
                                <input type="url" id="article-image" value="${article.imageLink || ''}" placeholder="https://example.com/image.jpg">
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn-primary">Update Article</button>
                                <button type="button" id="cancelBtn" class="btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                `;
    
                app.innerHTML = formHTML;
    
                // Cancel button
                document.getElementById('cancelBtn').addEventListener('click', () => {
                    window.location.hash = `#/article/${id}/${returnPage}`;
                });
    
                if (window.authSystem?.isLoggedIn()) {
                    setTimeout(() => window.authSystem.autoFillAuthorName(), 200);
                }
    
                // Form handler
                const handler = new ArticleFormsHandler();
                handler.handleEdit(id, returnPage);
    
            } else {
                app.innerHTML = `<p>Error loading article: ${this.statusText}</p>`;
            }
        }
    
        const ajax = new XMLHttpRequest();
        ajax.addEventListener('load', reqListener);
        ajax.open('GET', url, true);
        ajax.send();
    }
    
    // ========== ARTICLE DELETE PAGE ==========
    function articleDeletePage(id, returnPage) {
        const app = document.getElementById('app');
    
        const confirmHTML = `
            <div class="delete-confirm-container">
                <div class="delete-article">
                    <h1>Delete Article</h1>
                    <p class="warning-message">Are you sure you want to delete this article? This action cannot be undone.</p>
                    <div class="form-actions delete-buttons">
                        <button id="confirmDeleteBtn" class="btn-danger">Yes, Delete</button>
                        <button id="cancelDeleteBtn" class="btn-secondary">Cancel</button>
                    </div>
                </div>
            </div>
        `;
    
        app.innerHTML = confirmHTML;
    
        // Cancel button
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            window.location.hash = `#/article/${id}/${returnPage}`;
        });
    
        // Confirm delete
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            const ajax = new XMLHttpRequest();
    
            //ONLINE SERVER
            //ajax.open('DELETE', `https://wt.kpi.fei.tuke.sk/api/article/${id}`, true);
    
            //OFFLINE SERVER
            ajax.open('DELETE', `http://192.168.56.101/api/article/${id}`, true);
    
            ajax.addEventListener('load', function() {
                if (this.status === 200 || this.status === 204) {
                    alert('Article successfully deleted!');
                    window.location.hash = `#/articles?page=${returnPage}`;
                } else {
                    alert('Error deleting article: ' + this.statusText);
                }
            });
    
            ajax.send();
        });
    }
    
    // ========== OPINIONS PAGE ==========
    function opinionsPage() {
        let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
        feedbacks = feedbacks.slice().reverse();
    
        const template = `
            <section class="continent-template-header opinions-blog">
                <div class="continent-template-header-content opinions-blog-content">
                    <h1><i>Opinions</i></h1>
                </div>
            </section>
    
            <div class="opinions-container-blog">
                {{#feedbacks}}
                <div class="opinion-card-blog">
                    <div class="opinion-header-blog">
                        <h3>{{name}}</h3>
                        <span class="opinion-date-blog">{{date}}</span>
                    </div>
                    <div class="opinion-content-blog">
                        <p>{{opinion}}</p>
                    </div>
                </div>
                {{/feedbacks}}
    
                {{^feedbacks}}
                <div class="no-opinions-blog">
                    <p>No opinions yet. Be the first to share your thoughts!</p>
                </div>
                {{/feedbacks}}
            </div>
        `;
    
        const rendered = Mustache.render(template, { feedbacks });
        document.getElementById('app').innerHTML = rendered;
    }
    
    // ========== 404 PAGE ==========
    function notFoundPage() {
        document.getElementById('app').innerHTML = `
            <div class="error-page">
                <h1>404 - Page Not Found</h1>
                <p>Sorry, this page does not exist.</p>
                <a href="#/" class="btn-primary">Go to Home</a>
            </div>
        `;
    }
    
    // ========== ROUTER ==========
    export function router() {
        const hash = window.location.hash || '#/';
    
        // artInsert: #/artInsert/{returnPage}
        if (hash.startsWith('#/artInsert/')) {
            const parts = hash.split('/');
            const returnPage = parts[2] ? Number(parts[2]) : 1;
            articleInsertPage(returnPage);
            return;
        }
    
        // artEdit: #/artEdit/{id}/{returnPage}
        if (hash.startsWith('#/artEdit/')) {
            const parts = hash.split('/');
            const id = parts[2];
            const returnPage = parts[3] ? Number(parts[3]) : 1;
            articleEditPage(id, returnPage);
            return;
        }
    
        // artDelete: #/artDelete/{id}/{returnPage}
        if (hash.startsWith('#/artDelete/')) {
            const parts = hash.split('/');
            const id = parts[2];
            const returnPage = parts[3] ? Number(parts[3]) : 1;
            articleDeletePage(id, returnPage);
            return;
        }
    
        // article detail: #/article/{id}/{articlePage}/{commentPage}
        if (hash.startsWith('#/article/')) {
            const parts = hash.split('/');
            const id = parts[2];
            const articlePage = parts[3] ? Number(parts[3]) : 1;
            const commentPage = parts[4] ? Number(parts[4]) : 1;
            articleDetailPage(id, articlePage, commentPage);
            return;
        }
    
        // articles list with page param: #/articles?page=2
        if (hash.startsWith('#/articles')) {
            const [path, query] = hash.split('?');
            let page = 1;
            if (query) {
                const params = new URLSearchParams(query);
                const pageParam = Number(params.get('page'));
                if (!isNaN(pageParam) && pageParam > 0) {
                    page = pageParam;
                }
            }
            currentPage = page;
            articlesPage(page);
            return;
        }
    
        // Static routes
        const pageFn = routes[hash] || notFoundPage;
        pageFn();
    }
    
    
    
    
    
    
    
