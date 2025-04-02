import { useState, useRef, useEffect } from "react"
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

type EditItemModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    card: CardProductProps | null
    onSave: (card: CardProductProps) => void
    onDelete: (id: number) => void
}

export function EditItemModal({ open, onOpenChange, card, onSave, onDelete }: EditItemModalProps) {
    const dark = useRecoilValue(darkModeAtom)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState<LabelValue>({ label: "Activo", value: "active" })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Update form when card changes
    useEffect(() => {
        if (card) {
            setTitle(card.title)
            setDescription(card.description)
            setStatus({ label: card.status === "active" ? "Activo" : "Inactivo", value: card.status })
            setImagePreview(card.image || null)
        }
    }, [card])

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        if (!title.trim()) {
            toast.error("Por favor, ingresa un título")
            return
        }

        // Update card
        onSave({
            id: card?.id || 0,
            title,
            description,
            status: status.value as "active" | "inactive",
            image: imagePreview || undefined,
            createdAt: card?.createdAt || new Date()
        })

        // Reset form
        onOpenChange(false)
        toast.success("Tarjeta actualizada correctamente");
    }

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setStatus({ label: "Activo", value: "active" })
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleClose = () => {
        resetForm()
        onOpenChange(false)
    }

    const handleDelete = () => {
        if (!card) return

        if (window.confirm("¿Estás seguro de que deseas eliminar esta tarjeta?")) {
            onDelete(card.id)
            onOpenChange(false)
        }
    }

    if (!card) return null

    return (
        <ModalLayout title="Editar tarjeta" show={open} handleToggle={handleClose}>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">Completa los campos para actualizar la tarjeta.</p>
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
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
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
                        />
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
                        />
                    </div>

                    {/* Status */}
                    <div className="grid gap-2">
                        <label htmlFor="status">Estado</label>
                        <Select<LabelValue>
                            placeholder="Selecciona un estado"
                            onChange={(e) => setStatus(e)}
                            options={STATUS_OPTIONS}
                            dark={dark}
                            value={status}
                            extractLabel={(option) => option.label}
                            extractValue={(option) => option.value} />

                    </div>
                </div>

                <footer className="flex gap-2 justify-between items-center">
                    <Button type="button" variant="primary" className="bg-red-500" onClick={handleDelete}>
                        Eliminar
                    </Button>
                    <div className="flex gap-2 items-center">
                        <Button type="button" variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">Guardar</Button>
                    </div>

                </footer>
            </form>
        </ModalLayout>

    )
}
