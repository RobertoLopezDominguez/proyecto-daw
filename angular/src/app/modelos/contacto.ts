export class Contacto{

    //Paso las propiedades al constructor con el formato de TypeScript
    constructor(
        public id: number,
        public ip: string,
        public nombre: string,
        public direccion: string,
        public email: string,
        public telefono: string,
        public asunto: string,
        public mensaje: string
    ){}
}