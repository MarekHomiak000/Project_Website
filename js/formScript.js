// js/formScript.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedback-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        // --- Získanie dát ---
        const name = document.getElementById('visitor-name').value.trim();
        const email = document.getElementById('visitor-email').value.trim();
        const imageUrl = document.getElementById('image-url').value.trim();
        const opinion = document.getElementById('visitor-opinion').value.trim();
        const keywords = document.getElementById('keywords-input').value.trim();
        const contentPref = form.elements['contentPreference'].value;
        const newsletter = document.getElementById('newsletter-signup').checked;

        if (!name || !email || !opinion) {
            alert('Fill all required fields.');
            return;
        }

        // --- Uloženie ---
        const newFeedback = {
            name, email, imageUrl: imageUrl || null,
            keywords, contentPreference: contentPref,
            newsletter, opinion,
            created: new Date().toISOString()
        };

        const list = JSON.parse(localStorage.getItem('colorfulWorldFeedback') || '[]');
        list.push(newFeedback);
        localStorage.setItem('colorfulWorldFeedback', JSON.stringify(list));

        // --- ZOBRAZIŤ NA INDEXE ---
        if (window.opinionsHandler && typeof window.opinionsHandler.refresh === 'function') {
            window.opinionsHandler.refresh();
        }

        alert(`Thank you, ${name.split(' ')[0]}!`);
        form.reset();
    });
});