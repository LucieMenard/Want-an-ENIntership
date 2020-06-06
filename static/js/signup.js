function User(){
    this.Nom = ""
    this.Prenom = ""
    this.Surnom = ""
    this.Naissance = ""
    this.Email = ""
    this.Telephone = ""
    this.Mdp = ""
    this.Diplome = false
    this.DateDiplome = ""
    this.save =  function(){
        console.log('Test')
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
            if (!this.user.Email || !this.user.Nom || !this.user.Prenom || !this.user.Mdp){
                this.err.push('Les champs marqués avec une * sont obligatoires')
            } 
            if (!this.user.Email.match(regMail)){
                this.err.push("L'email n'est pas valide")
            }

            if (this.user.Mdp != this.confirmPassword){
                this.err.push("Les mots de passes sont différents")
            }

            if (this.user.Diplome && !this.user.DateDiplome){
                this.err.push("La date du diplôme doit-être spécifiée")
            }

            if (!this.user.Mdp.match(regMdp)){
                this.err.push("Le mot de passe doit contenir au moins 6 caractères")
            }
        },


        submit : function(){
            let vue = this
            this.err = []
            this.validate()
            vue.User.save()
            if (this.err.length == 0){
                $.ajax({
                    url: '/saveUser',
                    data: {
                        'newUser' : JSON.stringify(vue.user) 
                    },
                    type: 'POST',
                    success: function(a){
                        if (a=='False'){
                            vue.err.push("L'adresse mail existe déjà dans la base de donnée")
                        } else {
                            console.log(a)
                            document.location.href = '/profil/'+a['id']
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