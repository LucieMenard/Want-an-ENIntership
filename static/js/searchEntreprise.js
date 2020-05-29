function searchEntreprise(name,city,country){
    this.Name=name
    this.City= city
    this.Country= country
}

var vm = new Vue({
    el: "#app",
    delimiters: ['[[', ']]'],
    data: {
        searchEntreprise: new searchEntreprise(),
        tempoEntreprise: new Object(),
        entreprises: [searchEntreprise],
        err: []
    },

    methods: {
        getEntreprise: function () {
            let vue = this
            $.ajax({
                url: '/searchEntreprise',
                data: {
                    'id': this.id
                },
                type: 'POST',
                success: function (searchEntreprise) {
                    searchEntreprise = JSON.parse(searchEntreprise)
                    vue.searchEntreprise = new searchEntreprise(searchEntreprise['Name'], searchEntreprise['City'], searchEntreprise['Country'])
                    
                },
                error: function (a, status, error) {
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        },
    }
})