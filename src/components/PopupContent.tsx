import { useState } from 'react';
import { Modal, Carousel, Image } from 'react-bootstrap';
import { PontoTuristico } from '@/types/ponto';
import image1 from '../../public/images/3704180118_2bfb6685b3_c.jpg';

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
    <div className=' w-[400px]'>
      <h5>{ponto.nome}</h5>
      <p>{ponto.descricao}</p>

      <div className="grid grid-cols-3 w-60">
          <div key="" className="w-full cursor-pointer">
            <img
              src={image1.src}
              alt={`Imagem `}
              className="w-75 h-75 md:h-40 lg:h-48 object-cover rounded"
            />
          </div>
      </div>

      <Modal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        centered
        className='w-[50vw]'
      >
        <div className='w-[50vw] mx-auto'>
          <Modal.Header closeButton>
            <Modal.Title>{ponto.nome}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <div className="w-full h-full p-4">
              <Carousel activeIndex={startIndex} onSelect={(i) => setStartIndex(i)} interval={null}>
                
                  <Carousel.Item key="">
                    <img
                      className="block w-full h-[400px] object-cover rounded-lg"
                      src={``}
                      alt={``}
                    />
                  </Carousel.Item>
                
              </Carousel>
            </div>
          </Modal.Body>
        </div>
      </Modal>

          </div>
        );
      };

export default PopupContent;
