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

function changeDateFilter(nameInput) {
    const today = new Date();
    dateCh(document.getElementById(`${nameInput}-begin`))
    dateCh(document.getElementById(`${nameInput}-end`))

    function dateCh(dateInput) {
        document.querySelectorAll(`input[type=radio][name=${nameInput}]`)
            .forEach(radio => {
                radio.addEventListener('change', function () {
                    dateInput.value = dateInput.name === "begin" ? this.value === 'today' ? new Date().toISOString().slice(0, 10)
                            : this.value === 'thisWeek' ? getThisWeekDate(dateInput.name)
                                : this.value === 'thisMonth' ? getThisMonthDate(dateInput.name)
                                    : '' :
                        this.value === 'today' ? new Date().toISOString().slice(0, 10)
                            : this.value === 'thisWeek' ? getThisWeekDate(dateInput.name)
                                : this.value === 'thisMonth' ? getThisMonthDate(dateInput.name)
                                    : ''
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
}