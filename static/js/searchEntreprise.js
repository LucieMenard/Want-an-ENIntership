function myFunction() {
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
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}