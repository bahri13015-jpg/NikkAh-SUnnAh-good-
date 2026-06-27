// ===============================
// CONFIGURATION SUPABASE
// ===============================

const SUPABASE_URL = "https://hozxklpzfzmrswzbamye.supabase.co";
const SUPABASE_KEY = "sb_publishable_MurlKY4clW48vcHYcuXCMw_WrbuhDIA";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ===============================
// ELEMENTS
// ===============================

const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");
const forgotPassword = document.getElementById("forgotPassword");

// ===============================
// AFFICHER / MASQUER LE MOT DE PASSE
// ===============================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        password.type = "password";
        togglePassword.textContent = "👁";
    }

});

// ===============================
// CONNEXION
// ===============================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.innerHTML = "";
    message.style.color = "#c9a227";

    const userEmail = email.value.trim();
    const userPassword = password.value;

    if (!userEmail || !userPassword) {

        message.style.color = "red";
        message.innerHTML = "Veuillez remplir tous les champs.";

        return;

    }

    const { data, error } = await supabase.auth.signInWithPassword({

        email: userEmail,
        password: userPassword

    });

    if (error) {

        message.style.color = "red";
        message.innerHTML = error.message;

        return;

    }

    message.style.color = "green";
    message.innerHTML = "Connexion réussie...";

    setTimeout(() => {

        window.location.href = "index.html";

    }, 1000);

});

// ===============================
// MOT DE PASSE OUBLIE
// ===============================

forgotPassword.addEventListener("click", async (e) => {

    e.preventDefault();

    const mail = prompt("Entrez votre adresse email :");

    if (!mail) return;

    const { error } = await supabase.auth.resetPasswordForEmail(mail, {

        redirectTo: window.location.origin + "/nouveau-mot-de-passe.html"

    });

    if (error) {

        alert(error.message);

    } else {

        alert("Un email de réinitialisation vient d'être envoyé.");

    }

});

// ===============================
// SESSION
// ===============================

(async () => {

    const { data } = await supabase.auth.getSession();

    if (data.session) {

        window.location.href = "index.html";

    }

})();
