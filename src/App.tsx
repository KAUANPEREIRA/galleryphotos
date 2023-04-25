import { useEffect, useState } from "react";
import * as C from "./App.styles";
import { PhotoItem } from "./components/PhotoItem";
import * as Photos from "./services/photos";
import { Photo } from "./types/Photo";
const App = () => {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true);
      setPhotos(await Photos.getAll());
      setLoading(false);
    };
    getPhotos();
  }, []);

  const handleFormSubmit = () => {};
  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de fotos</C.Header>

        {loading && (
          <C.ScreenWarning>
            <div className="emoji"> 🤚 </div>
            <div>Carregando...</div>
          </C.ScreenWarning>
        )}

        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" name="Enviar" />
        </C.UploadForm>

        {!loading && photos.length > 0 && (
          <C.Photolist>
            {photos.map((item, index) => {
              return <PhotoItem key={index} name={item.name} url={item.url} />;
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
