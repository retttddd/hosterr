import { NextResponse } from 'next/server';
import minioClient from '@/lib/features/minio/minio-client';

export async function DELETE(
    request: Request,
    { params }: { params: { filename: string } }
) {
    try {
        const filename = decodeURIComponent(params.filename);
        await minioClient.removeObject('BUCKET_NAME', filename);
        return NextResponse.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json(
            { error: 'Error deleting file' },
            { status: 500 }
        );
    }
}
