export class Medio{

    //Paso las propiedades al constructor con el formato de TypeScript
    constructor(
        public id: number,
        public nombre: string,
        public ruta: string,
        public tipo: string,
        public estado: string,
        public titulo: string,
        public texto_alt: string,
        public leyenda: string,
        public descripcion: string,
        public createAt: any,
    ){}
}