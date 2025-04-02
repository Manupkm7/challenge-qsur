import { useState, useRef } from "react"
import { MdClose as CloseIcon } from "@react-icons/all-files/md/MdClose";
import { MdFileUpload as UploadIcon } from "@react-icons/all-files/md/MdFileUpload";
import { MdImage as ImageIcon } from "@react-icons/all-files/md/MdImage";

import { toast } from 'react-toastify';

import Button from "../Button";
import { Badge } from "../Badge";

export type CardProductProps = {
    id: number
    title: string
    description: string
    status: "active" | "inactive"
    createdAt: Date
    image?: string
    onImageChange?: (id: number, image: string | null) => void
    onCardClick?: (card: CardProductProps) => void
}

export function CardProduct({ id, title, description, status, createdAt, image, onImageChange, onCardClick }: CardProductProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(image || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Format date to a readable string
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent card click when clicking on image upload area
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
            onImageChange?.(id, result)
        }
        reader.readAsDataURL(file)
    }

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent card click when removing image
        setImagePreview(null)
        onImageChange?.(id, null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }


    const handleCardClick = () => {
        onCardClick?.({
            id,
            title,
            description,
            status,
            createdAt,
            image: imagePreview || undefined,
        })
    }

    return (
        <div className="overflow-hidden transition-all hover:shadow-md border-2 rounded-lg w-[400px] bg-white cursor-pointer" onClick={handleCardClick}>
            {/* Image area */}
            <div className="relative">
                {imagePreview ? (
                    <div className="h-48 w-full">
                        <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="object-cover h-[200px] w-full" />
                        <Button
                            variant="destructive"
                            className="absolute top-2 right-2 px-[8px] rounded-[100%] "
                            onClick={handleRemoveImage}
                        >
                            <CloseIcon className="h-4 w-4" color="white" />
                        </Button>
                    </div>
                ) : (
                    <div
                        className="flex h-48 w-full cursor-pointer flex-col items-center justify-center bg-muted/50 text-muted-foreground hover:bg-muted/70"
                        onClick={id ? undefined : handleImageClick}
                    >
                        <ImageIcon className="mb-2 h-10 w-10" />
                        <div className="flex items-center gap-1">
                            <UploadIcon className="h-4 w-4" />
                            <span>Subir imagen</span>
                        </div>
                    </div>
                )}
                <input type="file" ref={fileInputRef} disabled={id ? true : false} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>

            {/* Card content */}
            <div className="p-4 border-t-2">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-semibold">{title}</h2>
                    <Badge variant={status === "active" ? "default" : status === "inactive" ? "secondary" : "outline"}>
                        {status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="border-t-2 bg-muted/30 px-4 py-2">
                <div className="text-xs text-muted-foreground">Creado: {formatDate(createdAt)}</div>
            </div>
        </div>
    )
}