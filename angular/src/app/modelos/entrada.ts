export class Entrada{

    //Paso las propiedades al constructor con el formato de TypeScript
    constructor(
        public id: number,
        public usuario_id: number,
        public categoria_id: number,
        public estado: string,
        public titulo: string,
        public contenido: string,
        public imagen_id: string,
        public etiquetas: string[]
    ){}
}