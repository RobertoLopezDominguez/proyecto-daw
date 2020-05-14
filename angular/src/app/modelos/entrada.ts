export class entrada{

    //Paso las propiedades al constructor con el formato de TypeScript
    constructor(
        public id: number,
        public usuarioId: number,
        public categoria_id: number,
        public estado: string,
        public titulo: string,
        public contenido: string,
        public imagenId: number,
        public createAt: any,
        public updatedAt: any
    ){}
}