import { FormEvent, useEffect, useState } from "react";
import * as C from "./App.styles";
import { PhotoItem } from "./components/PhotoItem";
import * as Photos from "./services/photos";
import { Photo } from "./types/Photo";
const App = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    getPhotos();
  }, []);

  const getPhotos = async () => {
    setLoading(true);
    setPhotos(await Photos.getAll());
    setLoading(false);
  };

  //para arquivos se utiliza o form data

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //para o comportamento padrao de envio

    const formData = new FormData(e.currentTarget);
    const file = formData.get("image") as File;

    if (file && file.size > 0) {
      setUploading(true);
      //fazer envio do arquivo
      let result = await Photos.insert(file);
      setUploading(false);

      if (result instanceof Error) {
        alert(`${result.name} - ${result.message}`);
      } else {
        let newPhotoList = [...photos];
        newPhotoList.push(result);
        setPhotos(newPhotoList);
      }
    }
  };

  const handleDeleteClick = async (name: string) => {
    await Photos.deletePhoto(name);
    getPhotos();
  };
  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de fotos</C.Header>

        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" name="Enviar" />
          {uploading && "Enviando..."}
        </C.UploadForm>

        {loading && (
          <C.ScreenWarning>
            <div className="emoji"> 🤚 </div>
            <div>Carregando...</div>
          </C.ScreenWarning>
        )}

        {!loading && photos.length > 0 && (
          <C.Photolist>
            {photos.map((item, index) => {
              return (
                <PhotoItem
                  key={index}
                  name={item.name}
                  url={item.url}
                  onDelete={handleDeleteClick}
                />
              );
            })}
          </C.Photolist>
        )}

        {!loading && photos.length === 0 && (
          <C.ScreenWarning>
            <div className="emoji"> 😞 </div>
            <div>Não há fotos cadastradas</div>
          </C.ScreenWarning>
        )}
      </C.Area>
    </C.Container>
  );
};

export default App;
