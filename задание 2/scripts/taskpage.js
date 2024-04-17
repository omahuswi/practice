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
    tableTask = document.querySelector('.task-table tbody')

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
                if (showSP.indexOf(numSP) !== -1) {
                    // console.log('lflflfl')
                } else {
                    // console.log('dpdppdpdpd')
                    showSP.push(numSP)
                }
            })

            needData.forEach(item => {
                if (showedSP.indexOf(item.numberSP) === -1) {
                    // console.log(`Деталь ${item.numberSP} выводится со всеми операциями`)
                    showedSP.push(item.numberSP)

                    headerTask.innerHTML = `Сменно-суточное задание № ${item.numberTask}`
                    resultsList.innerHTML = `
                            <p>Работник: ${item.workerName}</p>
                            <p>Дата выдачи: ${formatDateTime(item.dateIssue)}</p>
                            <p>Дата принятия: ${formatDateTime(item.dateAccept)}</p>
                        `
                    let row = document.createElement('tr');
                    row.classList.add("content")
                    row.innerHTML = `
                        <td colspan="4" >   
                            <table class="sp">     
                                <thead>
                                    <tr>
                                        <th>${item.numberSP}</th>
                                        <th>${item.designSP}</th>
                                        <th>${item.nameSP}</th>
                                        <th>${item.typeSizeSP}</th>
                                    </tr>
                                </thead>
                                <tbody class = "operation hidden">
                                    <table colspan="4" class = "operation" >     
                                        <thead>
                                            <tr>
                                                <th>НОМЕР</th>
                                                <th>НАИМЕНОВАНИЕ</th>
                                                <th>КОЛИЧЕСТВО ВЫДАННОГО</th>
                                                <th>КОЛИЧЕСТВО ПРИНЯТОГО</th>
                                                <th>ГОТОВНОСТЬ</th>
                                            </tr>
                                        </thead>
                                        <tbody id="${item.numberSP}">
                                                    
                                        </tbody>
                                    </table>       
                                </tbody>
                            </table>
                        </td>`

                    row.addEventListener('click', function () {
                        HideOperationsTable(row)
                    });
                    tableTask.appendChild(row);

                    const tableOperation = document.getElementById(item.numberSP)

                    needData.forEach(operation => {
                        if (operation.numberSP === item.numberSP) {
                            let operRow = document.createElement('tr');
                            operRow.innerHTML = `
                                <td>${operation.numberOperation}</td>
                                <td>${operation.nameOperation}</td>
                                <td>${operation.countIssued}</td>
                                <td>${operation.countAccepted}</td>
                                <td>${operation.percentage}</td>
                            `
                            tableOperation.appendChild(operRow)
                        }
                    })

                } else {
                    console.log(`Деталь ${item.numberSP} уже выводилась`)
                }


                function HideOperationsTable(row) {
                    let operationTable = document.querySelector('tbody .operation')
                    if (operationTable.classList.contains('.hidden')) {
                        operationTable.classList.remove('.hidden')
                        console.log("Показано")
                    } else {
                        operationTable.classList.add('.hidden')
                        console.log("Спрятано")
                    }
                }
            })
        })
})


