import { db } from "./firebase.js"
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"

// Navigation Bar
document.addEventListener("DOMContentLoaded", () => {
      document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".nav-links").classList.toggle("active");
      });
    });

// Compatibility section
const compatibility = {
    "A+":  { donate: ["A+", "AB+"], receive: ["A+", "A-", "O+", "O-"] },
    "A-":  { donate: ["A+", "A-", "AB+","AB-"], receive: ["A-", "O-"] },
    "B+":  { donate: ["B+", "AB+"], receive: ["B+", "B-", "O+", "O-"] },
    "B-":  { donate: ["B+", "B-","AB+","AB-"], receive: ["B-", "O-"] },
    "AB+": { donate: ["AB+"], receive: ["all types"] },
    "AB-": { donate: ["AB+", "AB-"], receive: ["A-","B-","AB-","O-"] },
    "O+":  { donate: ["A+","B+","O+","AB+"], receive: ["O+", "O-"] },
    "O-":  { donate: ["all types"], receive: ["O-"] },
}

const buttons = document.querySelectorAll(".compatibility_selection button");
const donateResult = document.getElementById("donate_result");
const receiveResult = document.getElementById("receive_result");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedType = button.textContent;

        buttons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        const data = compatibility[selectedType];

        donateResult.innerHTML = data.donate.map(type => {
            return `<span class="blood_badge">${type}</span>`
            }).join("")

            receiveResult.innerHTML = data.receive.map(type => {
                return `<span class="blood_badge">${type}</span>`
            }).join("")
        })
    })


// Register Form
const registerForm = document.getElementById("register_form")

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault()

    const name = document.getElementById("name").value
    const phone = document.getElementById("phone").value
    const region = document.getElementById("region").value
    const gender = document.querySelector('input[name="gender"]:checked')
    const blood_type = document.getElementById("blood_type").value

    if (!name || !phone || !region || !gender || !blood_type) {
        alert("Please fill in all fields")
        return
    }

    try {
        await addDoc(collection(db, "donors"), {
            name: name,
            phone: phone,
            region: region,
            gender: gender.value,
            blood_type: blood_type,
            date: new Date()
        })

        alert("✅ Registered successfully! Thank you.")
        registerForm.reset()

    } catch (error) {
        alert("❌ Something went wrong. Please try again.")
        console.error(error)
    }

})


// Urgency Form
const urgencyForm = document.getElementById("urgency_form")

urgencyForm.addEventListener("submit", async (e) => {

    e.preventDefault()

    const patient_name = document.getElementById("urgency_name").value
    const phone = document.getElementById("urgency_phone").value
    const hospital = document.getElementById("hospital").value
    const blood_type = document.getElementById("urgency_blood_type").value
    const notes = document.getElementById("note").value

    if (!patient_name || !phone || !hospital || !blood_type) {
        alert("Please fill in all required fields")
        return
    }

    try {
        await addDoc(collection(db, "urgent_requests"), {
            patient_name: patient_name,
            phone: phone,
            hospital: hospital,
            blood_type: blood_type,
            notes: notes,
            date: new Date()
        })

        alert("🚨 Urgent request sent successfully!")
        urgencyForm.reset()

    } catch (error) {
        alert("❌ Something went wrong. Please try again.")
        console.error(error)
    }

})


// Search Form
const searchForm = document.getElementById("search_form")

searchForm.addEventListener("submit", async (e) => {

    e.preventDefault()

    const blood_type = document.getElementById("search_blood_type").value
    const region = document.getElementById("search_region").value

    if (!blood_type) {
        alert("Please select a blood type")
        return
    }

    try {
        let q

        if (region) {
            // search by blood type AND region
            q = query(
                collection(db, "donors"),
                where("blood_type", "==", blood_type),
                where("region", "==", region)
            )
        } else {
            // search by blood type only
            q = query(
                collection(db, "donors"),
                where("blood_type", "==", blood_type)
            )
        }

        const results = await getDocs(q)

        const searchResults = document.getElementById("search_results")

        if (results.empty) {
            searchResults.innerHTML = `
            <p class="no_results">❌ No donors found for this selection.</p>
            `
            
        } else {
            searchResults.innerHTML = results.docs.map(doc => {
                const donor = doc.data()
                return `
                    <div class="donor_card">
                        <span class="donor_blood">${donor.blood_type}</span>
                        <div class="donor_info">
                            <p class="donor_name">${donor.name}</p>
                            <p class="donor_region">📍 ${donor.region}</p>
                        </div>
                        <span class="donor_phone">📞 ${donor.phone}</span>
                    </div>
                `
            }).join("")
        }

    } catch (error) {
        alert("❌ Something went wrong. Please try again.")
        console.error(error)
    }

})