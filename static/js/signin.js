var vm = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        email: '',
        mdp: '',
        errMail: false,
        errPass: false
    },
    methods: {
        submit: function () {
            this.errPass=false
            this.errMail= false
            var vue = this
            console.log('Ok')
            $.ajax({
                url: '/connexion',
                data: {
                    'email': vue.email,
                    'mdp': vue.mdp
                },
                type: 'POST',
                success: function (a) {
                    console.log(a)
                    if (a == 'Email') {
                        vue.errMail = true
                    } else {
                        if (a=='Mdp') {
                            vue.errPass = true
                        } else {
                            console.log(a)
                            document.location.href = '/profil/' + a['id']
                        }
                    }
                },
                error: function (a, status, error) {
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        }
    }
})