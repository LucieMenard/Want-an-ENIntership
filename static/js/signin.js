var vm = new Vue({
    el: '#app',
    delimiters: ['[[',']]'],
    data: {
        email: '',
        mdp: ''
    },
    methods: {
        submit: function(){
            var vue = this
            console.log('Ok')
            $.ajax({
                url: '/connexion',
                data: {
                    'email': vue.email,
                    'mdp': vue.mdp
                },
                type: 'POST',
                success: function(a){
                    console.log(a)
                    document.location.href = '/profil/'+a['id']
                },
                error: function (a, status, error) {
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        }
    }
})