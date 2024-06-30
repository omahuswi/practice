//РЕДАКТИРОВАНИЕ ЗАДАНИЯ
document.getElementById('crt-nw-frm').addEventListener('submit', function(event){
    event.preventDefault()

    //todo idTask получать из списка
    let idTask = 2838093
    let numberTask = document.getElementById('numberTask').value
    let workerName = document.getElementById('workerName').value

    fetch('../json/listTask.json')
        .then(response => response.json())
        .then(data => {
            const updatedData = data.map(obj => {
                if (obj.idTask === parseInt(idTask)) {
                    let taskObj = JSON.stringify(obj)
                    console.log(obj)
                    console.log(taskObj)

                    localStorage.setItem('task2', taskObj)
                    return { ...obj, workerName: workerName };
                } else {
                    return obj;
                }
            });

            // Преобразуем обновленные данные в JSON
            const json = JSON.stringify(updatedData, null, 2);

            // Создаем Blob и ссылку для скачивания
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Создаем ссылку для скачивания файла
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.json';
            a.click();

            // Очищаем URL объекта
            URL.revokeObjectURL(url);



            //ДОБАВЛЕНИЕ НОВОГО ЗАДАНИЯ

            //todo переделать заполнение объекта
            //todo гененерировать idTask

            // let taskObj ={
            //     idTask: 11111111,
            //     numberTask: numberTask,
            //     departTask: null,
            //     masterName: null,
            //     workerName: workerName,
            //     dateIssue: null,
            //     dateAccept: null
            // };
            // const updatedData = { ...data, ...taskObj };
            //
            // const json = JSON.stringify(updatedData, null, 2);
            //
            // const blob = new Blob([json], { type: 'application/json' });
            // const url = URL.createObjectURL(blob);
            //
            // const a = document.createElement('a');
            // a.href = url;
            // a.download = 'listTask.json';
            // a.click();
            //
            // URL.revokeObjectURL(url);

        });
})

