//отображение и скрытие панели фильтров
document.getElementById('filter-button').onclick = function () {
    const content = document.getElementById('filter-form');
    if (content.style.display === 'block') {
        content.style.display = 'none'; // Если форма открыта, скрываем её
    } else {
        content.style.display = 'block'; // Если форма закрыта, показываем её

        const form = document.getElementById('filter-form')


        form.addEventListener('submit', function (event) {
            event.preventDefault()//Отмена события
            ShowListTask()
        })
        form.addEventListener('submit', function (event) {
            event.preventDefault()//Отмена события
            ShowListTask()
        })
        changeDateFilter("date-accept")
        changeDateFilter("date-issue")
    }
}


// function dkdkdk(symb) {
//     let d
//     fetch('../json/listTask.json')
//         .then(response => response.json())
//         .then(data => {
//             d = data.map(item => item.dateIssue)
//                 .reduce((acc, curr) => symb === '>' ? (acc > curr ? acc : curr) : (acc < curr ? acc : curr), 0)
//         })
//     console.log(d)
//     return d
// new Date(dkdkdk('<')).toISOString().slice(0, 10)
// }


function changeDateFilter(nameInput) {
    const today = new Date();
    dateCh(document.getElementById(`${nameInput}-begin`))
    dateCh(document.getElementById(`${nameInput}-end`))

    function dateCh(dateInput) {
        let d = dkdkdk('>')
        document.querySelectorAll(`input[type=radio][name=${nameInput}]`)
            .forEach(radio => {
                radio.addEventListener('change', function () {
                    dateInput.value = dateInput.name === "begin" ? this.value === 'all' ? dateInput.min
                            : this.value === 'today' ? today.toISOString().slice(0, 10)
                                : this.value === 'thisWeek' ? getThisWeekDate(dateInput.name)
                                    : this.value === 'thisMonth' ? getThisMonthDate(dateInput.name)
                                        : dateInput.min
                        : this.value === 'all' ? today.toISOString().slice(0, 10)
                            : this.value === 'today' ? today.toISOString().slice(0, 10)
                                : this.value === 'thisWeek' ? getThisWeekDate(dateInput.name)
                                    : this.value === 'thisMonth' ? getThisMonthDate(dateInput.name)
                                        : today.toISOString().slice(0, 10)
                });
            });
    }

    function getThisWeekDate(name) {
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        return name === "begin" ? `${new Date(today.setDate(diff)).toISOString().slice(0, 10)}`
            : `${new Date(today.setDate(diff + 6)).toISOString().slice(0, 10)}`
    }

    function getThisMonthDate(name) {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        return name === "begin" ? `${new Date(year, month, 2).toISOString().slice(0, 10)}`
            : `${new Date(year, month + 1, 0).toISOString().slice(0, 10)}`
    }

    function dkdkdk(symb) {
        let d
        return fetch('../json/listTask.json')
            .then(response => response.json())
            .then(data => {
                d = data.map(item => item.dateIssue)
                    .reduce((acc, curr) => symb === '<' ? (acc < curr ? acc : curr) : (acc > curr ? acc : curr))
                return d
            })
    }

    async function getValue(symb) {
        try {
            return await dkdkdk(symb);
        } catch (error) {
            console.error(error);
        }
    }


}