/* ===========================================
   SUPABASE CONFIGURATION
=========================================== */

const SUPABASE_URL = "https://ybzmspumaybllrzrxnkk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inliem1zcHVtYXlibGxyenJ4bmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNDc2MzcsImV4cCI6MjA5OTYyMzYzN30.yc1dwmBf7pRyljBIbQYE8aQa9yAAMqQcXSsT4U0WITo";

if (!window.supabase) {
    alert("Supabase library failed to load.");
    throw new Error("Supabase library not loaded.");
}

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

/* ===========================================
   FORM SWITCHING
=========================================== */

function toggleForms() {

    const login = document.getElementById("login-form");
    const register = document.getElementById("register-form");
    const reset = document.getElementById("reset-form");

    login.classList.toggle("hidden");
    register.classList.toggle("hidden");

    if (reset) {
        reset.classList.add("hidden");
    }

}

function showLogin() {

    document.getElementById("login-form").classList.remove("hidden");

    document.getElementById("register-form").classList.add("hidden");

    const reset = document.getElementById("reset-form");

    if (reset) {
        reset.classList.add("hidden");
    }

}

/* ===========================================
   PASSWORD TOGGLE
=========================================== */

function togglePassword(id, icon) {

    const input = document.getElementById(id);

    const eye = icon.querySelector("i");

    if (input.type === "password") {

        input.type = "text";

        eye.classList.remove("fa-eye");

        eye.classList.add("fa-eye-slash");

    } else {

        input.type = "password";

        eye.classList.remove("fa-eye-slash");

        eye.classList.add("fa-eye");

    }

}

/* ===========================================
   REGISTER
=========================================== */

async function register() {

    const username = document.getElementById("reg-name").value.trim();

    const email = document.getElementById("reg-email").value.trim();

    const phone = document.getElementById("reg-phone").value.trim();

    const password = document.getElementById("reg-password").value;

    const confirm = document.getElementById("confirm-password").value;

    const terms = document.getElementById("terms").checked;

    if (username === "") {
        alert("Please enter Name.");
        return;
    }

    if (email === "") {
        alert("Please enter Email.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid Email.");
        return;
    }

    if (phone === "") {
        alert("Please enter Phone Number.");
        return;
    }

    if (password === "") {
        alert("Please enter Password.");
        return;
    }

    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }

    if (!terms) {
        alert("Please accept the Terms & Conditions.");
        return;
    }

    const button = document.querySelector("#register-form button");

    const oldText = button.innerHTML;

    button.disabled = true;

    button.innerHTML = "Creating Account...";

    try {

        const { data, error } = await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {

                data: {

                    username: username,

                    phone: phone

                }

            }

        });

        if (error) {

            alert(error.message);

        } else {

            alert("Registration successful! Please verify your email.");

            console.log(data);

            document.getElementById("register-form").reset?.();

            toggleForms();

        }

    } catch (err) {

        alert(err.message);

    }

    button.disabled = false;

    button.innerHTML = oldText;

}

/* ===========================================
   LOGIN
=========================================== */

async function login() {

    const email = document.getElementById("login-email").value.trim();

    const password = document.getElementById("login-password").value;

    if (email === "") {
        alert("Please enter your Email.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid Email.");
        return;
    }

    if (password === "") {
        alert("Please enter your Password.");
        return;
    }

    const button = document.querySelector("#login-form button");

    const oldText = button.innerHTML;

    button.disabled = true;

    button.innerHTML = "Signing In...";

    try {

        const { data, error } = await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });

        if (error) {

            alert(error.message);

        } else {

            alert("Login Successful!");

            console.log(data);

            /*
            Redirect to dashboard
            Uncomment when dashboard.html exists

            window.location.href = "dashboard.html";
            */

        }

    } catch (err) {

        alert(err.message);

    }

    button.disabled = false;

    button.innerHTML = oldText;

}

/* ===========================================
   FORGOT PASSWORD
=========================================== */

async function forgotPassword() {

    const email =
        document.getElementById("login-email")?.value ||
        document.getElementById("reset-email")?.value;

    if (!email) {

        alert("Please enter your email address.");

        return;

    }

    try {

        const { error } =
            await supabaseClient.auth.resetPasswordForEmail(email, {

                redirectTo:
                    window.location.origin +
                    "/reset-password.html"

            });

        if (error) {

            alert(error.message);

        } else {

            alert(
                "Password reset link has been sent to your email."
            );

        }

    } catch (err) {

        alert(err.message);

    }

}

/* ===========================================
   CHECK SESSION
=========================================== */

async function checkSession() {

    const { data } =
        await supabaseClient.auth.getSession();

    if (data.session) {

        console.log("User already logged in.");

        /*
        Uncomment after dashboard exists

        window.location.href = "dashboard.html";

        */

    }

}

/* ===========================================
   LOGOUT
=========================================== */

async function logout() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        alert(error.message);

        return;

    }

    alert("Logged out successfully.");

    window.location.reload();

}

/* ===========================================
   EMAIL VALIDATION
=========================================== */

function isValidEmail(email) {

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);

}

/* ===========================================
   PASSWORD STRENGTH
=========================================== */

function passwordStrength(password) {

    let score = 0;

    if (password.length >= 8) score++;

    if (/[A-Z]/.test(password)) score++;

    if (/[a-z]/.test(password)) score++;

    if (/[0-9]/.test(password)) score++;

    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;

}

/* ===========================================
   REGISTER VALIDATION
=========================================== */

const regPassword =
    document.getElementById("reg-password");

if (regPassword) {

    regPassword.addEventListener("keyup", function () {

        const score =
            passwordStrength(this.value);

        if (score <= 2) {

            this.style.borderBottomColor = "#ff4d4d";

        }

        else if (score === 3) {

            this.style.borderBottomColor = "#ffa500";

        }

        else {

            this.style.borderBottomColor = "#2ecc71";

        }

    });

}

/* ===========================================
   ENTER KEY SUPPORT
=========================================== */

document.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        if (!document
            .getElementById("login-form")
            .classList.contains("hidden")) {

            login();

        }

        else if (!document
            .getElementById("register-form")
            .classList.contains("hidden")) {

            register();

        }

    }

});

/* ===========================================
   CLEAR FORMS
=========================================== */

function clearForms() {

    document
        .querySelectorAll("input")
        .forEach(input => {

            if (
                input.type === "text" ||
                input.type === "email" ||
                input.type === "password" ||
                input.type === "tel"
            ) {

                input.value = "";

            }

            if (input.type === "checkbox") {

                input.checked = false;

            }

        });

}

/* ===========================================
   AUTH STATE LISTENER
=========================================== */

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log("Auth Event:", event);

        if (session) {

            console.log("Logged in user:", session.user.email);

        }

    });

/* ===========================================
   PAGE LOAD
=========================================== */

window.onload = function () {

    checkSession();

};
