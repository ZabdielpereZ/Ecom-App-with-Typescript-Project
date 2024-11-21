import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface SuccessModalProps {
  show: boolean;
  onHide: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Success</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Item added to cart successfully!
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;
