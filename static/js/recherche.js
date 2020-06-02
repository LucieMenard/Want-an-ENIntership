$('input[type="radio"]').change(function () {
    var domain = $('input[name="filterDomain"]:checked').prop('value') || '';
    var money = $('input[name="filterMoney"]:checked').prop('value') || '';
    var type = $('input[name="filterType"]:checked').prop('value') || '';
    var country = $('input[name="filterCountry"]:checked').prop('value') || '';

    $('tbody').hide();
    $('tbody:contains(' + type + ')').show();
    $('tbody').not(':contains(' + domain + ')').hide();
    $('tbody').not(':contains(' + money + ')').hide();

    // if(country==France){
    // 	$('tbody:contains(' + France + ')').show();
    // }
    // else{
    // 	$('tbody').not(':contains(' + France + ')').show();
    // }
});
