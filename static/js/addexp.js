function Exp() {
    this.Type = ""
    this.Domain = ""
    this.Company = 0
    this.Money = false
    this.Duration = ""
    this.StartDate = "2020-05-25"
    this.EndDate = "2020-06-25"
    this.FeelGrade = 0
    this.Description = ""
}
function Grade() {
    this.q1 = ""
    this.q2 = ""
    this.q3 = ""
    this.q4 = ""
    this.q5 = ""
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
function Contact() {
    this.Nom = ""
    this.Prenom = ""
    this.Email = ""
    this.Telephone = ""
    this.Enibien = false
}

var vm = new Vue({
    el: "#app",
    delimiters: ['[[', ']]'],
    data: {
        exp: new Exp(),
        entreprise: new Entreprise(),
        contact: new Contact(),
        tempoExp: new Object(),
        grade: new Grade(),
        confirmPassword: "",
        err: []
    },

    methods: {
        // Entreprise
        openModalEntreprise: function () {
            this.err = [];
            this.entreprise = new Entreprise();
            $('#modifModalEntreprise').modal({
                show: true,
                backdrop: false,
            });
            console.log('Test');
        },
        closeModalEntreprise: function () {
            this.err = [];
            $('#modifModalEntreprise').modal('hide');
        },
        save: function () {
            this.err = [];
            this.validate();
            if (this.err.length == 0) {
                console.log("Perf");
                this.closeModalEntreprise();
            } else {
                console.log("Problem");
            }
        },
        // Formulaire
        openModalFormulaire: function () {
            this.err=[];
            this.validate();
            if (this.err.length == 0) {
                $('#modifModalFormulaire').modal({
                    show: true,
                    backdrop: false,
                });
            }
        },
        closeModalFormulaire: function () {
            $('#modifModalFormulaire').modal('hide');
        },
        
        validate: function () {
            //Regular expression of an email
            let regMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            if (!this.exp.Company || !this.exp.Type || !this.exp.Domain || !this.exp.Duration) {
                this.err.push('Les champs marqués avec une * sont obligatoires');
            }
            if (this.contact && this.contact.Email && !this.contact.Email.match(regMail)) {
                this.err.push("L'email n'est pas valide");
            }
        },
        validateEntreprise: function () {
            if (!this.entreprise.Name || !this.entreprise.Address || !this.entreprise.Postal_Code || !this.entreprise.City || !this.entreprise.Country) {
                this.err.push('Tous les champs sont obligatoires');
            }
        },
        validateFormulaire : function() {
            if (!this.exp.Grade.q1 || !this.exp.Grade.q2 || !this.exp.Grade.q3 || !this.exp.Grade.q4 || !this.exp.Grade.q5 ) {
                this.err.push('Les questions sont obligatoires.');
            }
        },

        submit: function () {
            this.err = [];
            // this.validateFormulaire();
            if (this.err.length == 0) {
                $.ajax({
                    url: '/saveExp',
                    data: {
                        'newExp': JSON.stringify(vm.exp),
                        'newContact': JSON.stringify(vm.contact)
                    },
                    type: 'POST',
                    success: function (data, status, xhr) {
                        alert("L'expérience a bien été créée ! Son id :" + data.id);
                        //TODO supprimer les dates et la description
                        //Redirection sur la page de l'expérience
                        document.location.href = data.url;
                    },
                    error: function (xhr, status, error) {
                        vm.err.push(xhr.responseText);
                    }
                })
            }
        },
        submitEntreprise: function () {
            let vue = this;
            this.err = [];
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
                            vue.err.push("Ce nom d'entreprise existe déjà");
                        } else {
                            console.log(a);
                            let label = a.name + ' (' + a.country + ')';
                            $('#companies').append(new Option(label, a.id));
                            vue.exp.Company = a.id; // Le fait de changer la propriété du modèle dans vue.js sélectionne l'option dans le html
                            vue.closeModalEntreprise();
                        }
                    },
                    error: function (a, status, error) {
                        console.log('Erreur : ' + error + '\nStatus : ' + status);
                    }
                })
            }

        }
    }
})