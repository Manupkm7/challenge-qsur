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
}

export function CardProduct({ id, title, description, status, createdAt, image, onImageChange }: CardProductProps) {
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
            onImageChange?.(id, result)
        }
        reader.readAsDataURL(file)
    }

    const handleRemoveImage = () => {
        setImagePreview(null)
        onImageChange?.(id, null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }
    console.log(status)
    return (
        <div className="overflow-hidden transition-all hover:shadow-md">
            {/* Image area */}
            <div className="relative">
                {imagePreview ? (
                    <div className="relative h-48 w-full">
                        <image href={imagePreview || "/placeholder.svg"} className="object-cover" />
                        <Button
                            variant="secondary"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={handleRemoveImage}
                        >
                            <CloseIcon className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div
                        className="flex h-48 w-full cursor-pointer flex-col items-center justify-center bg-muted/50 text-muted-foreground hover:bg-muted/70"
                        onClick={handleImageClick}
                    >
                        <ImageIcon className="mb-2 h-10 w-10" />
                        <div className="flex items-center gap-1">
                            <UploadIcon className="h-4 w-4" />
                            <span>Subir imagen</span>
                        </div>
                    </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>

            {/* Card content */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-semibold">{title}</h2>
                    <Badge variant={status === "active" ? "default" : status === "inactive" ? "secondary" : "outline"}>
                        {status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="border-t bg-muted/30 px-4 py-2">
                <div className="text-xs text-muted-foreground">Creado: {formatDate(createdAt)}</div>
            </div>
        </div>
    )
}