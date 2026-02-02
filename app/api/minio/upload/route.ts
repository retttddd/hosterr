import { NextRequest, NextResponse } from 'next/server';
import minioClient, { BUCKET_NAME, initializeBucket } from '@/lib/features/minio/minio-client';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
    try {
        // Initialize bucket if it doesn't exist
        await initializeBucket();

        const data = await request.formData();
        const file = data.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);

        await minioClient.putObject(
            BUCKET_NAME,
            file.name,
            stream,
            buffer.length,
            { 'Content-Type': file.type }
        );

        return NextResponse.json({
            success: true,
            message: 'File uploaded successfully',
            fileName: file.name
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Error uploading file' },
            { status: 500 }
        );
    }
}
