import { useState, useRef } from "react"
import { MdClose as CloseIcon } from "@react-icons/all-files/md/MdClose";
import { MdFileUpload as UploadIcon } from "@react-icons/all-files/md/MdFileUpload";
import { MdImage as ImageIcon } from "@react-icons/all-files/md/MdImage";
import { MdCheckCircle as CheckCircle } from "@react-icons/all-files/md/MdCheckCircle";

import { toast } from 'react-toastify';

import Button from "../Button";
import { Badge } from "../Badge";
import ToolTip from "../Tooltip";

type CardProductBaseProps = {
    id: number
    title: string
    description: string
    status: "active" | "inactive"
    price: string;
    createdAt: Date
    image?: string
    quantity: number
}

export type CardProductProps = CardProductBaseProps & {
    viewMode: "grid" | "list"
    onImageChange?: (id: number, image: string | null) => void
    onCardClick?: (card: Omit<CardProductBaseProps, "viewMode">) => void
    onStatusChange?: (id: number) => void
}

export function CardProduct({ id, title, description, status, createdAt, image, onImageChange, onCardClick, viewMode, price, onStatusChange, quantity }: CardProductProps) {
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
            price,
            quantity
        })

    }

    const handleMarkAsSold = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent card click when marking as sold
        onStatusChange?.(id)
    }

    // Format price with currency
    const formatPrice = (value?: string) => {
        if (value === undefined) return ""
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "ARS",
        }).format(Number(value))
    }

    if (viewMode === "list") {
        return (
            <div className="overflow-hidden transition-all hover:shadow-md cursor-pointer border-2 rounded-lg" onClick={handleCardClick}>
                <div className="flex">
                    {/* Image area */}
                    <div className="relative w-24 sm:w-32 sm:h-32 flex-shrink-0" data-testid="image-upload-area">
                        {imagePreview ? (
                            <div className="relative h-full w-full">
                                <img src={imagePreview || "/placeholder.svg"} data-testid="image-preview" alt={title} className="object-contain h-full w-full" />
                                <Button
                                    variant="destructive"
                                    data-testid="remove-image-button"
                                    className="absolute top-1 right-1 px-[4px] py-[4px] rounded-[50%] opacity-80 hover:opacity-100"
                                    onClick={handleRemoveImage}
                                >
                                    <CloseIcon className="h-3 w-3" />
                                </Button>
                            </div>
                        ) : (
                            <div
                                className="flex h-full w-full cursor-pointer flex-col items-center justify-center bg-muted/50 text-muted-foreground hover:bg-muted/70"
                                data-testid="image-upload-area"
                                onClick={handleImageClick}
                            >
                                <ImageIcon className="h-6 w-6" />
                                <div className="flex items-center gap-1 text-xs">
                                    <UploadIcon className="h-3 w-3" />
                                    <span>Subir</span>
                                </div>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} data-testid="file-input" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </div>

                    {/* Card content */}
                    <div className="flex flex-col flex-1 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h2 className="font-semibold" data-testid="title">{title}</h2>
                                {price !== undefined && <div className="text-sm font-medium text-primary" data-testid="price">{formatPrice(price)}</div>}
                                <div className="text-sm font-medium" data-testid="stock-quantity">Stock: {quantity}</div>

                            </div>
                            <Badge testId="status" variant={status === "active" ? "default" : "secondary"}>
                                {status === "active" ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-muted-foreground" data-testid="description">{description}</p>

                            {status === "active" && price !== undefined && (
                                <ToolTip tooltip="Vender una unidad">
                                    <Button variant="primary" testId="sell-button" className="h-[30px] w-[30px] py-[4px] px-[4px]" onClick={handleMarkAsSold}>
                                        <CheckCircle className="h-4 w-4" />
                                    </Button></ToolTip>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2" data-testid="created-date">Creado: {formatDate(createdAt)}</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="overflow-hidden transition-all hover:shadow-md border-2 rounded-lg w-[400px] bg-white cursor-pointer" onClick={handleCardClick}>
            {/* Image area */}
            <div className="relative" data-testid="image-upload-area">
                {imagePreview ? (
                    <div className="h-48 w-full">
                        <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="object-cover h-[200px] w-full" />
                        <Button
                            variant="destructive"
                            className="absolute top-2 right-2 px-[6px] py-[6px] !rounded-[50%]"
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
                <input type="file" ref={fileInputRef} data-testid="file-input" disabled={id ? true : false} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>

            {/* Card content */}
            <div className="p-4 border-t-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-lg leading-none" data-testid="title">{title}</h2>
                        <span className="text-muted-foreground text-lg leading-none" data-testid="price">{price ? formatPrice(price) : "Fuera de stock"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge testId="status" variant={status === "active" ? "default" : status === "inactive" ? "secondary" : "outline"}>
                            {status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                        {status === "active" && price !== undefined && (
                            <ToolTip tooltip="Vender una unidad">
                                <div>
                                    <Button variant="primary" className="h-[30px] w-[30px] py-[4px] px-[4px]" testId="sell-button" onClick={handleMarkAsSold}>
                                        <CheckCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            </ToolTip>
                        )}
                    </div>

                </div>
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground" data-testid="description">{description}</p>
                    <div className="text-sm font-[600]" data-testid="stock-quantity">Stock: {quantity}</div>

                </div>
            </div>

            <div className="border-t-2 bg-muted/30 px-4 py-2">
                <div className="text-xs text-muted-foreground" data-testid="created-date">Creado: {formatDate(createdAt)}</div>
            </div>
        </div>
    )
}