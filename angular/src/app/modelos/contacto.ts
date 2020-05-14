export class Contacto{

    //Paso las propiedades al constructor con el formato de TypeScript
    constructor(
        public id: number,
        public ip: number,
        public direccion: string,
        public email: string,
        public telefono: number,
        public asunto: string,
        public mensaje: string
    ){}
}