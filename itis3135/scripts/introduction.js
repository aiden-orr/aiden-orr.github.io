document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    const main = document.querySelector("main");
    const courses = document.getElementById("courses");
    const addCourseButton = document.getElementById("add-course");
    const clearButton = document.getElementById("clear");
    const imageInput = document.getElementById("img");
    const imagePreview = document.getElementById("image-preview");

    const output = document.getElementById("generated-output");
    const outputHeading = document.getElementById("output-heading");
    const outputCode = document.getElementById("output-code");

    const defaultImage = "images/aiden-orr.jpeg";
    const originalCourses = courses.innerHTML;

    let selectedImage = defaultImage;
    let courseCount = courses.children.length;
    let exportRequest = 0;

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

    // Escapes characters that have special meanings in HTML.
    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // Escapes characters that have special meanings in XML.
    function escapeXML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
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

    // Releases previously uploaded image URLs.
    function releaseImage() {
        if (selectedImage.startsWith("blob:")) {
            URL.revokeObjectURL(selectedImage);
        }
    }

    // Loads and previews an uploaded photograph.
    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];

        releaseImage();

        if (!file) {
            selectedImage = defaultImage;
            imagePreview.src = defaultImage;
            imagePreview.hidden = false;
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");

            imageInput.value = "";
            selectedImage = defaultImage;
            imagePreview.src = defaultImage;
            imagePreview.hidden = false;

            return;
        }

        selectedImage = URL.createObjectURL(file);
        imagePreview.src = selectedImage;
        imagePreview.hidden = false;
    });

    // Updates the preview alternative text when the field changes.
    document.getElementById("pictureAlt").addEventListener("input", function () {
        imagePreview.alt = getValue("pictureAlt");
    });

    // Removes previously generated source code.
    function clearGeneratedCode() {
        exportRequest++;
        output.hidden = true;
        outputCode.value = "";
        outputHeading.textContent = "Generated Code";
    }

    // Clears every form field.
    clearButton.addEventListener("click", function () {
        form.querySelectorAll("input, textarea").forEach(function (field) {
            field.value = "";
        });

        releaseImage();

        selectedImage = "";
        imagePreview.hidden = true;
        imagePreview.removeAttribute("src");

        clearGeneratedCode();
    });

    // Restores the original form values and courses.
    form.addEventListener("reset", function () {
        courses.innerHTML = originalCourses;
        courseCount = courses.children.length;

        releaseImage();

        selectedImage = defaultImage;
        imagePreview.src = defaultImage;
        imagePreview.alt = "Photo of Aiden Orr";
        imagePreview.hidden = false;

        clearGeneratedCode();
    });

    // Collects information using the required assignment data model.
    function collectData() {
        const courseData = [];

        courses.querySelectorAll(".course-entry").forEach(function (course) {
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

        footerNav.innerHTML = "";

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

    // Creates the introduction content used by Submit and Generate HTML.
    function buildIntroduction(data) {
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
            return `            <li>
                <strong>${escapeHTML(course.department)} ${escapeHTML(course.courseNumber)} - ${escapeHTML(course.courseTitle)}:</strong>
                ${escapeHTML(course.reasonForTaking)}
            </li>`;
        }).join("\n");

        const funnyHTML = data.funnyItem
            ? `        <li>
            <strong>Funny Thing:</strong>
            ${escapeHTML(data.funnyItem)}
        </li>\n`
            : "";

        const shareHTML = data.somethingToShare
            ? `        <li>
            <strong>Something Interesting About Me:</strong>
            ${escapeHTML(data.somethingToShare)}
        </li>\n`
            : "";

        return `<h2>Introduction Form</h2>

    <h6>${escapeHTML(prettyName)} ${escapeHTML(data.prettyNameDivider)} ${escapeHTML(mascot)}</h6>

    <h3>${escapeHTML(fullName)}</h3>

    <figure>
        <img src="${escapeHTML(data.img)}"
             alt="${escapeHTML(data.pictureAlt)}">
        <figcaption>${escapeHTML(data.caption)}</figcaption>
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

${funnyHTML}${shareHTML}    </ul>

    <blockquote>
        <p><em>"${escapeHTML(data.quote)}"</em></p>
        <p>- ${escapeHTML(data.quoteAuthor)}</p>
    </blockquote>

    <p>
        ${escapeHTML(data.acknowledgment)}
        - ${escapeHTML(data.acknowledgmentDate)}
    </p>`;
    }

    // Generates the displayed introduction when Submit is clicked.
    function generateIntroduction(data) {
        exportRequest++;

        main.innerHTML = `
            ${buildIntroduction(data)}

            <p>
                <a href="introduction_form.html">Reset Form</a>
            </p>
        `;

        updateFooter(data.footerLinks);

        window.scrollTo(0, 0);
    }

    // Prevents normal submission and displays the introduction.
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const data = collectData();

        generateIntroduction(data);
    });

    // Displays generated source code without removing the form.
    function displayCode(format, code) {
        outputHeading.textContent = "Generated " + format;
        outputCode.value = code;
        output.hidden = false;

        output.scrollIntoView({
            behavior: "smooth"
        });
    }

    // Generates HTML using the current form information.
    function generateHTML(data) {
        const footerHTML = data.footerLinks.map(function (link) {
            return `<a href="${escapeHTML(link.url)}">${escapeHTML(link.label)}</a>`;
        }).join(" |\n        ");

        return `<main>
    ${buildIntroduction(data)}
</main>

<footer>
    <nav>
        ${footerHTML}
    </nav>

    <p>
        Designed by <a href="../aidenorrdesignco.com/">Aiden Orr Design Co.</a> &copy;2026
    </p>

    <p>
        Certified in
        <a href="https://www.freecodecamp.org/certification/aiden_orruncc/responsive-web-design-v9">Responsive Web Design</a>
    </p>

    <p><em>"Strong code, stronger results."</em></p>
</footer>`;
    }

    // Converts the introduction data into formatted XML.
    function convertToXML(value, tag, level) {
        const indent = "    ".repeat(level);

        if (Array.isArray(value)) {
            let itemTag = "item";

            if (tag === "courses") {
                itemTag = "course";
            } else if (tag === "footerLinks") {
                itemTag = "link";
            }

            const items = value.map(function (item) {
                return convertToXML(item, itemTag, level + 1);
            }).join("\n");

            return `${indent}<${tag}>\n${items}\n${indent}</${tag}>`;
        }

        if (typeof value === "object" && value !== null) {
            const children = Object.keys(value).map(function (key) {
                return convertToXML(value[key], key, level + 1);
            }).join("\n");

            return `${indent}<${tag}>\n${children}\n${indent}</${tag}>`;
        }

        return `${indent}<${tag}>${escapeXML(value)}</${tag}>`;
    }

    // Embeds uploaded photographs in the generated source code.
    function collectExportData(callback) {
        const data = collectData();
        const file = imageInput.files[0];

        exportRequest++;
        const currentRequest = exportRequest;

        if (!file) {
            callback(data);
            return;
        }

        const reader = new FileReader();

        reader.addEventListener("load", function () {
            if (currentRequest !== exportRequest) {
                return;
            }

            data.img = reader.result;
            callback(data);
        });

        reader.addEventListener("error", function () {
            if (currentRequest === exportRequest) {
                alert("Unable to read the uploaded photograph.");
            }
        });

        reader.readAsDataURL(file);
    }

    // Generates HTML source code when Generate HTML is clicked.
    document.getElementById("generate-html").addEventListener("click", function () {
        if (!validateForm()) {
            return;
        }

        collectExportData(function (data) {
            const html = generateHTML(data);

            displayCode("HTML", html);
        });
    });

    // Generates formatted JSON when Generate JSON is clicked.
    document.getElementById("generate-json").addEventListener("click", function () {
        if (!validateForm()) {
            return;
        }

        collectExportData(function (data) {
            const json = JSON.stringify(data, null, 4);

            displayCode("JSON", json);
        });
    });

    // Generates formatted XML when Generate XML is clicked.
    document.getElementById("generate-xml").addEventListener("click", function () {
        if (!validateForm()) {
            return;
        }

        collectExportData(function (data) {
            const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
                + convertToXML(data, "introduction", 0);

            displayCode("XML", xml);
        });
    });
});