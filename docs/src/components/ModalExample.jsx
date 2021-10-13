import React, { useState } from 'react';
import { Button, Modal } from '@dr.pogodin/react-utils';

export default function ModalExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {
        open ? (
          <Modal onCancel={() => setOpen(false)}>
            <h1>Example Modal</h1>
            <Button onClick={() => setOpen(false)}>
              Click to close the Modal
            </Button>
          </Modal>
        ) : null
      }
      <Button onClick={() => setOpen(true)}>Click to open the Modal</Button>
    </>
  );
}
