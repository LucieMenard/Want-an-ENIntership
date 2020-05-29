function Company(id, nom, adresse, cp, ville, pays, note) {
    this.Id = id
    this.Nom = nom
    this.Adresse = adresse
    this.CodePostal = cp
    this.Ville = ville
    this.Pays = pays
    this.Note = note
}

function Contact(id, nom, prenom, telephone, mail, enibien){
    this.Id = id
    this.Nom = nom
    this.Prenom = prenom
    this.Telephone = telephone
    this.Mail = mail
    this.Enibien = enibien
}



var vm = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        entreprise: new Object(),
        contacts: []
    },
    methods: {
        getCompany: function(id){
            let vue = this
            $.ajax({
                url: '/getCompany',
                data: {
                    'id': id
                },
                async: false,
                type: 'POST',
                success: function(d, status, xhr){
                    console.log(d)
                    vue.entreprise = new Company(d['id'], d['nom'], d['adresse'], d['cp'], d['ville'], d['pays'], d['note'])
                    console.log(vue.entreprise)
                },
                error: function(xhr, status, error){
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        },

        getContacts: function(){
            let vue = this
            $.ajax({
                url: '/getContactFromComp/'+vue.entreprise.Id,
                type: 'GET',
                success: function(d, status, xhr){
                    contacts = JSON.parse(d)
                    contacts.forEach(c => {
                        contact = new Contact(c['id'], c['nom'], c['prenom'], c['phone'], c['mail'], c['enibien'])
                        vue.contacts.push(contact)
                    });
                },
                error: function(xhr, status, error){
                    console.log(xhr)
                    console.log('Erreur : ' + error + '\nStatus : ' + status)
                }
            })
        }
    },
    mounted() {
        var link = document.location.href.split('/')
        var id = link[link.length - 1]
        this.getCompany(id)
        this.getContacts()
    }
})