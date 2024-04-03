//вывод данных
fetch('listTask.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#data-table tbody');
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${item.departTask}</td>
                    <td>${item.masterName}</td>
                    <td>${item.workerName}</td>
                    <td>${item.dateIssue}</td>
                    <td>${item.dateAccept}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error(error)
    })

//TODO вывод данных, но с пагинацией
// function getData(){
//     const response= fetch("listTask.json");
//     return response.json();
// }
// function main(){
//     let listData = getData();
//     let currentPage = 1;
//     let rows = 10;
//     function displayList(listData, rowPage, amtPage){
//         const tableBody = document.querySelector('#data-table tbody');
//         const start = rowPage * amtPage;
//         const end = start + rowPage;//
//         const paginatedData = listData.slice(start, end);
//         paginatedData.forEach(item => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                     <td>${item.departTask}</td>
//                     <td>${item.masterName}</td>
//                     <td>${item.workerName}</td>
//                     <td>${item.dateIssue}</td>
//                     <td>${item.dateAccept}</td>`;
//             tableBody.appendChild(row);
//         })
//     }
//     function displayPagination(){}
//     function displayPaginationBtn(){}//
//     displayList(listData, rows, currentPage);
// }
// main();







