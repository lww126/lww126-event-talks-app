const fs = require('fs');
const path = require('path');

// --- Placeholder Talk Data ---
const talksData = [
    {
        id: 'talk1',
        title: 'Introduction to Modern Web Development',
        speakers: ['Alice Smith'],
        category: ['Web Development', 'Frontend'],
        duration: 60, // minutes
        description: 'A comprehensive overview of the latest trends and technologies in modern web development, focusing on client-side frameworks.'
    },
    {
        id: 'talk2',
        title: 'Backend with Node.js and Express',
        speakers: ['Bob Johnson', 'Charlie Brown'],
        category: ['Web Development', 'Backend', 'Node.js'],
        duration: 60,
        description: 'Explore how to build robust and scalable backend services using Node.js and the Express framework.'
    },
    {
        id: 'talk3',
        title: 'Effective Database Design for Web Applications',
        speakers: ['David Green'],
        category: ['Databases', 'Backend'],
        duration: 60,
        description: 'Best practices for designing efficient and maintainable database schemas for various web application needs.'
    },
    {
        id: 'talk4',
        title: 'DevOps for Frontend Developers',
        speakers: ['Eve White'],
        category: ['DevOps', 'Frontend'],
        duration: 60,
        description: 'Learn about essential DevOps practices and tools that can significantly improve a frontend developer\\\'s workflow.'
    },
    {
        id: 'talk5',
        title: 'Machine Learning in the Browser',
        speakers: ['Frank Black', 'Grace Lee'],
        category: ['Machine Learning', 'Frontend'],
        duration: 60,
        description: 'Discover how to leverage powerful machine learning models directly within the web browser using TensorFlow.js and other libraries.'
    },
    {
        id: 'talk6',
        title: 'The Future of Cloud Native Applications',
        speakers: ['Heidi Blue'],
        category: ['Cloud', 'Architecture'],
        duration: 60,
        description: 'An insightful look into the evolving landscape of cloud-native architectures, serverless computing, and containerization.'
    }
];

// --- Schedule Generation Logic ---
function generateSchedule(talks) {
    const schedule = [];
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0); // Start at 10:00 AM

    const talkDurationMs = 60 * 60 * 1000; // 1 hour in milliseconds
    const transitionDurationMs = 10 * 60 * 1000; // 10 minutes in milliseconds
    const lunchDurationMs = 60 * 60 * 1000; // 1 hour in milliseconds

    let currentTalkIndex = 0;

    for (let i = 0; i < 6; i++) {
        // Add talk
        const talk = talks[currentTalkIndex];
        const talkStartTime = new Date(currentTime);
        currentTime.setTime(currentTime.getTime() + talkDurationMs);
        const talkEndTime = new Date(currentTime);

        schedule.push({
            type: 'talk',
            ...talk,
            startTime: talkStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: talkEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        currentTalkIndex++;

        if (currentTalkIndex === 3) { // Place lunch after the 3rd talk
            currentTime.setTime(currentTime.getTime() + transitionDurationMs); // 10 min transition before lunch
            const lunchStartTime = new Date(currentTime);
            currentTime.setTime(currentTime.getTime() + lunchDurationMs);
            const lunchEndTime = new Date(currentTime);

            schedule.push({
                type: 'break',
                title: 'Lunch Break',
                startTime: lunchStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: lunchEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            // No transition after lunch break before the next talk, as the logic will add it before the next talk
        } else if (currentTalkIndex < talks.length) { // Add transition only if there's a next talk
            currentTime.setTime(currentTime.getTime() + transitionDurationMs);
        }
    }

    return schedule;
}

const eventSchedule = generateSchedule(talksData);

// --- HTML Template, CSS, and JS ---
const css = `
body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background-color: #f4f4f4;
    color: #333;
}
.container {
    max-width: 960px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1, h2 {
    color: #0056b3;
    text-align: center;
}
.search-container {
    margin-bottom: 20px;
    text-align: center;
}
.search-container input {
    width: 80%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}
.schedule-item {
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    margin-bottom: 10px;
    padding: 15px;
    border-radius: 5px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
}
.schedule-item.break {
    background-color: #d1ecf1;
    border-color: #bee5eb;
    font-weight: bold;
}
.schedule-item.talk .time {
    flex-basis: 15%;
    min-width: 80px;
    font-weight: bold;
    color: #0056b3;
}
.schedule-item.talk .details {
    flex-basis: 80%;
    min-width: 200px;
}
.schedule-item .title {
    font-size: 1.2em;
    margin-bottom: 5px;
    color: #333;
}
.schedule-item .speakers {
    font-style: italic;
    font-size: 0.9em;
    color: #555;
    margin-bottom: 5px;
}
.schedule-item .category {
    font-size: 0.8em;
    color: #6c757d;
    margin-top: 5px;
}
.schedule-item .description-toggle {
    cursor: pointer;
    color: #007bff;
    text-decoration: underline;
    margin-top: 10px;
    display: block;
    font-size: 0.9em;
}
.schedule-item .description {
    display: none;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #ccc;
    font-size: 0.9em;
    width: 100%;
}
.schedule-item .description.active {
    display: block;
}
@media (max-width: 600px) {
    .schedule-item.talk .time,
    .schedule-item.talk .details {
        flex-basis: 100%;
    }
}
`;

const js = `
const scheduleData = ${JSON.stringify(eventSchedule, null, 2)};
const scheduleContainer = document.getElementById('schedule');
const searchInput = document.getElementById('search-category');

function renderSchedule(data) {
    scheduleContainer.innerHTML = '';
    data.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('schedule-item', item.type);

        if (item.type === 'talk') {
            itemDiv.innerHTML = \`
                <div class="time">\${item.startTime} - \${item.endTime}</div>
                <div class="details">
                    <div class="title">\${item.title}</div>
                    <div class="speakers">\${item.speakers.join(', ')}</div>
                    <div class="category">Categories: \${item.category.join(', ')}</div>
                    <div class="description-toggle">Show Description</div>
                    <div class="description">\${item.description}</div>
                </div>
            \`;
            const toggle = itemDiv.querySelector('.description-toggle');
            const description = itemDiv.querySelector('.description');
            toggle.addEventListener('click', () => {
                description.classList.toggle('active');
                toggle.textContent = description.classList.contains('active') ? 'Hide Description' : 'Show Description';
            });
        } else { // break
            itemDiv.innerHTML = \`
                <div class="time">\${item.startTime} - \${item.endTime}</div>
                <div class="details">
                    <div class="title">\${item.title}</div>
                </div>
            \`;
        }
        scheduleContainer.appendChild(itemDiv);
    });
}

function filterSchedule() {
    const searchTerm = searchInput.value.toLowerCase();
    if (!searchTerm) {
        renderSchedule(scheduleData);
        return;
    }

    const filtered = scheduleData.filter(item => {
        if (item.type === 'talk' && item.category) {
            return item.category.some(cat => cat.toLowerCase().includes(searchTerm));
        }
        return false;
    });
    renderSchedule(filtered);
}

searchInput.addEventListener('keyup', filterSchedule);
window.addEventListener('load', () => renderSchedule(scheduleData));
`;

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Conference Schedule</title>
    <style>
        ${css}
    </style>
</head>
<body>
    <div class="container">
        <h1>Tech Conference Day</h1>
        <h2>Event Schedule</h2>

        <div class="search-container">
            <input type="text" id="search-category" placeholder="Search by category (e.g., 'Web Development', 'AI')">
        </div>

        <div id="schedule">
            <!-- Schedule items will be rendered here by JavaScript -->
        </div>
    </div>

    <script>
        ${js}
    </script>
</body>
</html>
`;

// --- Write to index.html ---
const outputPath = path.join(process.cwd(), 'index.html');
fs.writeFileSync(outputPath, htmlTemplate.trim(), 'utf8');

console.log(`Successfully generated ${outputPath}`);