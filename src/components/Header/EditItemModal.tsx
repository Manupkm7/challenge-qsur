// React
import { useState, useRef, useEffect } from 'react';

// Recoil
import { useRecoilValue } from 'recoil';
import { darkModeAtom } from '@/atoms/index';

// Librerías externas
import { toast } from 'react-toastify';

// Componentes
import Input from '@/components/Input';
import { CardProductProps } from '@/components/Cards/CardProduct';
import Button from '../Button';
import { Textarea } from '../Textarea';
import ModalLayout from '../Modal';
import { Select } from '../Select';

// Tipos
import { LabelValue } from '@/types/common';

// Iconos o SVGs
import { MdClose as CloseIcon } from '@react-icons/all-files/md/MdClose';
import { MdFileUpload as Upload } from '@react-icons/all-files/md/MdFileUpload';
import { MdImage as ImageIcon } from '@react-icons/all-files/md/MdImage';

/**
 * Modal para editar un producto existente.
 * 
 * Props:
 * - `open`: Indica si el modal está abierto.
 * - `onOpenChange`: Callback para manejar el estado del modal.
 * - `card`: Datos del producto a editar.
 * - `onSave`: Callback para guardar los cambios.
 * - `onDelete`: Callback para eliminar el producto.
 */

const STATUS_OPTIONS = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
];

type EditItemModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Omit<CardProductProps, 'viewMode'> | null;
  onSave: (card: Omit<CardProductProps, 'viewMode'>) => void;
  onDelete: (id: number) => void;
};

type ErrorMap = {
  title: string;
  price: string;
  quantity: string;
  description: string;
  status: string;
  image: string;
};

const errorMap = {
  title: '',
  price: '',
  quantity: '',
  description: '',
  status: '',
  image: '',
};

export function EditItemModal({ open, onOpenChange, card, onSave, onDelete }: EditItemModalProps) {
  const dark = useRecoilValue(darkModeAtom);
  const [price, setPrice] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<LabelValue>({ label: 'Activo', value: 'active' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [error, setError] = useState<ErrorMap>({
    title: '',
    price: '',
    quantity: '',
    description: '',
    status: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  // Update form when card changes
  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
      setStatus({ label: card.status === 'active' ? 'Activo' : 'Inactivo', value: card.status });
      setImagePreview(card.image || null);
      setPrice(card.price !== undefined ? card.price.toString() : '');
      setQuantity(card.quantity !== undefined ? card.quantity.toString() : '1');
    }
  }, [card]);

  // Modificar el useEffect para actualizar la cantidad a 0 cuando el estado cambia a inactivo
  useEffect(() => {
    if (status.value === 'inactive') {
      setQuantity('0');
    }
  }, [status]);

  const validateForm = (): boolean => {
    setLoading(true);
    const newErrors: ErrorMap = { ...errorMap };
    let isValid = true;

    // Validar título
    if (!title.trim()) {
      newErrors.title = 'El título es requerido';
      isValid = false;
    } else if (title.length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
      isValid = false;
    }

    // Validar precio
    if (!price.trim()) {
      newErrors.price = 'El precio es requerido';
      isValid = false;
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'El precio debe ser un número mayor a 0';
      isValid = false;
    }

    // Validar cantidad
    if (!quantity.trim()) {
      newErrors.quantity = 'La cantidad es requerida';
      isValid = false;
    } else if (isNaN(Number(quantity)) || Number(quantity) < 0) {
      newErrors.quantity = 'La cantidad debe ser un número mayor o igual a 0';
      isValid = false;
    }

    // Validar descripción
    if (!description.trim()) {
      newErrors.description = 'La descripción es requerida';
      isValid = false;
    } else if (description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
      isValid = false;
    }

    // Validar estado
    if (!status.value) {
      newErrors.status = 'El estado es requerido';
      isValid = false;
    }

    // Validar imagen
    if (!imagePreview) {
      newErrors.image = 'La imagen es requerida';
      isValid = false;
    }

    setError(newErrors);
    setLoading(false);
    return isValid;
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecciona una imagen válida');
      setError({ ...error, image: 'Por favor, selecciona una imagen válida' });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. El tamaño máximo es 5MB.');
      setError({ ...error, image: 'La imagen es demasiado grande. El tamaño máximo es 5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setError({ ...error, image: '' });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError({ ...error, image: 'La imagen es requerida' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Update card
    onSave({
      id: card?.id || 0,
      title,
      description,
      status: status.value as 'active' | 'inactive',
      image: imagePreview || undefined,
      createdAt: card?.createdAt || new Date(),
      price: price,
      quantity: parseInt(quantity),
    });

    // Reset form
    onOpenChange(false);
    toast.success('Tarjeta actualizada correctamente');
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus({ label: 'Activo', value: 'active' });
    setImagePreview(null);
    setError(errorMap);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!card) return;

    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarjeta?')) {
      onDelete(card.id);
      onOpenChange(false);
    }
  };

  const handlePriceChange = (num: string) => {
    // Only allow numbers and decimal point
    const value = num.replace(/[^0-9.]/g, '');
    setPrice(value);
    if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
      setError({ ...error, price: 'El precio debe ser un número mayor a 0' });
    } else {
      setError({ ...error, price: '' });
    }
  };

  const handleQuantityChange = (num: string) => {
    // Only allow positive integers
    const value = num.replace(/[^0-9]/g, '');
    setQuantity(value);
    if (value && (isNaN(Number(value)) || Number(value) < 0)) {
      setError({ ...error, quantity: 'La cantidad debe ser un número mayor o igual a 0' });
    } else {
      setError({ ...error, quantity: '' });
    }
  };

  if (!card) return null;

  return (
    <ModalLayout title="Editar tarjeta" show={open} handleToggle={handleClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Completa los campos para actualizar la tarjeta.
          </p>
        </div>

        <div className="grid gap-4 py-4">
          {/* Image upload */}
          <div className="relative">
            {imagePreview ? (
              <div className="relative h-48 w-full rounded-md overflow-hidden">
                <img
                  src={imagePreview || '/placeholder.svg'}
                  alt="Preview"
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="absolute top-2 right-2 px-[8px] rounded-[100%]"
                  testId='remove-image-button'
                  onClick={handleRemoveImage}
                >
                  <CloseIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/25 bg-muted/50 text-muted-foreground hover:bg-muted/70"
                onClick={handleImageClick}
              >
                <ImageIcon className="mb-2 h-10 w-10" />
                <div className="flex items-center gap-1">
                  <Upload className="h-4 w-4" />
                  <span>Subir imagen</span>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              data-testid="file-input"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            {error.image && (
              <p className="text-red-500 text-sm mt-1" data-testid="error-image">
                {error.image}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="grid gap-2">
            <label htmlFor="title">Título</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e);
                if (e.length < 3) {
                  setError({ ...error, title: 'El título debe tener al menos 3 caracteres' });
                } else {
                  setError({ ...error, title: '' });
                }
              }}
              placeholder="Ingresa un título"
              required
              testId="title-input"
            />
            {error.title && (
              <p className="text-red-500 text-sm" data-testid="error-title">
                {error.title}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="grid gap-2">
            <label htmlFor="price">Precio</label>
            <Input
              id="price"
              type="text"
              value={price}
              onChange={(e) => handlePriceChange(e)}
              placeholder="0.00"
              testId="price-input"
              className="font-mono"
            />
            {error.price && (
              <p className="text-red-500 text-sm" data-testid="error-price">
                {error.price}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="grid gap-2">
            <label htmlFor="edit-quantity">Cantidad</label>
            <Input
              id="edit-quantity"
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="1"
              className="font-mono"
              testId="quantity-input"
            />
            {error.quantity && (
              <p className="text-red-500 text-sm" data-testid="error-quantity">
                {error.quantity}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <label htmlFor="description">Descripción</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (e.target.value.length < 10) {
                  setError({
                    ...error,
                    description: 'La descripción debe tener al menos 10 caracteres',
                  });
                } else {
                  setError({ ...error, description: '' });
                }
              }}
              placeholder="Ingresa una descripción"
              className="min-h-[100px]"
              testId="description-input"
            />
            {error.description && (
              <p className="text-red-500 text-sm" data-testid="error-description">
                {error.description}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <label htmlFor="status">Estado</label>
            <Select<LabelValue>
              placeholder="Selecciona un estado"
              onChange={(e) => {
                setStatus(e);
                setError({ ...error, status: '' });
              }}
              options={STATUS_OPTIONS}
              dataTestId="status"
              dark={dark}
              value={status}
              extractLabel={(option) => option.label}
              extractValue={(option) => option.value}
            />
            {error.status && (
              <p className="text-red-500 text-sm" data-testid="error-status">
                {error.status}
              </p>
            )}
          </div>
        </div>

        <footer className="flex gap-2 justify-between items-center">
          <Button
            type="button"
            testId="delete-button"
            variant="primary"
            className="bg-red-500"
            onClick={handleDelete}
            isLoading={loading}
            disabled={loading}
          >
            Eliminar
          </Button>
          <div className="flex gap-2 items-center">
            <Button
              type="button"
              testId="cancel-button"
              variant="secondary"
              onClick={handleClose}
              isLoading={loading}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              testId="save-button"
              variant="primary"
              disabled={loading}
              isLoading={loading}
            >
              Guardar
            </Button>
          </div>
        </footer>
      </form>
    </ModalLayout>
  );
}
