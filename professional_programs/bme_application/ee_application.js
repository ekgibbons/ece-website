// Grade to value mapping (can be extended)
const gradeMap = {
    'A': 4.00,
    'A-': 3.67,
    'B+': 3.33,
    'B': 3.00,
    'B-': 2.67,
    'C+': 2.33,
    'C': 2.00
};
const gradeOptions = ['', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];

// Configurable selector for grade dropdowns
const gradeSelectSelector = 'select[data-grade]';

// Utility: get all grade selects
function getGradeSelects() {
    return Array.from(document.querySelectorAll(gradeSelectSelector));
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    // Populate all grade selects
    getGradeSelects().forEach(sel => {
        // Only populate if not already populated
        if (sel.options.length === 0) {
            gradeOptions.forEach(g => {
                const opt = document.createElement('option');
                opt.value = g;
                opt.textContent = g;
                sel.appendChild(opt);
            });
        }
    });
    // Event delegation for GPA update
    document.addEventListener('change', function (e) {
        if (e.target && e.target.matches(gradeSelectSelector)) {
            console.log('Global change event caught for', e.target.dataset.course, e.target.value);
            updateGPA();
        }
    });
    // MutationObserver for debugging (optional, can remove in production)
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches && node.matches(gradeSelectSelector)) {
                        console.log('MutationObserver: grade select added:', node.dataset.course);
                    }
                });
                mutation.removedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches && node.matches(gradeSelectSelector)) {
                        console.log('MutationObserver: grade select removed:', node.dataset.course);
                    }
                });
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Initial calculation
    updateGPA();
    // Download report event (generalized)
    const downloadBtn = document.getElementById('downloadReport');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            console.log('Download report button clicked');
            const form = document.getElementById('eeForm') || document.querySelector('form');
            // Use fallback to get values by id if form.elements is missing or empty
            const firstName = form?.elements['firstName']?.value || document.getElementById('firstName')?.value || '';
            const lastName = form?.elements['lastName']?.value || document.getElementById('lastName')?.value || '';
            const email = form?.elements['email']?.value || document.getElementById('email')?.value || '';
            const wnumber = form?.elements['wnumber']?.value || document.getElementById('wnumber')?.value || '';
            const gpa = document.getElementById('gpa')?.value || '';
            let report = '';
            report += `Name: ${firstName} ${lastName}\n`;
            report += `WSU email: ${email}\n`;
            report += `W number: ${wnumber}\n`;
            report += `\nCourse Report:\n`;
            report += `Course       | Grade | Value | Hours | Points | Semester/Year\n`;
            report += `-------------------------------------------------------------\n`;
            getGradeSelects().forEach(sel => {
                const course = sel.dataset.course || sel.name || 'unknown';
                const label = sel.dataset.label || course;
                const grade = sel.value || 'N/A';
                const hours = parseInt(sel.dataset.hours) || 0;
                const value = document.getElementById(course + 'num')?.textContent || '2.00';
                const pts = document.getElementById(course + 'pts')?.textContent || (2.00 * hours).toFixed(2);
                const sem = form?.elements[course + 'sem']?.value || 'Not taken';
                report += `${label.padEnd(12)} | ${grade.padEnd(5)} | ${value.padEnd(5)} | ${String(hours).padEnd(5)} | ${pts.padEnd(6)} | ${sem}\n`;
            });
            report += `\nPre-Professional GPA: ${gpa}\n`;
            report += `\nNote: By submitting this form you are attesting that the information is accurate. If it is found that you fabricated data on this form you will be removed from the program immediately.\n`;
            // Download as txt
            try {
                const blob = new Blob([report], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = (lastName ? lastName.toLowerCase() : 'report') + '_professional_program_application.txt';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 0);
            } catch (e) {
                alert('Download failed. Please try a different browser.');
            }
        });
    }
});

// GPA calculation logic (generalized)
function updateGPA() {
    console.log('updateGPA called');
    let totalPoints = 0;
    let totalHours = 0;
    getGradeSelects().forEach(sel => {
        const course = sel.dataset.course || sel.name || 'unknown';
        const grade = sel.value;
        const hours = parseInt(sel.dataset.hours) || 0;
        let value = gradeMap[grade];
        if (!grade) value = gradeMap['C']; // treat blank as C
        // Defensive: check if cell exists before updating
        const numCell = document.getElementById(course + 'num');
        const ptsCell = document.getElementById(course + 'pts');
        if (numCell) numCell.textContent = value ? value.toFixed(2) : '';
        let pts = value ? value * hours : gradeMap['C'] * hours;
        if (ptsCell) {
            ptsCell.textContent = pts.toFixed(2);
        }
        totalPoints += pts;
        totalHours += hours;
        // Debug: log each course's grade and points
        console.log(`Course: ${course}, Grade: ${grade}, Value: ${value}, Hours: ${hours}, Points: ${pts}`);
    });
    const gpa = totalHours > 0 ? (totalPoints / totalHours).toFixed(3) : '';
    const gpaInput = document.getElementById('gpa');
    if (gpaInput) gpaInput.value = gpa;
    // Debug: log total points and GPA
    console.log(`Total Points: ${totalPoints}, Total Hours: ${totalHours}, GPA: ${gpa}`);
}