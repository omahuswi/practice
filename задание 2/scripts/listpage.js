fetch('../json/listTask.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('.data-table tbody')
        let pagination = document.querySelector('#pagination');
        let rowsCount = 10;//количество строк данных на одной странице

        let active; //переменная для хранения активной кнопки отобращения страницы

        let pageCount = Math.ceil(data.length / rowsCount)//количество страниц с данными

        //создание списка пагинации
        let items = []
        for (let i = 1; i <= pageCount; i++) {
            let li = document.createElement("li")
            li.innerHTML = i;
            pagination.appendChild(li);
            items.push(li)
        }

        //вызов функции отрисовки первой страницы
        displayPage(items[0])

        //присвоение события кнопкам пагинации
        for (let item of items) {
            item.addEventListener('click', function () {
                displayPage(this)//вызов функции отрисовки выбранной страницы
            })
        }

        /**
         *отрисовка нужнной страницы с данными из JSON файла (вызывается при
         первичной загрузке веб-страницы и при нажатии  на кнопки пагинации)
         *
         * @param item номер отображаемой страницы
         */
        function displayPage(item) {
            if (active) {
                active.classList.remove('active')
            }
            active = item;
            item.classList.add('active')
            let pageNum = +item.innerHTML;

            let start = rowsCount * (pageNum - 1);
            let end = start + rowsCount;
            let paginatedData = data.slice(start, end);
            tableBody.innerHTML = "";


            paginatedData.forEach(item => {
                let row = document.createElement('tr');

                //присвоение каждой строке события перехода на страницу с данными о задании
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

