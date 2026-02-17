// searchScript.js
const searchInput = document.getElementById("searchInput");
const itemsList = document.getElementById("itemsList");
const items = itemsList.getElementsByTagName("li");

searchInput.addEventListener("keyup", function() {
    const filter = searchInput.value.toLowerCase().trim();

    // Hide list if nothing is typed
    if (filter === "") {
        itemsList.style.display = "none";
        return;
    }

    let matchFound = false;

    for (let i = 0; i < items.length; i++) {
        const text = items[i].textContent || items[i].innerText;
        if (text.toLowerCase().includes(filter)) {
            items[i].style.display = "";
            matchFound = true;
        } else {
            items[i].style.display = "none";
        }
    }

    // Only show list if there are matching results
    itemsList.style.display = matchFound ? "block" : "none";
});



