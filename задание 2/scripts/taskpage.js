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

let taskId

new URLSearchParams(window.location.search).forEach((value, name) => {
    taskId = `${value}`
    fetch('../json/task.json')
        .then(response => response.json())
        .then(data => {
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
                        <td rowspan="2">${item.numberSP ? item.numberSP : ''}</td>                        
                        <td ${item.nameSP ? '' : 'rowspan="2"'}>${item.designSP ? item.designSP : ''}</td>
                        <td rowspan="2">${item.typeSizeSP ? item.typeSizeSP : ''}</td>
                        <td rowspan="2">${needOperations[0].numberOperation ? needOperations[0].numberOperation : ''}</td>
                        <td rowspan="2">${needOperations[0].nameOperation ? needOperations[0].nameOperation : ''}</td>
                        <td rowspan="2">${needOperations[0].countIssued ? needOperations[0].countIssued : ''}</td>
                        <td rowspan="2">${needOperations[0].countAccepted ? needOperations[0].countAccepted : ''}</td>
                        <td rowspan="2">${needOperations[0].percentage ? needOperations[0].percentage : ''}</td>
                    </tr>                                                  
                    ${item.nameSP ? `
                        <tr>
                            <td>${item.nameSP}</td>
                        </tr>` : `
                        <tr>                            
                        </tr>`}
                    <tr class="operation">
                    <td class="operation" colspan="8">
                        <table class = "additional-operation" id = ${item.numberSP}></table>
                        </td> 
                    </tr>`


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
                    }

                    row.addEventListener('click', function () {
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
document.getElementById('open-update-modal-btn').addEventListener("click", () => {
    document.getElementById('update-modal').classList.add("open")
})

document.getElementById('close-update-modal-btn').addEventListener("click", () => {
    document.getElementById('update-modal').classList.remove("open")
})

document.getElementById('update-btn').addEventListener("click", () => {
    let numberTask = document.getElementById('number-task').value,
        workerName = document.getElementById('worker-name').value,
        masterName = document.getElementById('master-name').value,
        departTask = document.getElementById('depart-task').value

    fetch('../json/listTask.json')
        .then(response => response.json())
        .then(data => {
            const updatedData = data.map(obj => {
                if (obj.idTask === parseInt(taskId)) {
                    let taskObj = JSON.stringify(obj)
                    localStorage.setItem('task2', taskObj)
                    return {
                        ...obj, numberTask: numberTask,
                        workerName: workerName,
                        masterName: masterName,
                        departTask: departTask
                    };
                } else {
                    return obj;
                }
            });

            // Преобразуем обновленные данные в JSON
            const json = JSON.stringify(updatedData, null, 2);

            // Создаем Blob и ссылку для скачивания
            const blob = new Blob([json], {type: 'application/json'});
            const url = URL.createObjectURL(blob);

            // Создаем ссылку для скачивания файла
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.json';
            a.click();

            // Очищаем URL объекта
            URL.revokeObjectURL(url)
        })
})


