function Exp(){
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
    this.Contact = function Contact(){
                    this.Nom = ""
                    this.Prenom = ""
                    this.Email = ""
                    this.Telephone = ""
                    this.Enibien = False
    }
}

var vm = new Vue({
    el: "#app", 
    delimiters: ['[[', ']]'],
    data: {
        user: new User(),
        confirmPassword: "",
        err: []
    }, 

    methods : {
        validate: function(){
            //Regular expression of an email
            let regMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            let regMdp = /^[\W\w]{6,}$/
            if (!this.exp.Company || !this.exp.Type || !this.exp.Domain || !this.exp.Duration){
                this.err.push('Les champs marqués avec une * sont obligatoires')
            } 
            if (!this.exp.contact.Email.match(regMail)){
                this.err.push("L'email n'est pas valide")
            }
        },

        submit : function(){
            let vue = this
            this.err = []
            this.validate()
            if (this.err.length == 0){
                $.ajax({
                    url: '/saveExp',
                    data: {
                        'newExp' : JSON.stringify(vue.exp) 
                    },
                    type: 'POST',
                    error: function (a, status, error) {
                        console.log('Erreur : ' + error + '\nStatus : ' + status)
                    }
                })
            }
        }
    }
})