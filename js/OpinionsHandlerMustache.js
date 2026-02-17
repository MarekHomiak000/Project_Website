// js/OpinionsHandlerMustache.js

export class OpinionsHandlerMustache {
    constructor(
        storageKey = 'colorfulWorldFeedback',
        templateId = 'opinion-template',
        containerId = 'opinions-container',
        maxItems = 3  // ← NOVÝ parameter
    ) {
        this.storageKey = storageKey;
        this.templateId = templateId;
        this.containerId = containerId;
        this.maxItems = maxItems;

        this.template = document.getElementById(this.templateId)?.innerHTML;
        this.container = document.getElementById(this.containerId);

        if (!this.template || !this.container) {
            console.error('Šablóna alebo kontajner neboli nájdené!');
            return;
        }

        if (!window.Mustache) {
            console.error('Mustache nie je načítaný!');
            return;
        }

        this.render();
    }

    getFeedbacks() {
        const data = localStorage.getItem(this.storageKey);
        if (!data) return [];

        try {
            const parsed = JSON.parse(data);
            if (!Array.isArray(parsed)) return [];

            // Zoradenie podľa dátumu (najnovšie prvé)
            return parsed
                .sort((a, b) => new Date(b.created) - new Date(a.created))
                .slice(0, this.maxItems); // ← iba prvé 3
        } catch (e) {
            console.error('Chyba pri parsovaní localStorage:', e);
            return [];
        }
    }

    render() {
        const feedbacks = this.getFeedbacks();

        if (feedbacks.length === 0) {
            this.container.innerHTML = '<p class="no-opinions">No opinions yet.</p>';
            return;
        }

        const html = feedbacks.map(fb => {
            return window.Mustache.render(this.template, {
                name: fb.name || 'Anonym',
                opinion: fb.opinion || '',
                date: new Date(fb.created).toLocaleDateString('sk-SK'),
            });
        }).join('');

        this.container.innerHTML = html;
    }

    refresh() {
        this.render();
    }
}