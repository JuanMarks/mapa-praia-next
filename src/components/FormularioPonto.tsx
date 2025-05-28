import { useState, ChangeEvent, FormEvent } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Props {
  coordenadas: [number, number];
  onClose: () => void;
  onCriado: () => void;
}

const FormularioPonto = ({ coordenadas, onClose, onCriado }: Props) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [iconeUrl, setIconeUrl] = useState('');
  const [fotos, setFotos] = useState<FileList | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(iconeUrl)
    // 1. Cria o ponto
    const res = await fetch('http://localhost:3000/pontos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        descricao,
        latitude: coordenadas[0],
        longitude: coordenadas[1],
        iconeUrl: iconeUrl || "https://cdn-icons-png.flaticon.com/512/854/854878.png"
      }),
    });

    const novoPonto = await res.json();

    // 2. Envia as imagens, se tiver
    if (fotos && fotos.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < fotos.length; i++) {
        formData.append('fotos', fotos[i]);
      }

      await fetch(`http://localhost:3000/pontos/${novoPonto.id}/fotos`, {
        method: 'POST',
        body: formData,
      });
    }

    onCriado();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotos(e.target.files);
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Adicionar novo ponto</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Nome</Form.Label>
            <Form.Control value={nome} onChange={(e) => setNome(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Ícone (URL)</Form.Label>
            <Form.Control value={iconeUrl} onChange={(e) => setIconeUrl(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Fotos oficiais</Form.Label>
            <Form.Control type="file" multiple onChange={handleFileChange} />
          </Form.Group>

          <p className="text-muted">
            Local: {coordenadas[0].toFixed(5)}, {coordenadas[1].toFixed(5)}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Salvar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FormularioPonto;
