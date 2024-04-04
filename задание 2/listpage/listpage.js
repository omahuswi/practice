function getData() {
    return fetch('listTask.json')
        .then(response => response.json())
}

function formatDateTime(dateTimeString) {
    var dateTime = new Date(dateTimeString);
    var day = dateTime.getDate();
    var month = dateTime.getMonth() + 1;
    var year = dateTime.getFullYear();
    var hours = dateTime.getHours();
    var minutes = dateTime.getMinutes();
    var seconds = dateTime.getSeconds();
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}
${hours < 10 ? '0' + hours : hours}.${minutes < 10 ? '0' + minutes : minutes}.${seconds < 10 ? '0' + seconds : seconds}`;
}

function main() {
    let currentPage = 1;
    let rows = 10;
    getData().then(data => {
        displayList(data, rows, currentPage)
        displayPagination(data, rows);
    })

    function displayList(data, rows, currentPage) {
        // .then(data => {
        const tableBody = document.querySelector('.data-table tbody');
        tableBody.innerHTML = "";
        currentPage--;

        const start = rows * currentPage;
        const end = start + rows;
        let paginatedData = data.slice(start, end);

        paginatedData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${item.numberTask}</td>
                    <td>${item.departTask}</td>
                    <td>${item.masterName}</td>
                    <td>${item.workerName}</td>
                    <td>${formatDateTime(item.dateIssue)}</td>
                    <td>${formatDateTime(item.dateAccept)}</td>
                    <td>
                        <button class ="check">Посмотреть</button>
                        <button class="change">Изменить</button>
                    </td>
                `;
            tableBody.appendChild(row);
        })
    }

    function displayPagination(listData, rows) {
        const pagination = document.querySelector('.pagination');
        const pagesCount = Math.ceil(listData.length / rows);

        for (let i = 0; i < pagesCount; i++) {
            const btn = displayPaginationBtn(i + 1)
            pagination.appendChild(btn)
        }
    }

    function displayPaginationBtn(page) {
        const el = document.createElement("button")

        el.classList.add("pagination-btn");
        el.innerText = page;


        el.addEventListener('click', () => {
            currentPage = page
            displayList(data, rows, currentPage)
        })
        return el
    }
}
main();