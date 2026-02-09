'use client';

import { Label } from '@/components/ui/label';
import { useDropForm } from '@/hooks/use-drop-form';
import { UploadCloud, X, Plus as PlusIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export function StepUploads() {
    const { coverImage, previewImages, setCoverImage, addPreviewImage, removePreviewImage } = useDropForm();

    const onDropCover = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setCoverImage(acceptedFiles[0]);
        }
    }, [setCoverImage]);

    const onDropPreview = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            addPreviewImage(file);
        });
    }, [addPreviewImage]);

    const { getRootProps: getCoverProps, getInputProps: getCoverInputProps } = useDropzone({
        onDrop: onDropCover,
        maxFiles: 1,
        accept: { 'image/*': [] }
    });

    const { getRootProps: getPreviewProps, getInputProps: getPreviewInputProps } = useDropzone({
        onDrop: onDropPreview,
        maxFiles: 10,
        accept: { 'image/*': [] }
    });

    return (
        <div className="space-y-6">
            {/* Cover Image */}
            <div className="space-y-2">
                <Label>Cover Image (Required)</Label>
                <div
                    {...getCoverProps()}
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-white/5 transition-colors cursor-pointer"
                >
                    <input {...getCoverInputProps()} />
                    {coverImage ? (
                        <div className="relative group w-full h-48 rounded-md overflow-hidden">
                            <img
                                src={URL.createObjectURL(coverImage)}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                                Click to replace
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                                <UploadCloud className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-medium">Click or drag cover image here</p>
                            <p className="text-xs">Supports JPG, PNG, WEBP (Max 5MB)</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Gallery */}
            <div className="space-y-2">
                <Label>Gallery / Sneak Peeks</Label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Upload Button Block */}
                    <div
                        {...getPreviewProps()}
                        className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center hover:bg-secondary/50 transition-colors cursor-pointer text-muted-foreground"
                    >
                        <input {...getPreviewInputProps()} />
                        <PlusIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs font-medium">Add Image</span>
                    </div>

                    {/* List */}
                    {previewImages.map((file, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-border">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${idx}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); removePreviewImage(idx); }}
                                className="absolute top-2 right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
