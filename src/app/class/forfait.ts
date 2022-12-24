export class Forfait {
    operateur: string;
    nom: string;
    sms: number;
    appel: number;
    data: number;
    validite: number;
    prix: number;

    constructor() {
        this.operateur = ""
        this.appel = 0;
        this.sms = 0;
        this.data = 0;
        this.validite = 0;
        this.prix = 0;
        this.nom = "";
    }

}
