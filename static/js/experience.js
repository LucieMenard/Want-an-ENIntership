function Exp(domaine,duree,remuneration,type,identite,idCompany,grade,idContact) {
    this.Type = type
    this.Domain = domaine
    this.Money = remuneration
    this.Duration = duree
    this.Identite = identite
    this.IdCompany = idCompany
    this.IdContact = idContact
    this.Grade = grade
}
function Company(nom) {
    this.Nom = nom
}
function Contact(nom, prenom){
    this.Nom = nom
    this.Prenom = prenom
}
function User(nom,prenom){
    this.Nom = nom
    this.Prenom = prenom
}

var vm = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        entreprise: new Object(),
        experience: new Object(),
        contact: new Object(),
        user: new Object()
    },
    methods: {
        getExperience: function(id){
            let vue = this
            $.ajax({
                url: '/getExp/'+id,
                async: false,
                type: 'GET',
                success: function(d, status, xhr){
                    console.log(d)
                    vue.experience = new Exp(d['domaine'],
                                             d['duree'],
                                             d['remuneration'],
                                             d['type'],
                                             d['identite'],
                                             d['idCompany'],
                                             d['idContact'],
                                             d['grade'])
                    console.log(vue.entreprise)
                    var idUser=d['idCompany']
                },
                error: function(xhr, status, error){
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        },
        getCompany: function(id){
            let vue = this;
            $.ajax({
                url: '/getCompany',
                data: {
                    'id': id
                },
                async: false,
                type: 'POST',
                success: function(d, status, xhr){
                    console.log(d)
                    vue.entreprise = new Company(d['nom'])
                    console.log(vue.entreprise)
                },
                error: function(xhr, status, error){
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        },
        getContact: function(id){
            let vue = this
            $.ajax({
                url: '/getOneContact/'+id,
                type: 'GET',
                success: function(d, status, xhr){
                    console.log(d)
                    vue.contact = new Contact(d['name'], d['surname'])
                    console.log(vue.contact)
                },
                error: function(xhr, status, error){
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        },
        getUser: function(id){
            let vue = this
            $.ajax({
                url: '/getOneUser/'+id,
                type: 'GET',
                success: function(d, status, xhr){
                    console.log(d)
                    vue.user = new User(d['name'], d['surname'])
                    console.log(vue.user)
                },
                error: function(xhr, status, error){
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        }
    },
    mounted() {
        var link = document.location.href.split('/')
        var id = link[link.length - 1]
        this.getExperience(id)
        this.getCompany(id)
        this.getContact(id)
        
        console.log(idUser)
        // idUser=this.getIDUser()
        this.getUser(idUser)
    }
})