const modal = document.getElementById('modal');
const span = document.getElementsByClassName('close')[0];
// Sample array of 30 students
const students = [
    { name: 'John Doe', regNumber: '12345', attendance: 85, marks: 75 },
    { name: 'Jane Smith', regNumber: '12346', attendance: 90, marks: 88 },
    { name: 'Alice Johnson', regNumber: '12347', attendance: 80, marks: 92 },
];
// Populate the array with more students
for (let i = 4; i <= 30; i++) {
    students.push({
        name: `Student ${i}`,
        regNumber: `Reg-${10000 + i}`,
        attendance: Math.floor(Math.random() * 50) + 50,
        marks: Math.floor(Math.random() * 50) + 50
    });
}
document.addEventListener('DOMContentLoaded', function () {
    updateTable();
    modal.style.display = "block";
});
function updateTable() {
    let tableContent = `
        <table>
            <tr>
                <th>Serial Number</th>
                <th>Name</th>
                <th>Registration Number</th>
                <th>Attendance</th>
                <th>Marks</th>
                <th>Result</th>
            </tr>
    `;
    students.forEach((student, index) => {
        const result = student.marks >= 50 ? 'Pass' : 'Fail';
        const tickClass = student.attendance > 0 ? 'active' : '';
        const marksDisplay = student.attendance > 0 ? student.marks : '';
        const resultDisplay = student.attendance > 0 ? result : '';
        tableContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.regNumber}</td>
                <td class="attendance-cell ${tickClass}" data-index="${index}">
                    <span class="tick">&#10003;</span>
                </td>
                <td class="marks-cell" data-index="${index}" tabindex="0">
                    ${marksDisplay}
                    <input type="number" class="edit-input" data-index="${index}" placeholder="Edit">
                </td>
                <td>${resultDisplay}</td>
            </tr>
        `;
    });
    tableContent += `</table>`;
    document.getElementById('output').innerHTML = tableContent;
    // Toggle attendance status when clicked
    document.querySelectorAll('.attendance-cell').forEach(cell => {
        cell.addEventListener('click', function () {
            const index = this.dataset.index;
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                students[index].attendance = 85; // Set attendance to 85 when active
            } else {
                students[index].attendance = 0; // Set attendance to 0 when inactive
            }
            updateTable(); // Refresh the table
        });
    });
    // Show input box on click for marks
    document.querySelectorAll('.marks-cell').forEach(cell => {
        cell.addEventListener('click', function () {
            const index = this.dataset.index;
            const input = this.querySelector('.edit-input');
            input.style.display = 'inline-block'; // Show the input field
            input.value = students[index].marks; // Set input value to current marks
            input.focus();
        });
    });
    // Save new marks on blur (when user clicks outside the input)
    document.querySelectorAll('.edit-input').forEach(input => {
        input.addEventListener('blur', function () {
            const index = this.dataset.index;
            const newMarks = parseInt(this.value);
            if (!isNaN(newMarks)) {
                students[index].marks = newMarks; // Update student marks
            }
            this.style.display = 'none'; // Hide the input box
            updateTable(); // Refresh the table
        });
        // Also save on 'Enter' key press
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                this.blur(); // Trigger blur event to save the marks
            }
        });
    });
}
// Close modal when clicking on the close button
span.onclick = function () {
    modal.style.display = "none";
}
// Close modal when clicking outside of it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// Download Excel functionality
const downloadExcelBtn = document.getElementById('download-excel-btn');
downloadExcelBtn.addEventListener('click', function () {
    const excelData = [
        ['Serial Number', 'Name', 'Registration Number', 'Attendance', 'Marks', 'Result'],
    ];
    students.forEach((student, index) => {
        const result = student.marks >= 50 ? 'Pass' : 'Fail';
        const marksDisplay = student.attendance > 0 ? student.marks : '';
        const resultDisplay = student.attendance > 0 ? result : '';
        excelData.push([
            index + 1,
            student.name,
            student.regNumber,
            student.attendance,
            marksDisplay,
            resultDisplay
        ]);
    });
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students Report');
    XLSX.writeFile(workbook, 'students_report.xlsx');
});