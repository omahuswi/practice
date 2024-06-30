/**
 * Функция форматирует строку с датой и временем в вид dd.MM.yy HH:mm:ss
 *
 *(вытащу отдельно, чтобы не писать везде, но пока лень)))
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


const resultsList = document.getElementById('result'),
    headerTask = document.querySelector('.header'), //блок для вывода общей информации по заданию
    tableTask = document.querySelector('.task-table')

new URLSearchParams(window.location.search).forEach((value, name) => {
    let taskId = `${value}`
    fetch('../json/task.json')
        .then(response => response.json())
        .then(data => {
            function addOperations(data, numberSP) {
            }

            function contains(arr, elem) {
                return arr.prototype.includes(elem);
            }

            let needData = data.filter(item => item.idTask == taskId); //список данных одного задания

            let showSP = [];
            let showedSP = [];
            let numSP;
            needData.forEach(item => {
                numSP = item.numberSP
                if (showSP.indexOf(numSP) === -1) {
                    showSP.push(numSP)
                }
            })

            needData.forEach(item => {
                if (showedSP.indexOf(item.numberSP) === -1) {
                    showedSP.push(item.numberSP)

                    headerTask.innerHTML = `Сменно-суточное задание № ${item.numberTask}`
                    resultsList.innerHTML = `
                            <p>Работник: ${item.workerName}</p>
                            <p>Дата выдачи: ${formatDateTime(item.dateIssue)}</p>
                            <p>Дата принятия: ${formatDateTime(item.dateAccept)}</p>
                        `
                    let needOperations = needData.filter(data => data.numberSP === item.numberSP);
                    needOperations.sort((a, b) => a.numberOperation > b.numberOperation ? 1 : -1);


                    let row = document.createElement('tbody');
                    row.classList.add("content")
                    row.innerHTML = `
                    <tr class = "item">
                        <td rowspan="2">${item.numberSP}</td>                        
                        <td>${item.nameSP}</td>
                        <td rowspan="2">${item.typeSizeSP}</td>
                        <td rowspan="2">${needOperations[0].numberOperation}</td>
                        <td rowspan="2">${needOperations[0].nameOperation}</td>
                        <td rowspan="2">${needOperations[0].countIssued}</td>
                        <td rowspan="2">${needOperations[0].countAccepted}</td>
                        <td rowspan="2">${needOperations[0].percentage}</td>
                    </tr>
                    <tr>
                        <td>${item.designSP}</td>
                    </tr> 
                    <tr class = "operation" >   
                                         
                                              
                    </tr>                         
                    `

                    for (let i = 1; i < needOperations.length; i++) {
                        let opEl = row.querySelector('.operation')
                        opEl.innerHTML = `
                        <td colSpan="8">
                        <table class = "additional-operation" id = ${item.numberSP}>   
                        <tr>
                        <td rowspan = ${needOperations.length} colspan = "3"> </td>
                        <td rowspan = "2">${needOperations[i].numberOperation}</td>
                        <td rowspan = "2">${needOperations[i].nameOperation}</td>
                        <td rowspan = "2">${needOperations[i].countIssued}</td>
                        <td rowspan = "2">${needOperations[i].countAccepted}</td>
                        <td rowspan = "2">${needOperations[i].percentage}</td>
                        </tr>
                        </table>
                        </td> `
                        row.appendChild(opEl);


                    }

                    row.addEventListener('click', function(){
                             let table = row.querySelector("td:first-child");
                            if (table) {
                                let idValue = table.textContent; // Получаем значение ячейки
                                let elementToChange = document.getElementById(idValue); // Находим элемент по id
                                if (elementToChange) {
                                    elementToChange.classList.add("active"); // Изменяем класс найденного элемента
                                }
                            }
                        })
                    tableTask.appendChild(row);


                } else {
                    console.log(`Деталь ${item.numberSP} уже выводилась`)
                }
            })
        })
})


