export class Medio{

    //Paso las propiedades al constructor con el formato de TypeScript
    constructor(
        public id: number,
        public nombre: string,
        public ruta: string,
        public tipo: number,
        public estado: string,
        public titulo: string,
        public textoAlt: string,
        public leyenda: string,
        public descripcion: string,
        public createAt: any,
    ){}
}