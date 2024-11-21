import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface WarningModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to remove this item from the cart?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarningModal;
