function User(nom, prenom, surnom, naissance, email, telephone, mdp, diplome, dateDiplome) {
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
        user: new User('Antoine', 'Martet', 'Bytou', '1998-02-01', 'a6martet@enib.fr', '12345678', 'basket', true, '2022-01-01'),
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

    created() {
        if (this.user.Naissance){
            this.afficheDateNaissance = this.convAffichage(this.user.Naissance)
        }
        if (this.user.DateDiplome){
            this.afficheDateDiplome = this.convAffichage(this.user.DateDiplome)

        }
    }
})

