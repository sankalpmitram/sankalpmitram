document.getElementById("loginBtn").addEventListener("click", async () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

        const response = await fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const result = await response.json();

        if (result.success) {

            window.location.href = "/admin/dashboard.html";

        } else {

            document.getElementById("msg").innerHTML =
                "❌ Username या Password गलत है";

        }

    } catch (err) {

        document.getElementById("msg").innerHTML =
            "❌ Server Error";

    }

});