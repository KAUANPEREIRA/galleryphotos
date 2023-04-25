//funcoes para o projeto
import { storage } from "../libs/firebase";
import { Photo } from "../types/Photo";
//propiedades firebase utilizads
import { getDownloadURL, listAll, ref } from "firebase/storage";

//firebase para usar algo fazer uma referencia antes no caso quero usar images, criando ref
//const photoList = await listAll(imagemFolder); listar tudo que encontrou na pasta

export const getAll = async () => {
  let list: Photo[] = [];

  const imagemFolder = ref(storage, "images");
  const photoList = await listAll(imagemFolder);

  for (let i in photoList.items) {
    let photoUrl = await getDownloadURL(photoList.items[i]);
    list.push({
      name: photoList.items[i].name,
      url: photoUrl,
    });
  }

  return list;
};
