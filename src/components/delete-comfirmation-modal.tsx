import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from '@heroui/react'

interface DeleteComfirmationModalProps {
  message?: string
  okText?: string
  cancelText?: string
  isOpen: boolean
  isLoading?: boolean
  onOpenChange: ModalProps['onOpenChange']
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteComfirmationModal({
  message = 'Are you sure you want to delete this item?',
  okText = 'Yes',
  cancelText = 'No',
  isOpen,
  isLoading,
  onOpenChange,
  onConfirm,
  onCancel,
}: DeleteComfirmationModalProps) {
  return (
    <Modal
      backdrop='opaque'
      classNames={{
        backdrop:
          'bg-linear-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
    >
      <ModalContent>
        <ModalHeader className='pt-6'>{message}</ModalHeader>
        <ModalFooter className='pt-0'>
          <Button
            isDisabled={isLoading}
            color='danger'
            variant='light'
            onPress={onCancel}
          >
            {cancelText}
          </Button>
          <Button isLoading={isLoading} color='primary' onPress={onConfirm}>
            {okText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
