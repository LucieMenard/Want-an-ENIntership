function myFunction() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    inputDomain = document.getElementById("filterDomain");
    //inputCity = document.getElementById("filterCity");
    //inputCountry = document.getElementById("filterCountry");
    filterDomain = inputDomain.value.toUpperCase();
    //filterCity = inputCity.value.toUpperCase();
    //filterCountry = inputCountry.value.toUpperCase();
    table = document.getElementById("infoExp");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        tdDomain = tr[i].getElementsByTagName("td")[0];
        //tdCity = tr[i].getElementsByTagName("td")[1];
        //tdCountry = tr[i].getElementsByTagName("td")[2];
        if (tdDomain) {
            txtValueDomain = tdDomain.textContent || tdDomain.innerText;
            //txtValueCity = tdCity.textContent || tdCity.innerText;
            //txtValueCountry = tdCountry.textContent || tdCountry.innerText;
            if (txtValueDomain.toUpperCase().indexOf(filterDomain) > -1 ) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}