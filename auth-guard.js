// auth-guard.js — Add this as the FIRST <script> tag on every protected page.
// <script src="auth-guard.js"></script>
(function () {
    if (localStorage.getItem("doctorVerified") !== "true") {
        window.location.replace("login.html");
    }
})();
