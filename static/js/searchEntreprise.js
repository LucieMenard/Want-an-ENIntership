
var macarte = L.map('maCarte').setView([48.3606, -4.5666], 16)
L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    // Il est toujours bien de laisser le lien vers la source des données
    attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
    minZoom: 1,
    maxZoom: 20
}).addTo(macarte);
table = document.getElementById("infoCompanies");
tr = table.getElementsByTagName("tr");
console.log(tr)
var markerList = L.markerClusterGroup()
for (i = 1; i < tr.length; i++) {
    x = parseFloat(tr[i].getElementsByTagName("td")[4].textContent.split(' ').join('').split('\n').join(''))
    y = parseFloat(tr[i].getElementsByTagName("td")[5].textContent.split(' ').join('').split('\n').join(''))
    var marker = L.marker([x, y])
    markerList.addLayer(marker)
}
macarte.addLayer(markerList)





function myFunction() {
    markerList.clearLayers()
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    inputName = document.getElementById("filterName");
    inputCity = document.getElementById("filterCity");
    inputCountry = document.getElementById("filterCountry");
    filterName = inputName.value.toUpperCase();
    filterCity = inputCity.value.toUpperCase();
    filterCountry = inputCountry.value.toUpperCase();
    table = document.getElementById("infoCompanies");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        tdName = tr[i].getElementsByTagName("td")[0];
        tdCity = tr[i].getElementsByTagName("td")[1];
        tdCountry = tr[i].getElementsByTagName("td")[2];
        if (tdName && tdCity && tdCountry) {
            txtValueName = tdName.textContent || tdName.innerText;
            txtValueCity = tdCity.textContent || tdCity.innerText;
            txtValueCountry = tdCountry.textContent || tdCountry.innerText;
            if (txtValueName.toUpperCase().indexOf(filterName) > -1
                && txtValueCity.toUpperCase().indexOf(filterCity) > -1
                && txtValueCountry.toUpperCase().indexOf(filterCountry) > -1) {
                tr[i].style.display = "";
                x = parseFloat(tr[i].getElementsByTagName("td")[4].textContent.split(' ').join('').split('\n').join(''))
                y = parseFloat(tr[i].getElementsByTagName("td")[5].textContent.split(' ').join('').split('\n').join(''))
                console.log(x)
                var marker = L.marker([x, y])
                markerList.addLayer(marker)
            } else {
                tr[i].style.display = "none";
            }
            macarte.addLayer(markerList)
        }
    }
}





// var vm = new Vue({
//     el="#app",
//     delimiters: ['[[',']]'],
//     data: {

//     },
//     methods: {
//         getAllCompanies: function(){
//             $.ajax({
//                 url: '/getInfosCompanies',
//                 type: 'GET',
//                 success: function(data){
//                     console.log(data)
//                 }
//             })
//         }
//     }
// })