document.getElementById('save-btn').addEventListener("click", () =>  {
    let numberTask = document.getElementById('number-task').value,
        workerName = document.getElementById('worker-name').value,
        masterName = document.getElementById('master-name').value,
        departTask = document.getElementById('depart-task').value

    let taskObj = {
        idTask: 11111111,
        numberTask: numberTask,
        departTask: departTask,
        masterName: masterName,
        workerName: workerName,
        dateIssue: new Date(),
        dateAccept: null
    }


    fetch('/json/listTask.json')
        .then(response => response.json())
        .then(data => {
            const updatedData = {...data, ...taskObj};

            const json = JSON.stringify(updatedData, null, 2);

            const blob = new Blob([json], {type: 'application/json'});
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `listTask.json`;
            a.click();
            URL.revokeObjectURL(url);
        })
})

