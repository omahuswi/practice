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

let taskId;
let departTask;
let masterName;

let taskInfo

new URLSearchParams(window.location.search).forEach((value, name) => {
    if (name === 'taskId') {
        taskId = value;
    } else if (name === 'departTask') {
        departTask = value;
    } else if (name === 'masterName') {
        masterName = value;
    }
})

fetch('../json/task.json')
    .then(response => response.json())
    .then(data => {
        let needData = data.filter(item => item.idTask == taskId); //список данных одного задания по taskId
        let showSP = [] //список деталей для отрисовки
        let showedSP = [] //список отрисованных деталей
        let numSP //номер детали


        //получение списка номеров деталей
        needData.forEach(item => {
            numSP = item.numberSP
            if (showSP.indexOf(numSP) === -1) {
                showSP.push(numSP)
            }

            //данные о задании
            taskInfo = {
                idTask: taskId,
                numberTask: item.numberTask,
                workerName: item.workerName,
                masterName: masterName,
                departTask: departTask
            }
        })

        needData.forEach(item => {
            if (showedSP.indexOf(item.numberSP) === -1) {
                showedSP.push(item.numberSP)

                //отрисовка данных о задании
                headerTask.innerHTML = `Сменно-суточное задание № ${taskInfo.numberTask}`
                resultsList.innerHTML = `
                            <p>Работник: ${taskInfo.workerName}</p>
                            <p>Мастер: ${taskInfo.masterName}</p>
                            <p>Цех: ${taskInfo.departTask}</p>
                            <p>Дата выдачи: ${item.dateIssue ? formatDateTime(item.dateIssue) : '-'}</p>
                            <p>Дата принятия: ${item.dateAccept ? formatDateTime(item.dateAccept) : '-'}</p>
                        `
                // список операций для данной детали
                let needOperations = needData.filter(data => data.numberSP === item.numberSP)
                    .sort((a, b) => a.numberOperation > b.numberOperation ? 1 : -1)

                //отрисовка задания и первой операции
                let row = document.createElement('tbody');
                row.classList.add("content")
                row.innerHTML = `
                    <tr class = "item">
                        <td rowspan="2">${item.numberSP ? item.numberSP : ''}</td>                        
                        <td ${item.nameSP ? '' : 'rowspan="2"'}>${item.designSP ? item.designSP : ''}</td>
                        <td rowspan="2">${item.typeSizeSP ? item.typeSizeSP : ''}</td>
                        <td rowspan="2">${needOperations[0].numberOperation ? needOperations[0].numberOperation : ''}</td>
                        <td rowspan="2">${needOperations[0].nameOperation ? needOperations[0].nameOperation : ''}</td>
                        <td rowspan="2">${needOperations[0].countIssued ? needOperations[0].countIssued : ''}</td>
                        <td rowspan="2">${needOperations[0].countAccepted ? needOperations[0].countAccepted : ''}</td>
                        <td rowspan="2">${needOperations[0].percentage ? needOperations[0].percentage : ''}</td>
                    </tr>                                             
                    ${item.nameSP ? `<tr class = "item"><td>${item.nameSP}</td></tr>` : `<tr class = "item"></tr>`}
                    <tr class="operation" >
                        <td class="operation" colspan="8">
                            <table class = "additional-operation" id = ${item.numberSP}></table>
                        </td> 
                    </tr>`

                //отрисовка остальных операций
                for (let i = 1; i < needOperations.length; i++) {
                    let op = row.querySelector('.additional-operation')
                    let opEl = document.createElement('tr')
                    opEl.innerHTML = `
                        <td rowspan = "2" colspan = "3"></td>
                        <td rowspan = "2">${needOperations[i].numberOperation ? needOperations[i].numberOperation : ''}</td>
                        <td rowspan = "2">${needOperations[i].nameOperation ? needOperations[i].nameOperation : ''}</td>
                        <td rowspan = "2">${needOperations[i].countIssued ? needOperations[i].countIssued : ''}</td>
                        <td rowspan = "2">${needOperations[i].countAccepted ? needOperations[i].countAccepted : ''}</td>
                        <td rowspan = "2">${needOperations[i].percentage ? needOperations[i].percentage : ''}</td>         
                        `
                    op.appendChild(opEl);
                    opEl = document.createElement('tr')
                    op.appendChild(opEl);
                    row.querySelector('tr.operation').style.display = 'none'
                }
                tableTask.appendChild(row);

                //ГАРМОШКА
                document.querySelectorAll('tbody.content').forEach(content => {
                    function select_row(row) {
                        row.parentNode.querySelectorAll('tr').forEach(row => row.classList.remove('selected')); // Удаляем класс 'selected' у всех строк
                        row.classList.add('selected'); // Добавляем класс 'selected' кликнутой строке
                    }

                    let operationRow = content.querySelector('tr.operation')
                    operationRow.addEventListener('click', function () {
                        select_row(operationRow)
                    });

                    content.onclick = function () {
                        if (operationRow.style.display === 'none' || operationRow.style.display === '') {
                            operationRow.style.display = 'contents'; // Если строка скрыта или не видима, показываем её
                        } else {
                            operationRow.style.display = 'none'; // Если строка видима, скрываем её
                        }
                    }
                });

            } else {
                console.log(`Деталь ${item.numberSP} уже выводилась`)
            }
        })
    })


document.getElementById('open-update-modal-btn').addEventListener("click", () => {
    document.getElementById('update-modal').classList.add("open")
    document.getElementById('number-task').value = taskInfo.numberTask
    document.getElementById('worker-name').value = taskInfo.workerName
    document.getElementById('master-name').value = taskInfo.masterName
    document.getElementById('depart-task').value = taskInfo.departTask
})

document.getElementById('close-update-modal-btn').addEventListener("click", () => {
    //тут должна была бы быть проверка на внесение изменений
    // if (window.confirm("Сохранить изменения?")) {
    //     //тут что нибудь
    // }
    document.getElementById('update-modal').classList.remove("open")
})

document.getElementById('update-btn').addEventListener("click", () => {
    if (window.confirm("Подтвердите изменение")) {
        CreateDataFile('listTask', 'update')
        CreateDataFile('task', 'update')
    }
})

document.getElementById('delete-btn').addEventListener("click", () => {
    if (window.confirm("Подтвердите удаление")) {
        CreateDataFile('listTask', 'delete')
        CreateDataFile('task', 'delete')
    }
})

document.getElementById('accept-btn').addEventListener("click", () => {
    if (window.confirm("Подтвердите принятие")) {
        CreateDataFile('listTask', 'accept')
        CreateDataFile('task', 'accept')
    }
})

function CreateDataFile(fileName, operation) {
    fetch(`../json/${fileName}.json`)
        .then(response => response.json())
        .then(data => {
            let numberTask = document.getElementById('number-task').value,
                workerName = document.getElementById('worker-name').value,
                masterName = document.getElementById('master-name').value,
                departTask = document.getElementById('depart-task').value

            const updatedData = operation === 'update' ? data.map(obj => {
                if (obj.idTask === parseInt(taskId)) {
                    const updatedObj = {...obj, numberTask: numberTask, workerName: workerName,}
                    if (obj.masterName) updatedObj.masterName = masterName
                    if (obj.departTask) updatedObj.departTask = departTask
                    return updatedObj
                }
                else return obj

            }) : operation === 'accept' ? data.map(obj => {
                if (obj.idTask === parseInt(taskId)) {
                    const updatedObj = {...obj, dateAccept: new Date()}
                    return updatedObj
                }
                else return obj

            }) : data.filter(obj => obj.id !== taskId);
            const json = JSON.stringify(updatedData, null, 2);
            const blob = new Blob([json], {type: 'application/json'});
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.json`;
            a.click();
            URL.revokeObjectURL(url)
        })
}


