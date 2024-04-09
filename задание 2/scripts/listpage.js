fetch('../json/listTask.json')
    .then(response => response.json())
    .then(data => {

        //coртировка данных
        // let sortedData = sortData(data)

        const tableBody = document.querySelector('.data-table tbody')
        let pagination = document.querySelector('#pagination');
        let rowsCount = 10;

        let active;//переменная для хранения активной кнопки

        let pageCount = Math.ceil(data.length / rowsCount)
        // let pageCount = Math.ceil(data.length / rowsCount)

        //создание списка пагинации
        let items = []
        for (let i = 1; i <= pageCount; i++) {
            let li = document.createElement("li")
            li.innerHTML = i;
            pagination.appendChild(li);
            items.push(li)
        }

        //отрисовка первой страницы
        displayPage(items[0])

        //присвоение событие кнопкам
        for (let item of items) {
            item.addEventListener('click', function () {
                displayPage(this)
            })
        }

        // /**
        //  * Сортировка данных
        //  *
        //  * @param data массив данных
        //  * @returns {newData}
        //  */
        // function sortData(data) {
        //     const table = document.querySelector('.data-table');
        //     let newData = [];
        //     table.addEventListener('click', (e) => {
        //         const el = e.target;
        //         if (!(el.nodeName === 'TH')) return;
        //         // el.classList.add('active')
        //
        //         const index = el.cellIndex;
        //         newData = sortTable(index, data);
        //     })
        //
        //     /**
        //      *
        //      * @param index
        //      * @param rows
        //      * @returns {*} от
        //      */
        //     function sortTable(index, rows) {
        //         const tableBody = table.querySelector('tbody')
        //         const compare = function (firstRow, secondRow) {
        //             return firstRow.cells[index].innerHTML - secondRow.cells[index].innerHTML
        //         }
        //         return rows.sort(compare)
        //     }
        //     return newData;
        // }

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
            // let paginatedData = data.slice(start, end);
            tableBody.innerHTML = "";

            paginatedData.forEach(item => {
                let row = document.createElement('tr');
                row.setAttribute('id', `${item.idTask}`)
                row.addEventListener('click', function () {
                    sendId(row.id)
                });

                function sendId(id) {
                    window.location.href = '../html/task.html?id=' + id;
                }

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

