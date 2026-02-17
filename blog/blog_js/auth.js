// ========== GOOGLE SIGN-IN AUTHENTICATION SYSTEM (2025 BEST PRACTICES) ==========

let currentUser = null;

// Global callback — MUST be named exactly this for Google Identity Services
window.handleCredentialResponse = function (response) {
    if (!response || !response.credential) {
        console.error("No credential received from Google");
        showAuthMessage("Sign-in failed. Please try again.", "error");
        return;
    }

    try {
        const token = response.credential;
        const payload = parseJwt(token);

        currentUser = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture || "https://via.placeholder.com/40",
            token: token,
            expires_at: payload.exp * 1000 // for easier expiry checks
        };

        sessionStorage.setItem("user", JSON.stringify(currentUser));
        console.log("User signed in:", currentUser.name);

        updateAuthUI();
        //showAuthMessage(`Welcome, ${currentUser.name}!`);
        autoFillAuthorName();

    } catch (err) {
        console.error("Sign-in parsing error:", err);
        showAuthMessage("Sign-in failed. Try again.", "error");
    }
};

// Helper: safely decode JWT without external libraries
function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );
    return JSON.parse(jsonPayload);
}

// Initialize Google Sign-In (new GIS method)
function initializeGoogleSignIn() {
    if (!window.google?.accounts) {
        console.error("Google Identity Services not loaded yet");
        return;
    }

    google.accounts.id.initialize({
        client_id: "361455666008-aegd1ktj2caite9jl6u4ju0j9jcks483.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_select: true,
        cancel_on_tap_outside: false,
        use_fedcm_for_prompt: false,          // ← disables One Tap FedCM
        context: "signin"                     // ← THIS IS THE MISSING LINE!
    });

    const button = document.getElementById("google-signin-button");
    if (button) {
        google.accounts.id.renderButton(button, {
            theme: "filled_blue",
            size: "large",
            text: "signin   ",
            shape: "pill",
            logo_alignment: "left",
            width: button.offsetWidth || 100
        });
        console.log("Google Sign-In button rendered");
    }

}

// Update UI based on login state + attach sign-out handler
function updateAuthUI() {
    const authSection = document.getElementById("auth-section");
    const userSection = document.getElementById("user-section");
    const avatar = document.getElementById("user-avatar");
    const nameEl = document.getElementById("user-name");
    const signoutBtn = document.getElementById("signout-btn");

    if (!currentUser) {
        if (authSection) authSection.style.display = "block";
        if (userSection) userSection.style.display = "none";
        return;
    }

    // User is logged in → show user info, hide sign-in button
    if (authSection) authSection.style.display = "none";
    if (userSection) {
        userSection.style.display = "flex";
        if (avatar) avatar.src = currentUser.picture;
        if (nameEl) nameEl.textContent = currentUser.name;

        // CRITICAL: Attach click handler to Sign Out button
        if (signoutBtn) {
            // Remove any previous listener to avoid duplicates
            signoutBtn.replaceWith(signoutBtn.cloneNode(true));
            const newBtn = document.getElementById("signout-btn");
            newBtn.addEventListener("click", signOut);
            console.log("Sign-out button connected");
        }
    }
}

// Sign out
function signOut() {
    google.accounts.id.disableAutoSelect();
    sessionStorage.removeItem("user");
    currentUser = null;
    updateAuthUI();
    //showAuthMessage("Signed out successfully");
    window.location.hash = "#/";
}

// Restore session + check token expiry
function restoreSession() {
    const saved = sessionStorage.getItem("user");
    if (!saved) return;

    try {
        const user = JSON.parse(saved);
        const payload = parseJwt(user.token);

        if (payload.exp * 1000 > Date.now() + 60000) { // valid at least 1 more minute
            currentUser = user;
            console.log("Session restored for:", currentUser.name);
            updateAuthUI();
            autoFillAuthorName();
            // Refresh One Tap state
            setTimeout(() => google.accounts.id.prompt(), 1000);
        } else {
            console.log("Token expired – clearing session");
            sessionStorage.removeItem("user");
        }
    } catch (e) {
        console.error("Failed to restore session:", e);
        sessionStorage.removeItem("user");
    }
}

// Toast notifications
function showAuthMessage(message, type = "success") {
    // Remove old
    document.querySelectorAll("#auth-toast").forEach(el => el.remove());

    const toast = document.createElement("div");
    toast.id = "auth-toast";
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px; right: 20px;
        background: ${type === "error" ? "#dc3545" : "#28a745"};
        color: white;
        padding: 14px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 500;
        animation: slideInRight 0.4s ease-out;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "slideOutRight 0.4s ease-in";
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Auto-fill author name whenever a form appears (ak je prihlásený)
function autoFillAuthorName() {
    if (!currentUser) return;

    setTimeout(() => {
        const fields = ["article-author", "comment-author", "visitor-name"];

        fields.forEach(id => {
            const input = document.getElementById(id);
            if (input && !input.value.trim()) {
                input.value = currentUser.name;

                // Len pridáme CSS triedu – žiadny inline štýl!
                input.classList.add("auto-filled-name");

                // Voliteľný jemný hint pod poľom
                if (!document.getElementById(`hint-${id}`)) {
                    const hint = document.createElement("small");
                    hint.id = `hint-${id}`;

                    input.parentNode.appendChild(hint);
                }
            }
        });
    }, 150);
}

// Public API
window.authSystem = {
    getCurrentUser: () => currentUser,
    isLoggedIn: () => !!currentUser,
    signOut,
    autoFillAuthorName
};

// Add animations
if (!document.getElementById("auth-animations")) {
    const style = document.createElement("style");
    style.id = "auth-animations";
    style.textContent = `
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    `;
    document.head.appendChild(style);
}

// ========== INITIALIZATION ==========
function initAuth() {
    console.log("Initializing auth system...");

    restoreSession();

    // Wait for Google script to load
    const interval = setInterval(() => {
        if (window.google?.accounts) {
            clearInterval(interval);
            initializeGoogleSignIn();
            updateAuthUI();
        }
    }, 100);

    setTimeout(() => clearInterval(interval), 10000); // safety
}

// Start when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuth);
} else {
    initAuth();
}