import Categoria from "../categorias/categorias-model.js";

export const defaultCategoria = async() => {
    try {
        const categoriaExists = await Categoria.findOne({ nombre: "Hogar"});

        if(!categoriaExists){
            const categoria = new Categoria({
                nombre: "Hogar",
                descripcion: "Todo lo que tiene que ver con la casa/hogar"            
            })
            
            await categoria.save();
            console.log("Categoria creada con exito");
        }else{
            console.log("Categoria hogar ya existente");
        }
    } catch (error) {
        console.log("Error al crear la categoria")
    }
}