fetch('../json/listTask.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('.data-table tbody');
        let pagination = document.querySelector('#pagination');
        let rowsCount = 12;


        let active;//переменная для хранения активной кнопки
        let pageCount = Math.ceil(data.length / rowsCount)

        let items = []
        for (let i = 1; i <= pageCount; i++) {
            let li = document.createElement("li")
            li.innerHTML = i;
            pagination.appendChild(li);
            items.push(li)
        }
        displayPage(items[0])

        for (let item of items) {
            item.addEventListener('click', function () {
                displayPage(this)
            })
        }

        /**
         *Выводит данные в таблицу
         *
         * @param item номер отображаемой страницы
         */
        function displayPage(item) {
            if (active) {
                active.classList.remove('active')
            }
            active = item;
            item.classList.add("active")
            let pageNum = +item.innerHTML;

            let start = rowsCount * (pageNum - 1);
            let end = start + rowsCount;
            let paginatedData = data.slice(start, end);
            tableBody.innerHTML = "";

            paginatedData.forEach(item => {
                let row = document.createElement('tr');
                row.addEventListener('click', function () {
                    window.location.href = '../html/task.html';
                });
                row.classList.add("content")
                row.innerHTML = `
                                    <td >${item.numberTask}</a></td>
                                    <td>${item.departTask}</td>
                                    <td>${item.masterName}</td>
                                    <td>${item.workerName}</td>
                                    <td>${formatDateTime(item.dateIssue)}</td>
                                    <td>${formatDateTime(item.dateAccept)}</td>
                                    `;
                tableBody.appendChild(row);
            })
        }
    })

/**
 * Форматирует строку с датой и временем.
 *
 * @return {number} отформатированная строка в виде DD.MM.YY H:M:S.
 * @param dateTimeString строка для форматирования.
 */
function formatDateTime(dateTimeString) {
    var dateTime = new Date(dateTimeString);
    var day = dateTime.getDate();
    var month = dateTime.getMonth() + 1;
    var year = dateTime.getFullYear();
    var hours = dateTime.getHours();
    var minutes = dateTime.getMinutes();
    var seconds = dateTime.getSeconds();
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}
${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}