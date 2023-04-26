//funcoes para o projeto
import { storage } from "../libs/firebase";
import { Photo } from "../types/Photo";
//propiedades firebase utilizads
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { v4 as createId } from "uuid";

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
//funcao que verifica se oq e enviado e uma imagem na extensão permitida
//no file vem o type
export const insert = async (file: File) => {
  if (["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
    let randomName = createId();
    let newFile = ref(storage, `images/${randomName}`);
    let upload = await uploadBytes(newFile, file);
    let photoUrl = await getDownloadURL(upload.ref);

    return {
      name: upload.ref.name,
      url: photoUrl,
    } as Photo;
  } else {
    return new Error("Tipo de arquivo não permitido");
  }
};

export const deletePhoto = async (name: string) => {
  let photoRef = ref(storage, `images/${name}`);
  await deleteObject(photoRef);
};
