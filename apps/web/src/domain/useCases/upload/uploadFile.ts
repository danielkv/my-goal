import { supabase } from '@common/providers/supabase'

export async function uploadFileUseCase(file: File | string, bucketId: string): Promise<string> {
    if (typeof file === 'string') return file
    if (!(file instanceof File)) throw new Error('Formato da imagem inválido')

    const { data } = await supabase.storage.getBucket(bucketId)
    if (!data) {
        const { error: bucketError } = await supabase.storage.createBucket(bucketId, {
            public: true,
            allowedMimeTypes: ['image/*'],
        })
        if (bucketError) throw bucketError
    }

    const filename = _generateUniqueFilename(file.name)
    const { error: imageError, data: imageData } = await supabase.storage.from(bucketId).upload(filename, file)
    if (imageError) throw imageError

    return supabase.storage.from(bucketId).getPublicUrl(imageData.path).data.publicUrl
}

function _generateUniqueFilename(fileName: string): string {
    return `${Date.now()}-${fileName}`
}
