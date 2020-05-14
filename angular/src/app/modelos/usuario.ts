export class Usuario{

    //Paso las propiedades al constructor con el formato de TypeScript
    constructor(
        public id: number,
        public usuario: string,
        public email: string,
        public perfil_id: string,
        public password: string,
        public estado: string,
        public nombre: string,
        public apellidos: string,
        public imagen: string
    ){}
}