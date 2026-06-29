document.getElementById("saveBtn").addEventListener("click", async () => {

    const data = {

        weekday: document.getElementById("weekday").value,
        paksha: document.getElementById("paksha").value,
        tithi: document.getElementById("tithi").value,
        nakshatra: document.getElementById("nakshatra").value,
        yoga: document.getElementById("yoga").value,
        karana: document.getElementById("karana").value,
        ritu: document.getElementById("ritu").value,
        ayana: document.getElementById("ayana").value,
        sunSign: document.getElementById("sunSign").value,
        moonSign: document.getElementById("moonSign").value,
        jupiterSign: document.getElementById("jupiterSign").value

    };

    try {

        const response = await fetch("/save", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (result.success) {

            document.getElementById("msg").innerHTML =
            "✅ Panchang Successfully Saved";

        } else {

            document.getElementById("msg").innerHTML =
            "❌ Save Failed";

        }

    } catch (err) {

        document.getElementById("msg").innerHTML =
        "❌ Server Error";

    }

});

document.getElementById("logoutBtn").addEventListener("click", () => {

    window.location.href = "/admin";

});