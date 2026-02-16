import { NextResponse } from 'next/server';
import minioClient, { DEFAULT_BUCKET_NAME, ensureBucketExists, resolveBucketName } from '@/lib/features/minio/minio-client';

export async function DELETE(
    request: Request,
    { params }: { params: { filename: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const bucketName = resolveBucketName(searchParams.get('name') || searchParams.get('bucketName') || DEFAULT_BUCKET_NAME);
        await ensureBucketExists(bucketName);

        const filename = decodeURIComponent(params.filename);
        await minioClient.removeObject(bucketName, filename);
        return NextResponse.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json(
            { error: 'Error deleting file' },
            { status: 500 }
        );
    }
}
