function Exp() {
    this.Type = ""
    this.Domain = ""
    this.Company = ""
    this.Money = ""
    this.Duration = ""
    this.StartDate = ""
    this.EndDate = ""
    this.FeelGrade = 0
    this.Description = ""
    this.EndDate = ""
    this.Contact = function Contact() {
        this.Nom = ""
        this.Prenom = ""
        this.Email = ""
        this.Telephone = ""
        this.Enibien = False
    }
}
function Entreprise() {
    this.Name = ""
    this.idEntreprise = 0
    this.Address = ""
    this.Postal_Code = 0
    this.City = ""
    this.Country = ""
    this.Grade = 0
}


var vm = new Vue({
    el: "#app",
    delimiters: ['[[', ']]'],
    data: {
        exp: new Exp(),
        entreprise: new Entreprise(),
        tempoExp: new Object(),
        confirmPassword: "",
        err: []
    },

    methods: {
        openModalEntreprise: function () {
            this.err = []
            this.entreprise = new Entreprise()
            $('#modifModalEntreprise').modal({
                show: true,
                backdrop: false,
            })
            console.log('Test')

        },
        closeModalEntreprise: function () {
            this.err = []
            $('#modifModalEntreprise').modal('hide')
        },
        save: function () {
            this.err = []
            this.validate()
            if (this.err.length == 0) {
                console.log("Perf")
                this.closeModalEntreprise()
            } else {
                console.log("Problem")
            }
        },
        validate: function () {
            //Regular expression of an email
            let regMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            let regMdp = /^[\W\w]{6,}$/
            if (!this.exp.Company || !this.exp.Type || !this.exp.Domain || !this.exp.Duration) {
                this.err.push('Les champs marqués avec une * sont obligatoires')
            }
            if (!this.exp.contact.Email.match(regMail)) {
                this.err.push("L'email n'est pas valide")
            }

        },
        validateEntreprise: function () {
            if (!this.entreprise.Name || !this.entreprise.Address || !this.entreprise.Postal_Code || !this.entreprise.City || !this.entreprise.Country) {
                this.err.push('Tous les champs sont obligatoires')
            }
        },

        submit: function () {
            let vue = this
            this.err = []
            this.validate()
            if (this.err.length == 0) {
                $.ajax({
                    url: '/saveExp',
                    data: {
                        'newExp': JSON.stringify(vue.exp)
                    },
                    type: 'POST',
                    error: function (a, status, error) {
                        console.log('Erreur : ' + error + '\nStatus : ' + status)
                    }
                })
            }
        },
        submitEntreprise: function () {
            let vue = this
            this.err = []
            this.validateEntreprise()
            if (this.err.length == 0) {
                $.ajax({
                    url: '/saveEntreprise',
                    data: {
                        'newEntreprise': JSON.stringify(vue.entreprise)
                    },
                    type: 'POST',
                    success: function (a) {
                        if (a == 'False') {
                            vue.err.push("Ce nom d'entreprise existe déjà")
                        } else {
                            console.log(a)
                            vue.closeModalEntreprise()
                        }
                    },
                    error: function (a, status, error) {
                        console.log('Erreur : ' + error + '\nStatus : ' + status)
                    }
                })
            }

        }
    }
})