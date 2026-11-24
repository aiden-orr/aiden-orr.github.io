document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    const main = document.querySelector("main");
    const courses = document.getElementById("courses");
    const addCourseButton = document.getElementById("add-course");
    const clearButton = document.getElementById("clear");
    const imageInput = document.getElementById("img");
    const imagePreview = document.getElementById("image-preview");

    const defaultImage = "images/aiden-orr.jpeg";
    const originalCourses = courses.innerHTML;

    let selectedImage = defaultImage;
    let courseCount = 5;

    const footerFields = [
        ["CLT Web", "cltWeb"],
        ["GitHub.io", "githubio"],
        ["GitHub", "github"],
        ["freeCodeCamp", "freeCodeCamp"],
        ["Codecademy", "codecademy"],
        ["LinkedIn", "linkedin"]
    ];

    // Gets the value of a form field.
    function getValue(id) {
        return document.getElementById(id).value.trim();
    }

    // Prevents user-entered text from being interpreted as HTML.
    function escapeHTML(value) {
        const element = document.createElement("div");
        element.textContent = value;
        return element.innerHTML
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // Allows only HTTP and HTTPS links.
    function validURL(value) {
        try {
            const url = new URL(value);
            return url.protocol === "https:" || url.protocol === "http:";
        } catch (error) {
            return false;
        }
    }

    // Adds a new course with four required fields.
    function addCourse() {
        courseCount++;

        // This div and class group the inputs for an individual course.
        const course = document.createElement("div");
        course.className = "course-entry";

        course.innerHTML = `
            <label for="department-${courseCount}">Department:</label>
            <input type="text" id="department-${courseCount}"
                   name="department"
                   placeholder="Department" required>

            <label for="courseNumber-${courseCount}">Course Number:</label>
            <input type="text" id="courseNumber-${courseCount}"
                   name="courseNumber"
                   placeholder="Course number" required>

            <label for="courseTitle-${courseCount}">Course Title:</label>
            <input type="text" id="courseTitle-${courseCount}"
                   name="courseTitle"
                   placeholder="Course title" required>

            <label for="reasonForTaking-${courseCount}">
                Reason for Taking:
            </label>
            <textarea id="reasonForTaking-${courseCount}"
                      name="reasonForTaking"
                      placeholder="Reason for taking this course"
                      required></textarea>

            <button type="button" class="delete-course">
                Delete Course
            </button>
        `;

        courses.appendChild(course);
    }

    addCourseButton.addEventListener("click", addCourse);

    // Removes a course when its delete button is clicked.
    courses.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-course")) {
            event.target.closest(".course-entry").remove();
        }
    });

    // Loads and previews a user's uploaded photograph.
    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];

        if (!file) {
            selectedImage = defaultImage;
            imagePreview.src = defaultImage;
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            imageInput.value = "";
            selectedImage = defaultImage;
            imagePreview.src = defaultImage;
            return;
        }

        if (selectedImage.startsWith("blob:")) {
            URL.revokeObjectURL(selectedImage);
        }

        selectedImage = URL.createObjectURL(file);
        imagePreview.src = selectedImage;
    });

    // Clears all form fields.
    clearButton.addEventListener("click", function () {
        form.querySelectorAll("input, textarea").forEach(function (field) {
            field.value = "";
        });

        if (selectedImage.startsWith("blob:")) {
            URL.revokeObjectURL(selectedImage);
        }

        selectedImage = "";
        imagePreview.hidden = true;
        imagePreview.removeAttribute("src");
    });

    // Restores the original form values and courses.
    form.addEventListener("reset", function () {
        courses.innerHTML = originalCourses;
        courseCount = 5;

        if (selectedImage.startsWith("blob:")) {
            URL.revokeObjectURL(selectedImage);
        }

        selectedImage = defaultImage;
        imagePreview.src = defaultImage;
        imagePreview.hidden = false;
    });

    // Makes the image preview visible after selecting a new photograph.
    imageInput.addEventListener("change", function () {
        imagePreview.hidden = false;
    });

    // Collects information using the assignment's required data model.
    function collectData() {
        const courseData = [];

        document.querySelectorAll(".course-entry").forEach(function (course) {
            courseData.push({
                department: course.querySelector(
                    '[name="department"]'
                ).value.trim(),

                courseNumber: course.querySelector(
                    '[name="courseNumber"]'
                ).value.trim(),

                courseTitle: course.querySelector(
                    '[name="courseTitle"]'
                ).value.trim(),

                reasonForTaking: course.querySelector(
                    '[name="reasonForTaking"]'
                ).value.trim()
            });
        });

        return {
            firstName: getValue("firstName"),
            middleName: getValue("middleName"),
            nickname: getValue("nickname"),
            lastName: getValue("lastName"),
            acknowledgment: getValue("acknowledgment"),
            acknowledgmentDate: getValue("acknowledgmentDate"),
            prettyNameDivider: getValue("prettyNameDivider"),
            adjectives: getValue("adjectives"),
            animal: getValue("animal"),
            img: selectedImage,
            pictureAlt: getValue("pictureAlt"),
            caption: getValue("caption"),

            personalInfo: {
                statement: getValue("statement"),
                personalBackground: getValue("personalBackground"),
                professionalBackground: getValue("professionalBackground"),
                academicBackground: getValue("academicBackground"),
                primaryWorkComputer: getValue("primaryWorkComputer"),
                primaryWorkLocation: getValue("primaryWorkLocation"),
                alternateComputerLocation: getValue(
                    "alternateComputerLocation"
                )
            },

            courses: courseData,

            quote: getValue("quote"),
            quoteAuthor: getValue("quoteAuthor"),
            funnyItem: getValue("funnyItem"),
            somethingToShare: getValue("somethingToShare"),

            footerLinks: footerFields.map(function (field) {
                return {
                    label: field[0],
                    url: getValue(field[1])
                };
            })
        };
    }

    // Checks that all required information is provided.
    function validateForm() {
        if (!form.reportValidity()) {
            return false;
        }

        const requiredFields = form.querySelectorAll("[required]");

        for (const field of requiredFields) {
            if (!field.value.trim()) {
                alert("Please complete all required fields.");
                field.focus();
                return false;
            }
        }

        if (!selectedImage) {
            alert("Please upload a photograph.");
            imageInput.focus();
            return false;
        }

        if (courses.children.length === 0) {
            alert("Please enter at least one course.");
            return false;
        }

        for (const field of footerFields) {
            if (!validURL(getValue(field[1]))) {
                alert("Please enter a valid URL for " + field[0] + ".");
                document.getElementById(field[1]).focus();
                return false;
            }
        }

        return true;
    }

    // Updates the footer links with the submitted URLs.
    function updateFooter(footerLinks) {
        const footerNav = document.querySelector("footer nav");

        if (!footerNav) {
            return;
        }

        footerNav.replaceChildren();

        footerLinks.forEach(function (link, index) {
            const anchor = document.createElement("a");

            anchor.href = link.url;
            anchor.textContent = link.label;

            footerNav.appendChild(anchor);

            if (index < footerLinks.length - 1) {
                footerNav.appendChild(document.createTextNode(" | "));
            }
        });
    }

    // Generates the introduction using the original page's layout.
    function generateIntroduction(data) {
        const fullName = [
            data.firstName,
            data.middleName,
            data.lastName
        ].filter(Boolean).join(" ");

        const prettyName = [
            data.firstName,
            data.middleName,
            data.nickname ? `"${data.nickname}"` : "",
            data.lastName
        ].filter(Boolean).join(" ");

        const mascot = `${data.adjectives} ${data.animal}`;

        const courseHTML = data.courses.map(function (course) {
            return `
                <li>
                    <strong>${escapeHTML(course.department)}
                    ${escapeHTML(course.courseNumber)} -
                    ${escapeHTML(course.courseTitle)}:</strong>
                    ${escapeHTML(course.reasonForTaking)}
                </li>
            `;
        }).join("");

        const funnyHTML = data.funnyItem
            ? `<li><strong>Funny Thing:</strong>
               ${escapeHTML(data.funnyItem)}</li>`
            : "";

        const shareHTML = data.somethingToShare
            ? `<li><strong>Something Interesting About Me:</strong>
               ${escapeHTML(data.somethingToShare)}</li>`
            : "";

        main.innerHTML = `
            <h2>Introduction Form</h2>

            <h6>
                ${escapeHTML(prettyName)}
                ${escapeHTML(data.prettyNameDivider)}
                ${escapeHTML(mascot)}
            </h6>

            <h3>${escapeHTML(fullName)}</h3>

            <figure>
                <img src="${escapeHTML(data.img)}"
                     alt="${escapeHTML(data.pictureAlt)}">
                <figcaption>
                    ${escapeHTML(data.caption)}
                </figcaption>
            </figure>

            <p>${escapeHTML(data.personalInfo.statement)}</p>

            <ul>
                <li>
                    <strong>Personal Background:</strong>
                    ${escapeHTML(data.personalInfo.personalBackground)}
                </li>

                <li>
                    <strong>Academic Background:</strong>
                    ${escapeHTML(data.personalInfo.academicBackground)}
                </li>

                <li>
                    <strong>Professional Background:</strong>
                    ${escapeHTML(data.personalInfo.professionalBackground)}
                </li>

                <li>
                    <strong>Primary Work Computer:</strong>
                    ${escapeHTML(data.personalInfo.primaryWorkComputer)}
                </li>

                <li>
                    <strong>Primary Work Location:</strong>
                    ${escapeHTML(data.personalInfo.primaryWorkLocation)}
                </li>

                <li>
                    <strong>Alternate Computer:</strong>
                    ${escapeHTML(data.personalInfo.alternateComputerLocation)}
                </li>

                <li>
                    <strong>Courses I'm taking and why:</strong>
                    <ol>
                        ${courseHTML}
                    </ol>
                </li>

                ${funnyHTML}
                ${shareHTML}
            </ul>

            <blockquote>
                <p><em>"${escapeHTML(data.quote)}"</em></p>
                <p>- ${escapeHTML(data.quoteAuthor)}</p>
            </blockquote>

            <p>
                ${escapeHTML(data.acknowledgment)}
                - ${escapeHTML(data.acknowledgmentDate)}
            </p>

            <p>
                <a href="introduction_form.html">Reset Form</a>
            </p>
        `;

        updateFooter(data.footerLinks);

        window.scrollTo(0, 0);
    }

    // Prevents normal submission and generates the introduction.
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const data = collectData();

        generateIntroduction(data);
    });
});