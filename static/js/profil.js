function User(id, nom, prenom, surnom, naissance, email, telephone, mdp, diplome, dateDiplome) {
    this.Id = id
    this.Nom = nom
    this.Prenom = prenom
    this.Surnom = surnom
    this.Naissance = naissance
    this.Email = email
    this.Telephone = telephone
    this.Mdp = mdp
    this.Diplome = diplome
    this.DateDiplome = dateDiplome
}




var vm = new Vue({
    el: "#app",
    delimiters: ['[[', ']]'],
    data: {
        id: 0,
        user: new Object(),
        tempoUser: new Object(),
        confirmMdp: "",
        afficheDateNaissance: new Object(),
        afficheDateDiplome: new Object(),
        err: []
    },
    methods: {
        openModal: function () {
            this.err = []
            this.tempoUser = this.user
            if (this.user.DateDiplome)
                this.afficheDate = new Date(this.user.DateDiplome)
                this.afficheDate = moment(this.afficheDate).format('DD/MM/YYYY')
            $('#modifModal').modal({
                show: true,
                backdrop: false,
            })
        },
        closeModal: function () {
            this.err = []
            this.confirmMdp = ""
            $('#modifModal').modal('hide')
        },

        logout: function(){
            $.ajax({
                url: '/logout',
                type: 'GET',
                success: function(a){
                    console.log(a)
                    document.location.href = '/'
                }
            })
        },

        save: function () {
            this.err = []
            this.validate()
            if (this.err.length == 0){
                this.user = this.tempoUser
                console.log("Perf")
                this.closeModal()
            } else {
                console.log("Problem")
            }
        },

        getUser: function(){
            let vue = this
            $.ajax({
                url: '/getUser',
                data: {
                    'id': this.id
                }, 
                type: 'POST',
                success: function(user){
                    console.log(user)
                    user = JSON.parse(user)
                    u = new User(user['Id'], user['Nom'], user['Prenom'], user['Surnom'], '1998-02-01', user['Email'], user['Telephone'], user['Mdp'], user['Diplome'], user['DateDiplome'])
                    console.log(u)
                    vue.user = u
                    if (vue.user.Naissance){
                        vue.afficheDateNaissance = vue.convAffichage(vue.user.Naissance)
                    }
                    if (vue.user.DateDiplome){
                        vue.afficheDateDiplome = vue.convAffichage(vue.user.DateDiplome)
                    }
                }, 
                error: function (a, status, error) {
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        },

        validate: function () {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

            if ((this.tempoUser.Mdp && !this.confirmMdp) || (!this.tempoUser.Mdp && !this.confirmMdp)) {
                this.err.push('Confirmez votre mot de passe ou modifiez-le')
            } else {
                if (this.tempoUser.Mdp != this.confirmMdp) {
                    this.err.push('Les mots de passes sont différents')
                }
            }
            

            if (this.tempoUser.Diplome && !this.tempoUser.DateDiplome) {
                this.err.push("La date du diplôme doit-être spécifiée")
            }
        },

        convAffichage : function(date){
            return moment(date).format('DD/MM/YYYY')
        }
    }, 

    mounted() {
        var link = document.location.href.split('/');
        this.id = link[link.length-1]
        this.getUser()
        
    }
})

