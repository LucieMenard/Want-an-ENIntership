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

function Experience(id, idUser, debut, fin, duree, payee, domaine, type, idContact, idCompany, note, descr, noteDD){
    this.Id = id
    this.IdUser = idUser
    this.Debut = debut
    this.Fin = fin
    this.Duree = duree
    this.Payee = payee
    this.Domaine = domaine
    this.Type = type
    this.IdContact = idContact
    this.idCompany = idCompany
    this.Note = note
    this.Descr = descr
    this.NoteDD = noteDD
}

function Contact(nom, prenom, id, telephone,email, enibien){
    this.Nom = nom
    this.Prenom = prenom
    this.Id = id
    this.Telephone = telephone
    this.Email = email
    this.Enibien = enibien
}

function fullExpe(expe, contact, companyName){
    this.Experience = expe
    this.Contact = contact
    this.CompanyName = companyName
}


var vm = new Vue({
    el: "#app",
    delimiters: ['[[', ']]'],
    data: {
        id: 0,
        user: new Object(),
        tempoUser: new Object(),
        confirmNewMdp: "",
        afficheDateNaissance: new Object(),
        afficheDateDiplome: new Object(),
        confirmMdp: '',
        err: [],
        badPassword: false,
        expes: [1,2]
    },
    methods: {
        openModal: function () {
            this.err = []
            u = this.user
            this.tempoUser = new User(this.user.Id, this.user.Nom, this.user.Prenom, this.user.Surnom, this.user.Naissance, this.user.Email, this.user.Telephone, '', this.user.Diplome, this.user.DateDiplome)
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
            this.confirmNewMdp = ""
            $('#modifModal').modal('hide')
        },

        openModalConfirm: function () {
            $('#confirmModal').modal({
                show: true,
                backdrop: false
            })
        },

        closeModalConfirm: function () {
            $('#confirmModal').modal('hide')
        },

        logout: function () {
            $.ajax({
                url: '/logout',
                type: 'GET',
                success: function (a) {
                    document.location.href = '/'
                },
                error: function (a, status, error) {
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        },

        //Quand on sauvegarde les modifs. Ouvre la modal pour confirmation de mdp
        save: function () {
            this.err = []
            this.validate()
            if (this.err.length == 0) {
                this.confirmMdp = ''
                this.openModalConfirm()
            } 
        },

        tryPassword: function () {
            let vue = this
            $.ajax({
                url: '/tryPassword',
                type: 'POST',
                async: false,
                data: {
                    'mdp': vue.confirmMdp
                },
                success: function (a) {
                    if (a == 'True') {
                        vue.submit()
                    } else {
                        vue.badPassword = true
                    }
                },
                error: function (a, status, error) {
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        },

        //sauvegarde les modifs
        submit: function () {
            //Save new user
            let vue = this
            this.closeModalConfirm()
            if (!this.tempoUser.Mdp){
                this.tempoUser.Mdp = this.user.Mdp
            } 
            $.ajax({
                url: '/modifUser',
                data: {
                    'newUser': JSON.stringify(vue.tempoUser)
                },
                type: 'POST',
                success: function(){
                    vue.closeModal()
                    vue.getUser()
                },
                error: function (a, status, error) {
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        },

        getUser: function () {
            let vue = this
            $.ajax({
                url: '/getUser',
                data: {
                    'id': this.id
                },
                type: 'POST',
                success: function (user) {
                    user = JSON.parse(user)
                    vue.user = new User(user['Id'], user['Nom'], user['Prenom'], user['Surnom'], '1998-02-01', user['Email'], user['Telephone'], user['Mdp'], user['Diplome'], user['DateDiplome'])
                    if (vue.user.Naissance) {
                        vue.afficheDateNaissance = vue.convAffichage(vue.user.Naissance)
                    }
                    if (vue.user.DateDiplome) {
                        vue.afficheDateDiplome = vue.convAffichage(vue.user.DateDiplome)
                    }
                },
                error: function (a, status, error) {
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        },

        validate: function () {

            if ((this.tempoUser.Mdp != this.confirmNewMdp)) {
                this.err.push('Les mots de passes sont différents')
            }

            if (this.tempoUser.Diplome && !this.tempoUser.DateDiplome) {
                this.err.push("La date du diplôme doit-être spécifiée")
            }
        },

        convAffichage: function (date) {
            return moment(date).format('DD/MM/YYYY')
        },


        //----- Experiences -----

        getExps: function(){
            //Ajax pour avoir l'entreprise. 
            
        },

        convertExpObj: function(){
            //
        }



    },

    mounted() {
        var link = document.location.href.split('/');
        this.id = link[link.length - 1]
        this.getUser()

    }
})

