import { useState, useRef } from "react"
import { MdClose as CloseIcon } from "@react-icons/all-files/md/MdClose";
import { MdFileUpload as Upload } from "@react-icons/all-files/md/MdFileUpload";
import { MdImage as ImageIcon } from "@react-icons/all-files/md/MdImage";
import Input from "@/components/Input"
import { CardProductProps } from "@/components/Cards/CardProduct"
import Button from "../Button";
import { toast } from "react-toastify";
import { Textarea } from "../Textarea";
import ModalLayout from "../Modal";
import { Select } from "../Select";
import { LabelValue } from "@/types/common";
import { useRecoilValue } from "recoil";
import { darkModeAtom } from "@/atoms/index";

const STATUS_OPTIONS = [
    { label: "Activo", value: "active" },
    { label: "Inactivo", value: "inactive" }
]

type NewCardModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (card: Omit<CardProductProps, "id" | "createdAt" | "viewMode">) => void
}

type ErrorMap = {
    title: string
    price: string
    quantity: string
    description: string
    status: string
    image: string
}

const errorMap = {
    title: "",
    price: "",
    quantity: "",
    description: "",
    status: "",
    image: ""
}

export function NewCardModal({ open, onOpenChange, onSave }: NewCardModalProps) {
    const dark = useRecoilValue(darkModeAtom)
    const [price, setPrice] = useState<string>("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState<LabelValue>({ label: "Activo", value: "active" })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [quantity, setQuantity] = useState<string>("1")
    const [error, setError] = useState<ErrorMap>(errorMap)
    const [loading, setLoading] = useState(false)

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check if file is an image
        if (!file.type.startsWith("image/")) {
            toast.error("Por favor, selecciona una imagen válida")
            return
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("La imagen es demasiado grande. El tamaño máximo es 5MB.")
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            const result = event.target?.result as string
            setImagePreview(result)
        }
        reader.readAsDataURL(file)
    }

    const handleRemoveImage = () => {
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const validateForm = (): boolean => {
        setLoading(true)
        const newErrors: ErrorMap = { ...errorMap }
        let isValid = true

        // Validar título
        if (!title.trim()) {
            newErrors.title = "El título es requerido"
            isValid = false
        } else if (title.length < 3) {
            newErrors.title = "El título debe tener al menos 3 caracteres"
            isValid = false
        }

        // Validar precio
        if (!price.trim()) {
            newErrors.price = "El precio es requerido"
            isValid = false
        } else if (isNaN(Number(price)) || Number(price) <= 0) {
            newErrors.price = "El precio debe ser un número mayor a 0"
            isValid = false
        }

        // Validar cantidad
        if (!quantity.trim()) {
            newErrors.quantity = "La cantidad es requerida"
            isValid = false
        } else if (isNaN(Number(quantity)) || Number(quantity) < 0) {
            newErrors.quantity = "La cantidad debe ser un número mayor o igual a 0"
            isValid = false
        }

        // Validar descripción
        if (!description.trim()) {
            newErrors.description = "La descripción es requerida"
            isValid = false
        } else if (description.length < 10) {
            newErrors.description = "La descripción debe tener al menos 10 caracteres"
            isValid = false
        }

        // Validar estado
        if (!status.value) {
            newErrors.status = "El estado es requerido"
            isValid = false
        }

        // Validar imagen
        if (!imagePreview) {
            newErrors.image = "La imagen es requerida"
            isValid = false
        }

        setError(newErrors)
        setLoading(false)
        return isValid
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        e.preventDefault()

        if (!validateForm()) {
            return
        }

        // Create new card
        onSave({
            title,
            description,
            status: status.value as "active" | "inactive",
            image: imagePreview || undefined,
            price,
            quantity: parseInt(quantity)
        })

        // Reset form
        resetForm()
        onOpenChange(false)
        toast.success("Tarjeta creada correctamente");
    }

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setStatus({ label: "Activo", value: "active" })
        setPrice("")
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleClose = () => {
        resetForm()
        onOpenChange(false)
    }

    const handlePriceChange = (e: string) => {
        // Only allow numbers and decimal point
        const value = e.replace(/[^0-9.]/g, "")
        setPrice(value)
    }
    const handleQuantityChange = (num: string) => {
        // Only allow positive integers
        const value = num.replace(/[^0-9]/g, "")
        setQuantity(value)
    }

    return (
        <ModalLayout title="Crear nueva tarjeta" show={open} handleToggle={handleClose}>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">Completa los campos para crear una nueva tarjeta.</p>
                </div>

                <div className="grid gap-4 py-4">
                    {/* Image upload */}
                    <div className="relative">
                        {imagePreview ? (
                            <div className="relative h-48 w-full rounded-md overflow-hidden">
                                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="object-cover" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="absolute top-2 right-2 px-[8px] rounded-[100%] "
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
                        <input type="file" ref={fileInputRef} data-testid="file-input" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </div>

                    {/* Title */}
                    <div className="grid gap-2">
                        <label htmlFor="title">Título</label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e)}
                            placeholder="Ingresa un título"
                            required
                            testId="title-input"
                        />
                        {error.title && <p className="text-red-500 text-sm" data-testid="error-title">{error.title}</p>}
                    </div>

                    {/* Price */}
                    <div className="grid gap-2">
                        <label htmlFor="price">Precio</label>
                        <Input
                            id="price"
                            type="text"
                            min={1}
                            value={price}
                            onChange={(e) => handlePriceChange(e)}
                            placeholder="0.00"
                            testId="price-input"
                            className="font-mono"
                        />
                        {error.price && <p data-testid="error-price" className="text-red-500 text-sm">{error.price}</p>}
                    </div>
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
                        {error.quantity && <p data-testid="error-quantity" className="text-red-500 text-sm">{error.quantity}</p>}
                    </div>

                    {/* Description */}
                    <div className="grid gap-2">
                        <label htmlFor="description">Descripción</label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ingresa una descripción"
                            className="min-h-[100px]"
                            testId="description-input"
                        />
                        {error.description && <p data-testid="error-description" className="text-red-500 text-sm">{error.description}</p>}

                    </div>

                    {/* Status */}
                    <div className="grid gap-2">
                        <label htmlFor="status">Estado</label>
                        <Select<LabelValue>
                            placeholder="Selecciona un estado"
                            dataTestId="status-select"
                            onChange={(e) => setStatus(e)}
                            options={STATUS_OPTIONS}
                            dark={dark}
                            value={status}
                            extractLabel={(option) => option.label}
                            extractValue={(option) => option.value} />
                        {error.status && <p data-testid="error-status" className="text-red-500 text-sm">{error.status}</p>}
                    </div>
                </div>

                <footer className="flex justify-end gap-2">
                    <Button type="button" testId="cancel-button" variant="secondary" disabled={loading} onClick={handleClose} isLoading={loading}>
                        Cancelar
                    </Button>
                    <Button type="submit" testId="save-button" variant="primary" disabled={loading} isLoading={loading}>Guardar</Button>
                </footer>
            </form>
        </ModalLayout>

    )
}
