// =========================
// आज की तारीख
// =========================

const today = new Date();

document.getElementById("todayDate").innerHTML =
    today.toLocaleDateString("hi-IN");

// =========================
// Manual Values
// =========================

const MANUAL_VIKRAM = "2083";
const MANUAL_MONTH = "ज्येष्ठ";

// =========================
// Sankalp Template
// =========================

const SANKALP_TEMPLATE = `

ॐ विष्णुर्विष्णुर्विष्णुः ॥

श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया प्रवर्तमानस्य अद्य श्रीब्रह्मणोऽह्नि द्वितीयपरार्धे,
श्रीश्वेतवाराहकल्पे,वैवस्वतमन्वन्तरे,अष्टाविंशतितमे कलियुगे,कलिप्रथमचरणे,
जम्बूद्वीपे,भारतवर्षे,भरतखण्डे,आर्यावर्तैकदेशान्तर्गते,
गङ्गायमुनयोः पश्चिमे तटे,नर्मदायाः उत्तरे तटे,
पुष्करारण्ये,कुमारिकानाम्नि क्षेत्रे,
{{state}}-प्रदेशे,
{{district}}-मण्डलान्तर्गते,
{{city}}-नगरे (वा {{village}}-ग्रामे),

विक्रमसंवत् {{vikram}},{{ayana}} अयने,{{ritu}} ऋतौ,
{{month}} मासे,{{paksha}},{{tithi}} तिथौ,{{weekday}} वासरे,
{{nakshatra}} नक्षत्रे,{{yoga}} योगे,{{karana}} करणे,

{{sunSign}} राशिस्थिते सूर्ये,

{{moonSign}} राशिस्थिते चन्द्रे,

{{jupiterSign}} राशिस्थिते गुरौ,

शेषेषु ग्रहेषु यथायथाराशिस्थितेषु सत्सु,

एवं ग्रहगुणगणविशेषणविशिष्टायां शुभपुण्यतिथौ,

{{gotra}} गोत्रोत्पन्नः,

{{name}} सपत्नीकः अहम्,

ममात्मनः कायिक-वाचिक-मानसिक-सांसर्गिक-चतुर्विध-पाप-क्षयपूर्वकम्,

आध्यात्मिक-आधिदैविक-आधिभौतिक-त्रिविधतापनिवृत्त्यर्थम्,

आयुरारोग्य-ऐश्वर्याभिवृद्ध्यर्थम्,

आदित्यादि-नवग्रहानुकूलतासिद्ध्यर्थम्,

लोके सभायां राजद्वारे च सर्वत्र यशोविजयलाभादिप्राप्त्यर्थम्,

श्रुति-स्मृति-पुराणोक्त-फलप्राप्तिपूर्वकम्,

धर्मार्थकाममोक्ष-चतुर्विधपुरुषार्थसिद्धिद्वारा,सकलदुरितक्षयद्वारा,

{{devata}} प्रीत्यर्थम्,

{{manokamana}} सिद्ध्यर्थम्,

{{karma}} अहं करिष्ये ॥

`;

// =========================
// Sankalp Generator
// =========================

function generateSankalp(data) {

    let sankalp = SANKALP_TEMPLATE;

    for (const key in data) {
        sankalp = sankalp.replaceAll(`{{${key}}}`, data[key]);
    }

    document.getElementById("sankalpText").innerHTML =
        sankalp.replace(/\n/g, "<br>");
}

// =========================
// Panchang API
// =========================

async function loadPanchang() {

    try {

        const response = await fetch("https://sankalpmitram.onrender.com/today");

const result = await response.json();

if (!response.ok) {
    throw new Error(result.message || "Panchang Load Failed");
}

        // वार
        document.getElementById("todayDay").innerHTML =
            result.weekday;

        // विक्रम संवत
        document.getElementById("vikram").innerHTML =
            MANUAL_VIKRAM;

        // मास
        document.getElementById("month").innerHTML =
            MANUAL_MONTH;

        // पक्ष
        document.getElementById("paksha").innerHTML =
            result.paksha;

        // तिथि
        document.getElementById("tithi").innerHTML =
            result.tithi;

        // नक्षत्र
        document.getElementById("nakshatra").innerHTML =
            result.nakshatra;

        // योग
        document.getElementById("yoga").innerHTML =
            result.yoga;

        // करण
        document.getElementById("karana").innerHTML =
            result.karana;

        // =========================
        // Sankalp Generate
        // =========================

        generateSankalp({

            state: "राजस्थान",

            district: "जोधपुर",

            city: "जोधपुर",

            village: "",

            vikram: MANUAL_VIKRAM,

            ayana: result.ayana,

            ritu: result.ritu,

            month: MANUAL_MONTH,

            paksha: result.paksha,

            tithi: result.tithi,

            weekday: result.weekday,

            nakshatra: result.nakshatra,

            yoga: result.yoga,

            karana: result.karana,

            sunSign: result.sunSign,

            moonSign: result.moonSign,

            jupiterSign: result.jupiterSign,

            gotra: "वत्स ",

            name: "नन्दकिशोरपारीक",

            devata: "श्रीगणेशस्य",

            manokamana: "सर्वाभीष्ट",

            karma: "श्रीगणपतिपूजनम्"

        });

            } catch (err) {

        console.error("Panchang Error:", err);

        document.getElementById("todayDay").innerHTML = "—";
        document.getElementById("vikram").innerHTML = MANUAL_VIKRAM;
        document.getElementById("month").innerHTML = MANUAL_MONTH;
        document.getElementById("paksha").innerHTML = "—";
        document.getElementById("tithi").innerHTML = "—";
        document.getElementById("nakshatra").innerHTML = "—";
        document.getElementById("yoga").innerHTML = "—";
        document.getElementById("karana").innerHTML = "—";

        document.getElementById("sankalpText").innerHTML =
            "<span style='color:red'>संकल्प लोड नहीं हो पाया। कृपया Server चालू है या नहीं, जाँचें।</span>";

    }

}

loadPanchang();