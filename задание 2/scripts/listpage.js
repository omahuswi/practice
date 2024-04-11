fetch('../json/listTask.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('.data-table tbody')
        const pagination = document.querySelector('#pagination');
        let rowsCount = 10;//количество строк данных на одной странице

        let active; //переменная для хранения активной кнопки отобращения страницы

        let pageCount = Math.ceil(data.length / rowsCount)//количество страниц с данными


        let items = []


        function CreatePagination(pageCount, page) {
            pagination.innerHTML = ""
            let li
            let prevPage = page - 1;
            let nextPage = page + 1;
            //условие вывода кнопки предыдущей страницы
            if (page > 1) {
                li = document.createElement("li")
                li.innerHTML = "Пред";
                li.addEventListener('click', (event) => {
                    CreatePagination(pageCount, prevPage)
                })
                pagination.appendChild(li);
                items.push(li)
            }
            //условие вывода кнопки первой страницы
            if (page > 2) {
                li = document.createElement("li")
                li.innerHTML = 1;
                li.classList.add("num");
                pagination.appendChild(li);
                items.push(li)
                //условие вывода кнопки троеточия
                if (page > 3) {
                    li = document.createElement("li")
                    li.innerHTML = "...";
                    pagination.appendChild(li);
                    items.push(li)
                }
            }
            //вывод кнопок трех кнопок страниц
            for (let i = prevPage; i <= nextPage; i++) {
                if ((i < 1) || (i > pageCount)) {
                } else {
                    li = document.createElement("li")
                    li.innerHTML = i;
                    li.classList.add("num");
                    if (page === i) {
                        li.classList.add("active")
                        active = li
                    }
                    pagination.appendChild(li);
                    items.push(li)
                }
            }

            //условие вывода кнопки последней страницы
            if (page < pageCount - 1) {
                //условие вывода кнопки троеточия
                if (page < pageCount - 2) {
                    li = document.createElement("li")
                    li.innerHTML = "...";
                    pagination.appendChild(li);
                    items.push(li)
                }
                li = document.createElement("li")
                li.innerHTML = pageCount;
                li.classList.add("num");
                pagination.appendChild(li);
                items.push(li)
            }

            //условие вывода кнопки следующей страницы
            if (page < pageCount) {
                li = document.createElement("li")
                li.innerHTML = "След";
                li.addEventListener('click', (event) => {
                    CreatePagination(pageCount, nextPage)
                })
                pagination.appendChild(li);
                items.push(li)
            }

            //присвоение события кнопкам пагинации
            for (let item of items) {
                if (item.classList.contains('num')) {
                    item.addEventListener('click', function () {
                        CreatePagination(pageCount, +this.innerHTML)
                    })
                }

            }
            displayPage(page)//вызов функции отрисовки данных активной страницы
        }
        CreatePagination(pageCount, 1)//вызов функции отрисовки пагинаци


        /**
         *отрисовка нужнной страницы с данными из JSON файла (вызывается при
         первичной загрузке веб-страницы и при нажатии  на кнопки пагинации)
         *
         * @param pageNum номер отображаемой страницы
         */
        function displayPage(pageNum) {
            let start = rowsCount * (pageNum - 1);
            let end = start + rowsCount;
            let paginatedData = data.slice(start, end);
            tableBody.innerHTML = "";

            paginatedData.forEach(item => {
                let row = document.createElement('tr');

                //присвоение события перехода на страницу с данными о задании каждой строке таблицы
                row.setAttribute('id', `${item.idTask}`)
                row.addEventListener('click', function () {
                    sendId(row.id)
                });

                /**
                 * функция возвращает путь до нужной страницы с передачей на неё идентификатора страницы
                 *
                 * @param id идентификатор задачи
                 */
                function sendId(id) {
                    window.location.href = '../html/task.html?id=' + id;
                }

                //отрисовка таблицы с данными
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
 * Функция форматирует строку с датой и временем в вид dd.MM.yy HH:mm:ss
 *
 * @return {number} отформатированная строка в виде dd.MM.yy HH:mm:ss
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

