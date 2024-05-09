window.onload = function () {
    fetch("http://localhost:8081/api/courses")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            let tbody = document.getElementById("tbody");
            data.forEach((element) => {
                tbody.insertRow().innerHTML = `
                <td>${element.dept}</td>
                <td>${element.courseNum}</td>
                <td><a href="http://localhost:8081/details?${element.id}">${element.courseName}</a></td>
            `;
            });
        })
        .catch((error) => {
            console.error(error);
        });
};

