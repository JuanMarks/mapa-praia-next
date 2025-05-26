import { useState } from 'react';
import { Modal, Carousel, Image } from 'react-bootstrap';
import { PontoTuristico } from '@/types/ponto';

interface Props {
  ponto: PontoTuristico;
}

const PopupContent = ({ ponto }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setStartIndex(index);
    setModalOpen(true);
  };

  return (
    <div>
      <h5>{ponto.nome}</h5>
      <p>{ponto.descricao}</p>

      {ponto.fotosOficiais && ponto.fotosOficiais.length > 0 && (
        <div className="d-flex flex-wrap gap-2">
          {ponto.fotosOficiais.map((url, index) => (
            <Image
              key={index}
              src={url}
              thumbnail
              width={80}
              height={80}
              style={{ objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
      )}

      <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{ponto.nome}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel activeIndex={startIndex} onSelect={(i) => setStartIndex(i)} interval={null}>
            {ponto.fotosOficiais?.map((url, idx) => (
              <Carousel.Item key={idx}>
                <img className="d-block w-100" src={url} alt={`Imagem ${idx + 1}`} />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PopupContent;
